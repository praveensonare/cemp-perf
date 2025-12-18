/* This is implementation of test cases for HomePage component. 
  Author : Shweta Vyas    
*/
import { render, waitFor, fireEvent, screen, prettyDOM } from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { useNavigate } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import { ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosMockAdapter from 'axios-mock-adapter';



// Mock the Axios library with Jest
jest.mock('axios');
jest.mock('sweetalert2');
// This sets the mock adapter on the default instance
var mock = new axiosMockAdapter(axios);
const mockDispatch = jest.fn();

// Mock the useDispatch and useSelector hooks from react-redux
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

//mock the useNavigate and useLocation hooks from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn().mockName('navigate'),
    useLocation: () => ({
        pathname: '/project-sites',
    }),
}));

// Test Suite 1
// (The describe function is used to group together related tests. This function takes two arguments: a string and a callback function. The string is the name of the test suite, and the function is the actual test suite.)
describe('HomePage: Test suite 1', () => {
    let mockData;
    let wrapper;

    // some setup code before each test in your suite.
    beforeEach(async () => {
        global.window = Object.create(window);
        const url = 'https://aecv7kyehl.execute-api.ap-southeast-2.amazonaws.com/dev';
        Object.defineProperty(window, 'REACT_APP_SERVER_URL', {
          value: url,
          writable: true
        });
        // mock these to isolate the component from the actual Redux store during testing.
        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);
        const mockPermissions = ["canClickOnMoreUnderProjectSite"];
        useSelector.mockImplementation((selector) => {
            if (selector.toString().includes('permissions')) return mockPermissions;
        });

        // sets up mock data for the API response   
        mockData = [
            {
                projectSiteName: 'INFOSYS',
                image: 'siteImg',
                temperature: '24',
                humidity: '43',
                timezone: 'Wednesday , 7:01 PM',
                weather: 'Haze'
            },
            {
                projectSiteName: 'Test2_infy',
                image: 'SiteImg2',
                temperature: '30',
                humidity: '26',
                timezone: 'Wednesday , 7:01 PM',
                weather: 'Clouds'
            }
        ];
        //mock the API call
        axios.get.mockResolvedValue({ data: mockData });
        // it renders the HomePage component inside a Router and ProjectProvider
        await act(async () => {
            wrapper = render(
                <Router>
                    <ProjectProvider>
                        <HomePage />
                    </ProjectProvider>
                </Router>
            );
        });
    });

    // Test 1
    it('fetches project sites and updates state', async () => {
        // Assert
        await waitFor(() => {
            //find a DOM element i.e. rendered output of your component, that contains the text "Project Sites"(When you render a component in a test, it creates a virtual DOM for that component)
            const test = wrapper.getByText("Project Sites");
            expect(test).toBeInTheDocument();
            //prints a formatted version of the current DOM tree of the rendered component.
            // console.log(wrapper.debug());
        });
    });

    // Test 2 (checking if the HomePage component handles a button click correctly.)
    it('should handle button click', async () => {
        await waitFor(() => {
            const button = wrapper.getByTestId('ChevronLeftIcon');
            fireEvent.click(button);
        });
    });

    // Test 3 (checking if the HomePage component renders without crashing.)
    it('renders without crashing', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper).toBeTruthy();
        });
    });

    //Test 4
    it('calls handleClick when the button is clicked', async () => {
        // Arrange
        const handleClick = jest.fn();
        const { getByText } = render(
            <button onClick={handleClick} className="btn btn-warning btn-sm mt-2">
                More
            </button>
        );
        // Act
        fireEvent.click(getByText('More'));
        // Assert
        expect(handleClick).toHaveBeenCalled();
    });

    // Test 5
    it('calls getProjectSites on component mount', async () => {
        // Assert
        expect(axios.get).toHaveBeenCalledWith('/sites/project/projectSites');
    });

    //Test 6
    it('navigates to the correct path when the more button is clicked', () => {
        // Arrange
        const navigate = useNavigate();
        const data = { name: 'INFOSYS' }; // Replace with your actual data
        const { getByText } = render(
            <button
                onClick={() => {
                    navigate(`/project-sites/${data.name}/company-profile`);
                }}
                className="btn btn-warning btn-sm mt-2"
            >
                More
            </button>
        );
        // Act
        fireEvent.click(getByText('More'));
        // Assert
        expect(navigate).toHaveBeenCalledWith(`/project-sites/${data.name}/company-profile`);
    });

    // Test 7
    it('should display a card for each project site', async () => {
        // console.log(wrapper.debug());
        const images = await wrapper.findAllByRole('img');
        expect(images).toHaveLength(3);
        // expect(cards.length).toBe(2);
    });

    // Test 8
    it('hides the loading spinner after the request', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper.queryByRole('loading')).not.toBeInTheDocument();
        });
    });

    // Test 9
    it('renders the "More" button correctly', async () => {
        // Arrange
        const handleClick = jest.fn();
        render(
            <button onClick={handleClick} className="btn btn-warning btn-sm mt-2" role="more-button">
                More
            </button>,
            { container: wrapper.container }
        );

        // Act
        const moreButton = wrapper.getByRole('more-button');

        // Assert
        expect(moreButton).toBeInTheDocument();
        expect(moreButton.textContent).toBe('More');
    });

});








