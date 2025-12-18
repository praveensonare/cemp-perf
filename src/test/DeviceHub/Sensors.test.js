import { render, waitFor, fireEvent, screen, within } from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import DataTable from '../../pages/DeviceHub/SensorList';
import BasicTabs, { a11yProps } from '../../pages/DeviceHub/Sensors';
import { ProjectProvider } from '../../ProjectContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';

// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios);

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
        pathname: '/user-groups',
    }),
}));

describe('a11yProps', () => {
    let wrapper;

    // Mock localStorage
    global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn()
    };

    // some setup code before each test in your suite.
    beforeEach(async () => {
        mock.reset();
        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);

        // Mock the localStorage getItem function
        global.localStorage.getItem = jest.fn().mockImplementation((key) => {
            if (key === 'projectSiteName') {
                return JSON.stringify('JTC2');
            } else {
                return null;
            }
        });
    });

    it('should return an object with id and aria-controls properties', () => {
        const index = 0;
        const result = a11yProps(index);
        expect(result).toEqual({
            id: 'simple-tab-0',
            'aria-controls': 'simple-tabpanel-0',
        });
    });

});

describe('test for BasicTabs', () => {
    let wrapper;
    let mockDispatch;
    let mockPermissions;
    let mockUserRole;

    beforeEach(async () => {
        mockDispatch = jest.fn();
        mockPermissions = [];
        mockUserRole = 'SuperAdmin';

        useDispatch.mockReturnValue(mockDispatch);
        useSelector.mockImplementation((selector) => {
            if (selector.toString().includes('permissions')) return mockPermissions;
            if (selector.toString().includes('userRole')) return mockUserRole;
        });

        await act(async () => {
            wrapper = render(
                <Router>
                    <ProjectProvider>
                        <BasicTabs />
                    </ProjectProvider>
                </Router>
            );
        });
    });

    it('renders the Sensor Type List tab when userRole is SuperAdmin', () => {
        expect(wrapper.getByText('Sensor Type List')).toBeInTheDocument();
    });

    it('renders the Sensors List tab when userRole is SuperAdmin', () => {
        expect(wrapper.getByText('Sensors List')).toBeInTheDocument();
    });

    it('renders the Sensors List tab when userRole is not SuperAdmin but has canClickSensorTab permission', async () => {
        mockUserRole = 'Admin';
        mockPermissions = ['canClickOnSensorList'];

        await act(async () => {
            wrapper.rerender(
                <Router>
                    <ProjectProvider>
                        <BasicTabs />
                    </ProjectProvider>
                </Router>
            );
        });

        expect(wrapper.getByText('Sensors List')).toBeInTheDocument();
    });
});

describe('Tests for SensorList', () => {
    let wrapper;

    // Mock localStorage
    global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn()
    };

    const setSensorList = jest.fn();
    const setIsLoading = jest.fn();

    // some setup code before each test in your suite.
    beforeEach(async () => {
        mock.reset();
        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);
        const mockPermissions = ["canClickInfoButton", "canClickDeleteButton", "canClickAddSensorButton"];
        useSelector.mockImplementation((selector) => {
            if (selector.toString().includes('permissions')) return mockPermissions;
        });

        // Mock the localStorage getItem function
        global.localStorage.getItem = jest.fn().mockImplementation((key) => {
            if (key === 'projectSiteName') {
                return JSON.stringify('JTC2');
            } else {
                return null;
            }
        });

        const useStateMock = jest.spyOn(React, 'useState');
        useStateMock.mockImplementation((init) => [init, setSensorList, setIsLoading]);


        await act(async () => {
            wrapper = render(
                <Router>
                    <ProjectProvider>
                        <DataTable />
                    </ProjectProvider>
                </Router>
            );
        });
    });

    it('renders without crashing', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper).toBeTruthy();
        });
    });

    it('renders the Sensors List table', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper.getByText('Sensors')).toBeInTheDocument();
        });
    });

    it('renders the Sensor Type column', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper.getByText('Sensor Type Name')).toBeInTheDocument();
        });
    });

    it('renders the Add Sensor button', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper.getByText('Add Sensor')).toBeInTheDocument();
        });
    });

    it('renders the Info button', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper.getByText('Info')).toBeInTheDocument();
        });
    });

    it('should have delete popup', () => {
        render(
            <Router>
                <ProjectProvider>
                    <DataTable />
                </ProjectProvider>
            </Router>
        );

        // Check if the DialogBox is in the document
        const dialogBox = screen.queryByRole('dialog');
        expect(dialogBox).toBeInTheDocument();
    });

});




