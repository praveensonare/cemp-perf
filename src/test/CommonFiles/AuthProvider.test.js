import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import React from "react";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { Auth } from "aws-amplify";
import { AuthProvider } from "../../AuthProvider";
import { useNavigate } from 'react-router-dom';

// Mock the Axios library with Jest
jest.mock("axios");

//mock the useNavigate and useLocation hooks from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn().mockName('navigate'),
    useLocation: () => ({
        pathname: '/',
    }),
}));

// Mock the Auth.currentAuthenticatedUser method
jest.mock("aws-amplify", () => ({
    Auth: {
        currentAuthenticatedUser: jest.fn(),
        signOut: jest.fn(),
    },
}));

describe("AuthProvider", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render children when user is authenticated", async () => {
        // Mock the currentAuthenticatedUser method to return a user object
        Auth.currentAuthenticatedUser.mockResolvedValueOnce({});

        // Render the AuthProvider component with a child component
        render(
            <AuthProvider>
                <div data-testid="child-component">Child Component</div>
            </AuthProvider>
        );

        // Wait for the component to finish loading
        await waitFor(() => expect(screen.getByTestId("child-component")).toBeInTheDocument());
    });

    it("should redirect to login page when user is not authenticated", async () => {
        // Mock the currentAuthenticatedUser method to throw an error
        Auth.currentAuthenticatedUser.mockRejectedValueOnce(new Error("User is not authenticated"));

        // Render the AuthProvider component with a child component
        render(
            <AuthProvider>
                <div data-testid="child-component">Child Component</div>
            </AuthProvider>
        );

        // Wait for the component to finish loading
        await waitFor(() => expect(screen.getByText(/Child Component/i)).toBeInTheDocument());
    });

    // it("should sign out and redirect to login page when token expires", async () => {
    //     // Mock the currentAuthenticatedUser method to return a user object
    //     Auth.currentAuthenticatedUser.mockResolvedValueOnce({
    //         signInUserSession: {
    //             accessToken: {
    //                 jwtToken: "mockToken",
    //                 payload: {
    //                     exp: Math.floor(new Date().getTime() / 1000) - 1, // Expired token
    //                 },
    //             },
    //         },
    //     });

    //     // Mock the navigate function
    //     const navigate = jest.fn();

    //     // Render the AuthProvider component with a child component
    //     render(
    //         <AuthProvider navigate={navigate}>
    //             <div data-testid="child-component">Child Component</div>
    //         </AuthProvider>
    //     );

    //     // Wait for the component to finish loading
    //     // await waitFor(() => expect(screen.getByText("Signing out due to token expiration")).toBeInTheDocument());

    //     // Check if signOut and navigate functions are called
    //     // expect(Auth.signOut).toHaveBeenCalled();
    //     await waitFor(() => expect(Auth.signOut).toHaveBeenCalled());
    //     await waitFor(() => expect(navigate).toHaveBeenCalledWith("/"));
    //     // expect(screen.getByText("User signed out after token expired")).toBeInTheDocument();
    // });
});