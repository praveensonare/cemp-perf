import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import ProtectedRoutes from '../../ProtectedRoutes';
import { ProjectProvider } from '../../ProjectContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthProvider } from '../../AuthProvider';
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";
import { MemoryRouter } from 'react-router-dom';


jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

// Test Suite 1
describe('Test suite 1', () => {
    test('renders without crashing', () => {
        const { container } = render(
            <Router>
                <ProjectProvider>
                    <AuthProvider>
                        <ProtectedRoutes />
                    </AuthProvider>
                </ProjectProvider>
            </Router>
        );
        expect(container).toBeTruthy();
    });
});

describe('check if only authenticated user can access the route', () => {

    // some setup code before each test in your suite.
    beforeEach(async () => {
        // useSelector.mockImplementation((selector) => selector({
        //     auth: { isLoading: false, isAuthenticated: true },
        // }));
        // mock these to isolate the component from the actual Redux store during testing.
        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);
        // const mockPermissions = ["canClickOnMoreUnderProjectSite"];
        // useSelector.mockImplementation((selector) => {
        //     if (selector.toString().includes('permissions')) return mockPermissions;
        // });
        // Mock the fetchPermissions and fetchrole actions to return a resolved Promise
        mockDispatch.mockImplementation((action) => {
            if (action.type === fetchPermissions().type) {
                return Promise.resolve();
            }
            if (action.type === fetchrole().type) {
                return Promise.resolve();
            }
        });
    });

    test('navigates to "/" when user is not authenticated', async () => {
        useSelector.mockImplementation((selector) => {
            if (selector.toString().includes('auth')) return { isLoading: false, isAuthenticated: false };
            if (selector.toString().includes('permissions')) return [];
            if (selector.toString().includes('role')) return '';
        });

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/dashboard-configurations']}>
                    <ProjectProvider>
                        <AuthProvider>
                            <ProtectedRoutes />
                        </AuthProvider>
                    </ProjectProvider>
                </MemoryRouter>
            );
        });

        expect(window.location.pathname).toBe('/');
    });

    // test('navigates to "/unauthorized" when user does not have required permission and role is not SuperAdmin', async () => {
    //     useSelector.mockImplementation((selector) => {
    //         if (selector.toString().includes('auth')) return { isLoading: false, isAuthenticated: true };
    //         if (selector.toString().includes('permissions')) return [];
    //         if (selector.toString().includes('role')) return 'User';
    //     });

    //     await act(async () => {
    //         render(
    //             <MemoryRouter initialEntries={['/dashboard-configurations']}>
    //                 <ProjectProvider>
    //                     <AuthProvider>
    //                         <ProtectedRoutes />
    //                     </AuthProvider>
    //                 </ProjectProvider>
    //             </MemoryRouter>
    //         );
    //     });

    //     expect(window.location.pathname).toBe('/unauthorized');
    // });

    // test('navigates to "/dashboard-configurations" when user has SuperAdmin role and necessary permission', async () => {
    //     useSelector.mockImplementation((selector) => {
    //         if (selector.toString().includes('state.permissions')) return ["canClickOnSettingsInSidePane"];
    //         if (selector.toString().includes('state.userRole')) return 'SuperAdmin';
    //         return { isLoading: false, isAuthenticated: true };
    //     });
    //     const history = createMemoryHistory();
    //     await act(async () => {
    //         render(
    //             <Router history={history}>
    //                 <ProjectProvider>
    //                     <AuthProvider>
    //                         <ProtectedRoutes />
    //                     </AuthProvider>
    //                 </ProjectProvider>
    //             </Router>
    //         );
    //     });

    //     await waitFor(() => {
    //         expect(history.location.pathname).toBe('/dashboard-configurations');
    //     });
    // });

    // test('navigates to "/dashboard-configurations" when user has SuperAdmin role and necessary permission', async () => {
    //     useSelector.mockImplementation((selector) => {
    //         if (selector.toString().includes('state.permissions')) return ["canClickOnSettingsInSidePane"];
    //         if (selector.toString().includes('state.userRole')) return 'SuperAdmin';
    //         return { isLoading: false, isAuthenticated: true };
    //     });

    //     // Mock the dispatch function
    //     const mockDispatch = jest.fn(() => Promise.resolve());
    //     useDispatch.mockReturnValue(mockDispatch);

    //     const history = createMemoryHistory();
    //     await act(async () => {
    //         render(
    //             <Router history={history}>
    //                 <ProjectProvider>
    //                     <AuthProvider>
    //                         <ProtectedRoutes />
    //                     </AuthProvider>
    //                 </ProjectProvider>
    //             </Router>
    //         );
    //     });

    //     await waitFor(() => {
    //         expect(history.location.pathname).toBe('/dashboard-configurations');
    //     });
    // });

});



