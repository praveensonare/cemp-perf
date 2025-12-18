import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import Sidebar from '../../components/Sidebar';
import { ProjectProvider} from '../../ProjectContext';
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
                        <Sidebar />
                    </ProjectProvider>
                </Router>
            );
        });
    });

    it('Sidebar renders without crashing', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper).toBeTruthy();
        });
    });

    it('Project Schematic button renders correctly for SuperAdmin', async () => {
        // Assert
        await waitFor(() => {
            const button = wrapper.getByTestId('project-schematic-button');
            expect(button).toBeInTheDocument();
        });
    });

    it('Device hub button renders correctly for SuperAdmin', async () => {
        // Assert
        await waitFor(() => {
            const button = wrapper.getByTestId('device-hub-button');
            expect(button).toBeInTheDocument();
        });
    });

});


