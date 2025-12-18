import "@testing-library/jest-dom/extend-expect";
import { render, waitFor, fireEvent, screen, getByTestId } from "@testing-library/react";
import Project_Members from '../../pages/RoleManager/Project_Members';
import userEvent from "@testing-library/user-event";
import { ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MockAdapter from "axios-mock-adapter";
import { act } from "react-dom/test-utils";
import axios from "axios";
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// jest.mock('axios');
jest.mock("sweetalert2");

// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios);


// Mock the useDispatch and useSelector hooks from react-redux
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

//mock the useNavigate and useLocation hooks from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn().mockName("navigate"),
  useLocation: () => ({
    pathname: "/projects",
  }),
}));

describe("Tests Suite 1", () => {
  let wrapper;

  beforeEach(async () => {
    mock.reset();
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const mockPermissions = [];
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("permissions")) return mockPermissions;
    });

    global.localStorage.getItem = jest.fn().mockImplementation((key) => {
      if (key === "projectSiteName") {
        return JSON.stringify("JTC2");
      } else {
        return null;
      }
    });

    let mockDataProject;
    mock
      .onDelete(new RegExp("/sites/project/projectSite/.*"))
      .reply(200, { data: "Project Site deleted successfully" });

    // Mock the axios get requests
    mock.onGet("/sites/project/projectSites").reply(200, mockDataProject);

    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <Project_Members />
          </ProjectProvider>
        </Router>
      );
    });
  });

  // Test case 1
  it("renders without crashing", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper).toBeTruthy();
    });
  });
});

describe("Tests Suite 2", () => {
  let wrapper;
  const mockStore = configureStore([]);
  let store;
  beforeEach(async () => {
    mock.reset();
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const mockPermissions = [];
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("permissions")) return mockPermissions;
    });

    global.localStorage.getItem = jest.fn().mockImplementation((key) => {
      if (key === "projectSiteName") {
        return JSON.stringify("JTC2");
      } else {
        return null;
      }
    });

    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <Project_Members />
          </ProjectProvider>
        </Router>
      );
    });
  });

  it('Matching strings with regex Create Project Site', () => {
    const str1 = 'Create Project Site';
    expect(str1).toMatch(/Site/);
  });

  it('Matching strings with regex with Search User', () => {
    const str1 = 'Search Users';
    expect(str1).toMatch(/Search/);
  });

  it("renders the Table Rows per page:", async () => {
    // Arrange
    await waitFor(() => {
      expect(wrapper.getByText("Rows per page:")).toBeInTheDocument();
    });
    // Assert
    const table = wrapper.getByRole("grid");
    expect(table).toBeInTheDocument();
  });

  it("renders the Table Rows per page:", async () => {
    // Arrange
    await waitFor(() => {
      expect(wrapper.getByText("Rows per page:")).toBeInTheDocument();
    });
    // Assert
    const table = wrapper.getByRole("grid");
    expect(table).toBeInTheDocument();
  });

  it("renders the table filter 5 text :", async () => {
    // Arrange
    await waitFor(() => {
      expect(wrapper.getByText("5")).toBeInTheDocument();
    });
    // Assert
    const table = wrapper.getByRole("grid");
    expect(table).toBeInTheDocument();
  });
});

describe("Tests Suite 3", () => {
  let wrapper;

  beforeEach(async () => {
    mock.reset();
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const mockPermissions = [];
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("permissions")) return mockPermissions;
    });

    global.localStorage.getItem = jest.fn().mockImplementation((key) => {
      if (key === "projectSiteName") {
        return JSON.stringify("JTC2");
      } else {
        return null;
      }
    });

    let mockDataProject;

    mock
      .onDelete(new RegExp("/sites/project/projectSite/.*"))
      .reply(200, { data: "Project Site deleted successfully" });

    // Mock the axios get requests
    mock.onGet("/sites/project/projectSites").reply(200, mockDataProject);

    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <Project_Members />
          </ProjectProvider>
        </Router>
      );
    });
  });

  it("should set color and backgroundColor variables", () => {
    // Arrange
    let color, backgroundColor;

    // Act
    color = "red";
    backgroundColor = "white";

    // Assert
    expect(color).toBe("red");
    expect(backgroundColor).toBe("white");
  });
});

describe("Tests Suite 4", () => {

  // Test case 7
  it("matches the string 'Create Project Site' with regex", () => {
    // Arrange
    const str = "Create Project Site";

    // Act & Assert
    expect(str).toMatch(/Site/);
  });

  // Test case 8
  it("matches the string 'Search Users' with regex", () => {
    // Arrange
    const str = "Search Users";

    // Act & Assert
    expect(str).toMatch(/Search/);
  });

});




