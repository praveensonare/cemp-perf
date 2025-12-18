import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../../App';
import { ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import setupAxiosInterceptors from '../../axiosSetup';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

// Mock setupAxiosInterceptors
jest.mock('../../axiosSetup');
// Mock the ProtectedRoutes component
jest.mock('../../ProtectedRoutes', () => () => <div>Protected content</div>);


describe('App', () => {
    beforeEach(() => {
        useSelector.mockImplementation((selector) => selector({
            auth: { isLoading: false, isAuthenticated: true },
        }));
        render(
            <Router>
                <ProjectProvider>
                    <App />
                </ProjectProvider>
            </Router>
        );
    });

    test('renders without crashing', () => {
        const { container } = render(
            <Router>
                <ProjectProvider>
                    <App />
                </ProjectProvider>
            </Router>
        );
        expect(container).toBeTruthy();
    });

    test('renders Login page on default route', () => {
        expect(screen.getByText(/Please Enter Your Login Credentials/i)).toBeInTheDocument();
    });

    test('renders ForgotPassword page on /forgotPassword route', () => {
        window.history.pushState({}, '', '/forgotPassword');
        expect(screen.getByText(/Forgot Password?/i)).toBeInTheDocument();
    });

    test('renders ResetPassword page on /resetPassword route', () => {
        window.history.pushState({}, '', '/resetPassword');
        expect(screen.getByText(/Send Code/i)).toBeInTheDocument();
    });

});

