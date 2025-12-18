import { render, waitFor, fireEvent, screen, within } from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import RoleManagerss from '../../pages/RoleManager/RoleManagers';
import { ProjectProvider } from '../../ProjectContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import { prettyDOM } from '@testing-library/dom';

// "test": "set DEBUG_PRINT_LIMIT=100000 && react-scripts test",

jest.mock('sweetalert2');

// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios);
// const mockDispatch = jest.fn();

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

// Test Suite 1
describe('Test suite 1', () => {
    let mockData;
    let wrapper;
    const mockPermissions = ["canClickOnGuidedTourUnderWelcomeToRoleManagerInHomePage", "canClickOnInfoUserGroup"];

    // some setup code before each test in your suite.
    beforeEach(async () => {
        mock.reset();
        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);
        const mockPermissions = ["canClickOnUserGroupName", "canClickOnInfoUserGroup", "canClickOnEditUserGroup", "canClickOnDeleteUserGroup", "canClickOnGuidedTourUnderWelcomeToRoleManagerInHomePage"];
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

        let mockDataUserGroups;
        let mockDataProjectSites;

        mockDataUserGroups = [
            {
                groupName: 'Infy3UG',
                id: 3,
                memberCount: 2,
                projectSites: [
                    { projectSiteName: 'JTC2', projectSiteAlias: 'JTC2' },
                    { projectSiteName: 'INFOSYS', projectSiteAlias: 'Infosys MG Site' },
                    { projectSiteName: 'Test2_infy', projectSiteAlias: 'Infosys Test2 project site' },
                ],
            },
        ];

        mockDataProjectSites = [
            {
                description: "INFOSYS",
                projectGroups: ["INFOSYS_Grp", "test_demo", "Test", "Infy3UG", "JTC2"],
                projectLocation: "Rohini,DL,IN",
                projectSiteAlias: "Infosys MG Site",
                projectSiteName: "INFOSYS"
            },
            // Add more project sites here if needed
        ];

        // Mock the axios get requests
        mock.onGet('/sites/project/projectSites').reply(200, mockDataProjectSites);
        mock.onGet('/sites/ugr/group/userGroups').reply(200, mockDataUserGroups);

        // Mock the delete request
        mock.onDelete(new RegExp('/sites/ugr/group/.*')).reply(200, { data: 'Group deleted successfully' });

        await act(async () => {
            wrapper = render(
                <Router>
                    <ProjectProvider>
                        <RoleManagerss />
                    </ProjectProvider>
                </Router>
            );
        });
    });

    // it("renders the Create User Group with model button", async () => {
    //     render(
    //         <Router>
    //             <ProjectProvider>
    //                 <RoleManagerss />
    //             </ProjectProvider>
    //         </Router>
    //     );
    //     fireEvent.click(screen.getByText("Create User Group"));
    // });


    it('renders the Profile correctly', () => {
        const elements = wrapper.getAllByText('Profile');
        elements.forEach(element => {
            expect(element).toBeInTheDocument();
        });
    });

    it('renders the My account correctly', () => {
        const elements = wrapper.getAllByText(/My Account/i);
        elements.forEach(element => {
            expect(element).toBeInTheDocument();
        });
    });

    it('tests simulates the clicking of Info button', async () => {
        waitFor(() => {
            // fireEvent.click(screen.findByTestId('info-button'))
            expect(screen.getByText(/Info/i)).toBeInTheDocument()
        })
    })

    it('logs all elements', () => {
        // Render your component
        const { container } = render(
            <Router>
                <ProjectProvider>
                    <RoleManagerss />
                </ProjectProvider>
            </Router>
        );

        // Log all elements
        console.log(prettyDOM(container), 'hhhhhhh');
    });

    it('should delete a user group', async () => {
        // Define selectedProject
        const selectedProject = 'Infy3UG'; // Replace 'Infy3UG' with the actual project you want to delete

        //mock the data with deleted user group
        const mockDataUserGroups = [
            {
                // groupName: 'Infy3UG',
                id: 3,
                memberCount: 2,
                projectSites: [
                    { projectSiteName: 'JTC2', projectSiteAlias: 'JTC2' },
                    { projectSiteName: 'INFOSYS', projectSiteAlias: 'Infosys MG Site' },
                    { projectSiteName: 'Test2_infy', projectSiteAlias: 'Infosys Test2 project site' },
                ],
            },
        ];

        // Mock the delete request
        mock.onDelete(new RegExp('/sites/ugr/group/.*')).reply(200, { data: 'Group deleted successfully' });

        // Perform the delete operation
        const response = await axios.delete(`/sites/ugr/group/${selectedProject}`);
        expect(response.status).toBe(200);
        expect(response.data).toEqual({ data: 'Group deleted successfully' });

        // Verify the user group no longer exists
        const getResponse = await axios.get('/sites/ugr/group/userGroups');
        expect(getResponse.data).not.toContainEqual(mockDataUserGroups.find(group => group.groupName === selectedProject));
    });

    it('should fetch all the user groups', async () => {
        const response = await axios.get('/sites/ugr/group/userGroups');
        expect(response.status).toBe(200);
        expect(response.data).toEqual([{
            groupName: 'Infy3UG',
            id: 3,
            memberCount: 2,
            projectSites: [
                { projectSiteName: 'JTC2', projectSiteAlias: 'JTC2' },
                { projectSiteName: 'INFOSYS', projectSiteAlias: 'Infosys MG Site' },
                { projectSiteName: 'Test2_infy', projectSiteAlias: 'Infosys Test2 project site' },
            ],
        }]);
    });

    it('should fetch project sites for the user groups', async () => {
        const response = await axios.get('/sites/project/projectSites');
        expect(response.status).toBe(200);
        expect(response.data).toEqual([{
            description: "INFOSYS",
            projectGroups: ["INFOSYS_Grp", "test_demo", "Test", "Infy3UG", "JTC2"],
            projectLocation: "Rohini,DL,IN",
            projectSiteAlias: "Infosys MG Site",
            projectSiteName: "INFOSYS"
        }]);
    });

    it('renders user group name correctly', async () => {
        // Act
        await waitFor(() => {
            // Assert
            expect(screen.getByText('Infy3UG')).toBeInTheDocument();
        });
    });


    it('renders the "Project Sites" column correctly', async () => {
        // Arrange
        const projectSitesCell = wrapper.getByText(/JTC2, Infosys MG Site.../i);

        // Assert
        expect(projectSitesCell).toBeInTheDocument();

        // Check if the cell contains a link with the correct onClick behavior
        const projectSitesLink = wrapper.getByText(/JTC2, Infosys MG Site.../i);
        expect(projectSitesLink).toBeInTheDocument();
        // Add more assertions to check the onClick behavior of the link
    });

    it('renders the "User Group" column correctly', async () => {
        // Arrange
        const userGroupCell = wrapper.getByRole('cell', { name: /Infy3UG/i });

        // Assert
        expect(userGroupCell).toBeInTheDocument();

        // Check if the cell contains a link with the correct href
        const userGroupLink = within(userGroupCell).getByRole('link', { name: /Infy3UG/i });
        expect(userGroupLink).toBeInTheDocument();
        expect(userGroupLink).toHaveAttribute('href', '/user-groups/Infy3UG');
    });

    it('renders the Create User Group button with disabled state for non-SuperAdmin users without permission', async () => {
        // Check if the button is disabled for non-SuperAdmin users without the necessary permission
        useSelector.mockImplementation((selector) => {
            if (selector.toString().includes('userRole')) return 'NonSuperAdmin';
            if (selector.toString().includes('canClickOnCreateUserGroup')) return false;
            if (selector.toString().includes('permissions')) return mockPermissions;
        });

        // Re-render the component
        await act(async () => {
            wrapper.rerender(
                <Router>
                    <ProjectProvider>
                        <RoleManagerss />
                    </ProjectProvider>
                </Router>
            );
        });

        const button = wrapper.getByText('Create User Group').closest('button');
        expect(button).toBeDisabled();
    });

    it('renders the User Group table', async () => {
        // Arrange
        await waitFor(() => {
            expect(wrapper.getByText('User Group')).toBeInTheDocument();
        });
        // Assert
        const table = wrapper.getByRole('grid');
        expect(table).toBeInTheDocument();
    });

    it('renders the User Group names in the table', async () => {
        // Arrange
        await waitFor(() => {
            expect(wrapper.getByText('User Group')).toBeInTheDocument();
        });
        // Assert
        const userGroupNames = ['Infy3UG']; // Add more user group names if needed
        userGroupNames.forEach((groupName) => {
            expect(wrapper.getByText(groupName)).toBeInTheDocument();
        });
    });

    it('renders the My User Groups heading', () => {
        expect(wrapper.getByText('My User Groups')).toBeInTheDocument();
    });

    it('renders without crashing', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper).toBeTruthy();
        });
    });

    it('renders the Create User Group button', async () => {
        await waitFor(() => {
            expect(wrapper.getByText(/Create User Group/i)).toBeInTheDocument();
        });
        // console.log(prettyDOM(wrapper.container, 10000), 'hhhhhhh');
    });

    it('renders the "Delete" dialog when open5 state is true', async () => {
        // Arrange
        const setState = jest.fn();
        const useStateSpy = jest.spyOn(React, 'useState');
        useStateSpy.mockImplementation((init) => [init === false ? true : init, setState]);
        const { findAllByText } = render(
            <Router>
                <ProjectProvider>
                    <RoleManagerss open5={true} />
                </ProjectProvider>
            </Router>
        );
        // Assert
        const deleteTextElements = await findAllByText(/Delete/i);
        deleteTextElements.forEach((element) => {
            expect(element).toBeInTheDocument();
        });
        // Cleanup
        useStateSpy.mockRestore();
    });



   


});






