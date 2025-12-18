import { render, waitFor, fireEvent, screen, within } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import ResetPassword from '../../pages/ResetPassword';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the Auth.forgotPassword function
jest.mock('aws-amplify', () => ({
    Auth: {
        forgotPasswordSubmit: jest.fn(() => Promise.resolve()),
    },
    Amplify: {
        configure: jest.fn(),
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

describe('ResetPassword', () => {
    it('renders the ResetPassword component', () => {
        render(
            <Router>
                <ResetPassword />
            </Router>
        );

        // Assert that the component is rendered
        expect(screen.getByText('Please enter the confirmation code sent to your registered email ID & new password')).toBeInTheDocument();
    });

    it('handles password change', () => {
        render(
            <Router>
                <ResetPassword />
            </Router>
        );

        // Simulate password change
        fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPassword123' } });

        // Assert that the password state is updated
        expect(screen.getByLabelText('New Password')).toHaveValue('newPassword123');
    });

    it('handles form submission with valid inputs', async () => {
        render(
            <Router>
                <ResetPassword />
            </Router>
        );

        // Simulate form submission with valid inputs
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Confirmation Code'), { target: { value: '123456' } });
        fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPassword123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Change Password' }));

        // Wait for the form submission to complete
        await waitFor(() => {
            expect(screen.getByText('Password reset successful')).toBeInTheDocument();
        });
    });

    // it('displays error message for missing email', async () => {
    //     render(
    //         <Router>
    //             <ResetPassword />
    //         </Router>
    //     );

    //     // Simulate form submission with missing email
    //     fireEvent.change(screen.getByLabelText('Confirmation Code'), { target: { value: '123456' } });
    //     fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPassword123' } });
    //     fireEvent.click(screen.getByRole('button', { name: 'Change Password' }));

    //     // Wait for the error message to appear
    //     const errorMessage = await screen.findByText('Please Enter your Email.');
    //     expect(errorMessage).toBeInTheDocument();
    // });

    it('displays error message for missing confirmation code', async () => {
        render(
            <Router>
                <ResetPassword />
            </Router>
        );

        // Simulate form submission with missing confirmation code
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newPassword123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Change Password' }));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Please enter confirmation code.')).toBeInTheDocument();
        });
    });

    it('displays error message for missing new password', async () => {
        render(
            <Router>
                <ResetPassword />
            </Router>
        );

        // Simulate form submission with missing new password
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Confirmation Code'), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button', { name: 'Change Password' }));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Please enter a new password.')).toBeInTheDocument();
        });
    });
});