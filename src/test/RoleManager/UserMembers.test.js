import { render, waitFor, fireEvent, screen, within } from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DataTable from '../../pages/RoleManager/UserMembers';
import { ProjectContext, ProjectProvider } from '../../ProjectContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import Autocomplete from "@mui/material/Autocomplete";
import { logRoles } from '@testing-library/dom';
import { prettyDOM } from '@testing-library/dom';
import { DataGrid } from '@mui/x-data-grid';
import { columns } from '../../pages/RoleManager/UserMembers';
import UserMembers from '../../pages/RoleManager/UserMembers';
// "test": "set DEBUG_PRINT_LIMIT=100000 && react-scripts test",

jest.mock('sweetalert2');

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);
const mockDispatch = jest.fn();

// Mock the useDispatch and useSelector hooks from react-redux
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock("aws-amplify", () => ({
    Amplify: {
      configure: jest.fn(),
    },
    Auth: {
      currentAuthenticatedUser: jest.fn(() =>
        Promise.resolve({ username: "ram.krishan@infosys.com" })
      ),
    },
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
        const mockPermissions = ["canClickOnInfoUserGroupMember", "canClickOnEditUserGroupMember", "canClickOnDeleteUserGroupMember", "canClickOnAddMembersInOwnUserGroup"]
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


        // Mock the axios get requests
        mock.onGet(new RegExp('/sites/ugr/user/usersFromGroup/.*')).reply(200, [
            {
                "userEmail": "test456@gmail.com",
                "userRole": "Operator"
            },
            {
                "userEmail": "nitin_mahajan@Infosys.com",
                "userRole": "Admin"
            }
        ]);

        mock.onGet('/sites/rbac/rolesAndPermissions').reply(200, [
            {
                "Project Sites": [
                    {
                        "Landing Page": [
                            {
                                "label": "Click On More In Project Site",
                                "Permission": "canClickOnMoreInProjectSite"
                            },
                            {
                                "label": "View Project Site for User Group Only",
                                "Permission": "canViewProjectSiteForUserGroupOnly"
                            }
                        ]
                    }
                ]
            },
        ]);

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

    it('should fetch Members associated to the clicked user group', async () => {
        const response = await axios.get('/sites/ugr/user/usersFromGroup/${groupName}');
        expect(response.status).toBe(200);
        expect(response.data).toEqual([
            {
                "userEmail": "test456@gmail.com",
                "userRole": "Operator"
            },
            {
                "userEmail": "nitin_mahajan@Infosys.com",
                "userRole": "Admin"
            }
        ]);
    });

    it('should fetch Roles and Permissions', async () => {
        const response = await axios.get('/sites/rbac/rolesAndPermissions');
        expect(response.status).toBe(200);
        expect(response.data).toEqual([{
            "Project Sites": [
                {
                    "Landing Page": [
                        {
                            "label": "Click On More In Project Site",
                            "Permission": "canClickOnMoreInProjectSite"
                        },
                        {
                            "label": "View Project Site for User Group Only",
                            "Permission": "canViewProjectSiteForUserGroupOnly"
                        }
                    ]
                }
            ]
        }]);
    });

    it('renders without crashing', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper).toBeTruthy();
        });
    });

    it('should display the User Members table', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper.getByText('Email')).toBeTruthy();
        });
    });

    it('tests simulates the clicking of Info button', async () => {
        waitFor(() => {
            // fireEvent.click(screen.findByTestId('info-button'))
            const infoElements = screen.getAllByText(/Info/i);
            infoElements.forEach((element) => {
                expect(element).toBeInTheDocument();
            });
        })
    })

    it('renders the "Email" column correctly', async () => {
        // Arrange
        const EmailCell = wrapper.getByRole('cell', { name: /test456@gmail.com/i });
        // Assert
        expect(EmailCell).toBeInTheDocument();
    });

    it('renders the "Role" column correctly', async () => {
        // Arrange
        const RoleCell = wrapper.getByRole('cell', { name: /Operator/i });
        // Assert
        expect(RoleCell).toBeInTheDocument();
    });

    it('should display the "New User" button', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper.getByText('New User')).toBeTruthy();
        });
    });



   


});




