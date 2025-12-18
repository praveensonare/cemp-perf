/* This is implementation of AuthProvider component to check the authentication state of the user.
  Author : Shweta Vyas
  Revision:
       1. 25-02-2024 : changes done to check if the user is signed out from another window/Tab and redirects to the login page 
          Author: shweta vyas  
       2. 
*/

import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Auth } from 'aws-amplify';


export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let timeoutId;
        async function checkAuthState() {
            try {
                const user = await Auth.currentAuthenticatedUser();
                if (user) { // Check if the user is still authenticated
                    const token = user.signInUserSession.accessToken.jwtToken;
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setIsAuthenticated(true);
                    const currentTime = Math.floor(new Date().getTime() / 1000);
                    const timeUntilExpiration = (user.signInUserSession.accessToken.payload.exp - currentTime) * 1000;
                    timeoutId = setTimeout(() => {
                        console.log('Signing out due to token expiration');
                        alert('Your session has timed out. Please log in again.');
                        Auth.signOut();
                        navigate('/');
                        console.log('User signed out after token expired');
                    }, timeUntilExpiration);
                }
            } catch (error) {
                // console.log('User is not authenticated, error:', error);
                setIsAuthenticated(false);
                console.log('Redirecting to login page');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        }
        checkAuthState();
        return () => clearTimeout(timeoutId);
    }, []);

    // checks if the user is signed out from another window/Tab and redirects to the login page
    useEffect(() => {
        const handleStorageChange = () => {
            if (localStorage.getItem('authState') === 'signedOutCurrentBrowserSession') {
                navigate('/');
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [navigate]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/');
        }
    }, [isLoading, isAuthenticated, navigate]);

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}