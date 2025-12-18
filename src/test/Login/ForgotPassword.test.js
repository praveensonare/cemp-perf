/**
 * @file This file contains the unit tests for the ForgotPassword component.
 * The ForgotPassword component allows users to reset their password by entering their email address.
 * Author: Shweta Vyas
 * Date: 8/14/2024
 */
import { render, waitFor, fireEvent, screen, within } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import ForgotPassword from '../../pages/ForgotPassword';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the Auth.forgotPassword function
jest.mock('aws-amplify', () => ({
    Auth: {
        forgotPassword: jest.fn(() => Promise.resolve()),
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

//Test cases for ForgotPassword component
describe('ForgotPassword', () => {

    test('renders ForgotPassword component', () => {
        render(
            <Router>
                <ForgotPassword />
            </Router>
        );
        const forgotPasswordComponent = screen.getByTestId('forgot-password-component');
        expect(forgotPasswordComponent).toBeInTheDocument();
    });

    test('displays error message when email field is empty', async () => {
        render(
            <Router>
                <ForgotPassword />
            </Router>
        );
        const sendCodeButton = screen.getByText('Send Code');
        fireEvent.click(sendCodeButton);
        await waitFor(() => {
            const errorMessage = screen.getByText('Please Enter an Email');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    test('displays error message when email format is invalid', async () => {
        render(
            <Router>
                <ForgotPassword />
            </Router>
        );
        const emailInput = screen.getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
        const sendCodeButton = screen.getByText('Send Code');
        fireEvent.click(sendCodeButton);
        await waitFor(() => {
            const errorMessage = screen.getByText('Please Enter a Valid Email Address');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    test('displays success message when confirmation code is sent', async () => {
        render(
            <Router>
                <ForgotPassword />
            </Router>
        );

        const emailInput = screen.getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        const sendCodeButton = screen.getByText('Send Code');
        fireEvent.click(sendCodeButton);

        const successMessage = await screen.findByText('Confirmation code sent to your email');
        expect(successMessage).toBeInTheDocument();
    });


});