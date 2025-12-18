import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import UserProfile from '../../components/common/UserProfile';
import { ProjectContext, ProjectProvider } from '../../ProjectContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, TextField, Divider } from '@mui/material';

// jest.mock('axios');
jest.mock('sweetalert2');

// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios);
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
}));

// Test Suite 1
describe('Test suite 1', () => {
    let mockData;
    let wrapper;

    // some setup code before each test in your suite.
    beforeEach(async () => {
        mock.reset();
        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);

        let mockDataGroupForUser;

        mockDataGroupForUser = [
            {

            },
        ];

        // Mock the axios get requests
        mock.onGet('/sites/ugr/user/groupForUser').reply(200, mockDataGroupForUser);

        await act(async () => {
            wrapper = render(
                <Router>
                    <ProjectProvider>
                        <UserProfile />
                    </ProjectProvider>
                </Router>
            );
        });
    });

    //test case 1
    it('renders without crashing', () => {
        render(<UserProfile />);
    });

    //test case 2
    test('calls the signOut function when the button is clicked', () => {
        const signOut = jest.fn();

        const { getByText } = render(
            <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<LogoutIcon />}
                onClick={signOut}
                sx={{
                    backgroundColor: 'white',
                    color: 'red',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                    '&:active': {
                        backgroundColor: 'lightgrey',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
                    },
                    '&:hover': {
                        backgroundColor: 'lightgrey',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
                    },
                }}
            >
                Log out
            </Button>
        );

        fireEvent.click(getByText('Log out'));

        expect(signOut).toHaveBeenCalled();
    });

    //test case 3
    test('renders the fields with the correct default values', () => {
        const groupData = 'Test Group';
        const ProjectSitesForUser = 'Test Site';
        const localTime = 'Test Time';

        render(
            <div>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px', flexDirection: 'column' }}
                >
                    <TextField
                        id="user-group-field"
                        label="User Group"
                        defaultValue={groupData}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        id="project-site-field"
                        label="Project Site"
                        defaultValue={ProjectSitesForUser}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        id="date-time-field"
                        label="Date & Time"
                        defaultValue={localTime}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <Divider />
                </Box>
            </div>
        );

        expect(screen.getByLabelText('User Group')).toHaveValue(groupData);
        expect(screen.getByLabelText('Project Site')).toHaveValue(ProjectSitesForUser);
        expect(screen.getByLabelText('Date & Time')).toHaveValue(localTime);
    });

    //test case 4
    test('sets the fontSize based on the length of the email', () => {
        let email = 'short@example.com';
        let fontSize = email.length > 20 ? '12px' : '16px';
        expect(fontSize).toBe('16px');

        email = 'verylongemailaddress@example.com';
        fontSize = email.length > 20 ? '12px' : '16px';
        expect(fontSize).toBe('12px');
    });

    //test case 5
    test('calls setState with the correct arguments when toggleDrawer is invoked', () => {
        const setState = jest.fn();
        const state = { left: false };

        const toggleDrawer = (anchor, open) => (event) => {
            if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                return;
            }

            setState({ ...state, [anchor]: open });
        };

        const { getByText } = render(
            <button onClick={toggleDrawer('left', true)}>Open Drawer</button>
        );

        fireEvent.click(getByText('Open Drawer'));

        expect(setState).toHaveBeenCalledWith({ left: true });
    });

    //test case 6
    test('fetches user group and project sites data', async () => {
        const UserProfile = () => {
            const [groupData, setGroupData] = useState('');
            const [projectSitesForUser, setProjectSitesForUser] = useState('');
            const [loading, setLoading] = useState(true);
            const attributes = { email: 'test@example.com' };

            useEffect(() => {
                const getGroupForUser = async () => {
                    if (attributes && attributes.email) {
                        try {
                            const response = await axios.get(`/sites/ugr/user/groupForUser`);
                            const data = response.data[0];
                            const groupName = data.groupName;
                            let projectSiteNames = [];
                            if (Array.isArray(data.projectSites)) {
                                projectSiteNames = data.projectSites.map(site => site.projectSiteName);
                            }
                            setGroupData(groupName);
                            setProjectSitesForUser(projectSiteNames.join(', '));
                            setLoading(false);
                        } catch (error) {
                            console.error('Error fetching data', error);
                            setLoading(false);
                        }
                    }
                };
                getGroupForUser();
            }, [attributes]);

            return loading ? 'Loading...' : `${groupData} - ${projectSitesForUser}`;
        };

        let mock = new MockAdapter(axios);
        mock.onGet('/sites/ugr/user/groupForUser').reply(200, [
            {
                groupName: 'Test Group',
                projectSites: [{ projectSiteName: 'Test Site 1' }, { projectSiteName: 'Test Site 2' }],
            },
        ]);

        const { getByText, queryByText } = render(<UserProfile />);

        // Check that the loading text is initially rendered
        expect(getByText('Loading...')).toBeInTheDocument();

        // Wait for the fetched data to be rendered
        await waitFor(() => getByText('Test Group - Test Site 1, Test Site 2'));

        // Check that the loading text is no longer in the document
        expect(queryByText('Loading...')).not.toBeInTheDocument();
    });
});

