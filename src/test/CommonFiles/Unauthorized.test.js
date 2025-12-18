import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Unauthorized from '../../components/common/Unauthorized';
import Sidebar from '../../components/Sidebar';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { ProjectContext, ProjectProvider } from '../../ProjectContext';

// "test": "set DEBUG_PRINT_LIMIT=100000 && react-scripts test",

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
  useLocation: () => ({
    pathname: '/user-groups',
  }),
}));

describe('Unauthorized Component', () => {
  test('renders unauthorized image', () => {
    render(<Unauthorized />);
    const imageElement = screen.getByAltText('Not Found');
    expect(imageElement).toBeInTheDocument();
  });

  test('renders "Go to Home Page" button', () => {
    render(<Unauthorized />);
    const buttonElement = screen.getByRole('link', { name: 'Go to Home Page' });
    expect(buttonElement).toBeInTheDocument();
  });
});

describe('Tests for sidebar', () => {
  let wrapper;
  // some setup code before each test in your suite.
  beforeEach(async () => {
    mock.reset();
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const mockPermissions = ["canClickOnUserGroupName", "canClickOnInfoUserGroup", "canClickOnEditUserGroup", "canClickOnDeleteUserGroup", "canClickOnGuidedTourUnderWelcomeToRoleManagerInHomePage"];
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

  test('renders Device Hub correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <ProjectProvider>
            <Sidebar />
          </ProjectProvider>
        </Router>,
      );
    });

    const sidebarElements = screen.getAllByText('Device Hub');
    sidebarElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });

  test('renders project schematic in sidebar correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <ProjectProvider>
            <Sidebar />
          </ProjectProvider>
        </Router>,
      );
    });

    const sidebarElements = screen.getAllByText('Project Schematic');
    sidebarElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });

  test('renders dashboard correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <ProjectProvider>
            <Sidebar />
          </ProjectProvider>
        </Router>,
      );
    });

    const sidebarElements = screen.getAllByText('Dashboard');
    sidebarElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });

  it('renders without crashing', async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper).toBeTruthy();
    });
  });

});
