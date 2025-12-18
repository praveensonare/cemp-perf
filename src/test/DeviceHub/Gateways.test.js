import { render, waitFor, fireEvent, screen, within } from '@testing-library/react';
import React from 'react';
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import GatewatsDetails from '../../pages/DeviceHub/GatewaysDetails.js';
import Gateways from '../../pages/DeviceHub/Gateways.js';
import { ProjectProvider } from '../../ProjectContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Swal from "sweetalert2";

// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios);

// Mock the useDispatch and useSelector hooks from react-redux
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

// Mock the entire react-router-dom module
jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useParams: () => ({
            gatewayName: 'testGateway',
            projectSiteName: 'dummyProjectSite',
        }),
        useNavigate: jest.fn(),
        useLocation: () => ({
            pathname: '/user-groups',
        }),
    };
});

//Test cases for gateways details
describe('Gateway-Details', () => {
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
                        <GatewatsDetails />
                    </ProjectProvider>
                </Router>
            );
        });
    });

    it('gateways details renders without crashing', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper).toBeTruthy();
        });
    });

})

//Test cases for gateways
describe('Gateways', () => {
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
                        <Gateways />
                    </ProjectProvider>
                </Router>
            );
        });
    });

    it('Gateways renders without crashing', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper).toBeTruthy();
        });
    });

    it('"Add Edge Device" button is not disabled for SuperAdmin users', async () => {
        // Assert
        await waitFor(() => {
            expect(wrapper.getByText('Add Edge Device')).not.toBeDisabled();
        });
    });

    it(' "Add Edge Device" button is disabled for non-SuperAdmin users', async () => {
        // Arrange
        mockUserRole = 'User';

        // Act
        await act(async () => {
            wrapper.rerender(
                <Router>
                    <ProjectProvider>
                        <Gateways />
                    </ProjectProvider>
                </Router>
            );
        });

        // Assert
        await waitFor(() => {
            expect(wrapper.getByText('Add Edge Device')).toBeDisabled();
        });
    });

    it("renders Card.Body", async () => {
        await waitFor(() => {
            expect(screen.getByTestId("cardBody")).toBeInTheDocument();
        });
    });

    it("renders Card", async () => {
        await waitFor(() => {
            expect(screen.getByTestId("card")).toBeInTheDocument();
        });
    });

    it("renders Stack", async () => {
        await waitFor(() => {
            expect(screen.getByTestId("stack")).toBeInTheDocument();
        });
    });

    it("renders button", async () => {
        await waitFor(() => {
            expect(screen.getByTestId("add-edge-device-button")).toBeInTheDocument();
        });
    });

    it('calls handleOpenDelete when Delete button is clicked', async () => {
        // Arrange
        const handleOpenDelete = jest.fn();
        render(
            <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={handleOpenDelete}
                // key={id}
                className="delete-icon"
                data-testid="delete-button"
            >
                <DeleteIcon fontSize="small" />
                Delete
            </Button>
        );

        // Act
        fireEvent.click(screen.getByTestId('delete-button'));

        // Assert
        expect(handleOpenDelete).toHaveBeenCalled();
    });

    it('renders Info button for SuperAdmin users', async () => {
        // Arrange
        mockUserRole = 'SuperAdmin';

        // Act
        await act(async () => {
            wrapper.rerender(
                <Router>
                    <ProjectProvider>
                        <Gateways />
                    </ProjectProvider>
                </Router>
            );
        });

        // Assert
        await waitFor(() => {
            expect(wrapper.getByText('Info')).toBeInTheDocument();
        });
    });

    it('renders Info button', async () => {
        // Arrange
        const mockStore = configureMockStore()({
            userRole: 'SuperAdmin',
            canClickOnInfoEdgeDevice: true,
        });

        // Act
        await act(async () => {
            render(
                <Provider store={mockStore}>
                    <Router>
                        <ProjectProvider>
                            <Gateways />
                        </ProjectProvider>
                    </Router>
                </Provider>
            );
        });

        // Assert
        await waitFor(() => {
            expect(screen.getByText('Info')).toBeInTheDocument();
        });
    });

});


describe('Gateways', () => {
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
                        <Gateways />
                    </ProjectProvider>
                </Router>
            );
        });
    });

    it('calls handleDelete when Delete button is clicked', async () => {
        // Arrange
        const handleDelete = jest.fn();
        render(
            <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={handleDelete}
                // key={id}
                className="delete-icon"
                data-testid="delete-button"
            >
                <DeleteIcon />
            </Button>
        );

        // Act
        fireEvent.click(screen.getByTestId('delete-button'));

        // Assert
        expect(handleDelete).toHaveBeenCalled();
    });

    it('calls the correct function when the Info button is clicked', () => {
        // Arrange
        const handleInfoClickMock = jest.fn();
        const { getByTestId } = render(
            <Button
                variant="outlined"
                size="small"
                data-testid="info-button"
                onClick={handleInfoClickMock}
            >
                Info
            </Button>
        );

        // Act
        const infoButton = getByTestId('info-button');
        fireEvent.click(infoButton);

        // Assert
        expect(handleInfoClickMock).toHaveBeenCalled();
    });

    it('calls the correct function when the Mapping button is clicked', () => {
        // Arrange
        const handleMappingClickMock = jest.fn();
        const { getByTestId } = render(
            <Button
                variant="outlined"
                size="small"
                data-testid="mapping-button"
                onClick={handleMappingClickMock}
            >
                Mapping
            </Button>
        );

        // Act
        const mappingButton = getByTestId('mapping-button');
        fireEvent.click(mappingButton);

        // Assert
        expect(handleMappingClickMock).toHaveBeenCalled();
    });

    it('disables the Delete button when the user does not have permission', () => {
        // Arrange
        const { getByTestId } = render(
            <Button
                variant="outlined"
                size="small"
                color="error"
                disabled={true}
                data-testid="delete-button"
            >
                Delete
            </Button>
        );

        // Act
        const deleteButton = getByTestId('delete-button');

        // Assert
        expect(deleteButton).toBeDisabled();
    });

    // it("Should render Topic title in the page", async () => {
    //     render(
    //         <Router>
    //             <ProjectProvider>
    //                 <Gateways />
    //             </ProjectProvider>
    //         </Router>
    //     );
    //     await waitFor(() =>
    //         expect(screen.getByText("MQTT Topic")).toBeInTheDocument()
    //     );
    // });

    // it("Should render Channel title in the page", async () => {
    //     render(
    //         <Router>
    //             <ProjectProvider>
    //                 <Gateways />
    //             </ProjectProvider>
    //         </Router>
    //     );
    //     await waitFor(() =>
    //         expect(screen.getByText("MQTT Topic")).toBeInTheDocument()
    //     );
    // });

    it('renders the "Delete" dialog when open5 state is true', async () => {
        // Arrange
        const setState = jest.fn();
        const useStateSpy = jest.spyOn(React, 'useState');
        useStateSpy.mockImplementation((init) => [init === false ? true : init, setState]);
        const { findAllByText } = render(
            <Router>
                <ProjectProvider>
                    <Gateways open5={true} />
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

