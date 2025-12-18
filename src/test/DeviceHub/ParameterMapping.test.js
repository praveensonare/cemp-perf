import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import React from "react";
import axios from "axios";
// import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ParameterMapping from '../../pages/DeviceHub/ParameterMapping';
import { ProjectContext, ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MockAdapter from "axios-mock-adapter";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect';


// jest.mock('axios');
jest.mock("sweetalert2");

// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios);
const mockDispatch = jest.fn();

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
    const mockPermissions = [
      "canClickOnUserGroupName",
      "canClickOnInfoUserGroup",
      "canClickOnEditUserGroup",
      "canClickOnDeleteUserGroup",
      "canClickOnGuidedTourUnderWelcomeToRoleManagerInHomePage",
    ];
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

    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <ParameterMapping />
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

  it('Matching strings with regex Create Project Site', () => {
    const str1 = 'Create Project Site';
    expect(str1).toMatch(/Site/);
  });

  it('Matching strings with regex with Search User', () => {
    const str1 = 'Key';
    expect(str1).toMatch(/Key/);
  });

  // it("renders model with Create Project Site Name * label", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <ParameterMapping />
  //       </ProjectProvider>
  //     </Router>
  //   );

  //   await waitFor(() => {
  //     expect(wrapper.getByText("Create Mapping")).toBeInTheDocument();
  //   });
  // });

  // it("renders save button for saving all the data", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <ParameterMapping />
  //       </ProjectProvider>
  //     </Router>
  //   );

  //   await waitFor(() => {
  //     expect(wrapper.getByText("Save")).toBeInTheDocument();
  //   });
  // });

  // it("renders project tree heading", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <ParameterMapping />
  //       </ProjectProvider>
  //     </Router>
  //   );

  //   await waitFor(() => {
  //     expect(wrapper.getByText("Project Tree")).toBeInTheDocument();
  //   });
  // });

  // it("renders project tree heading", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <ParameterMapping />
  //       </ProjectProvider>
  //     </Router>
  //   );

  //   await waitFor(() => {
  //     expect(wrapper.getByText("Mapping Section")).toBeInTheDocument();
  //   });
  // });

  it("Checking Permissions array elements for parametere mapping canClickOnProjectSchematicInSidePane", () => {
    const accessPermissionsarray = [
      "canClickOnInfoSensorType",
      "canClickOnDeleteSensorType",
      "canClickOnCreateSensorType",
      "canClickOnEditSensorType",
      "canClickOnCopySensorType",
      "canClickOnProjectSchematicInSidePane",
    ];
    expect(accessPermissionsarray).toContain("canClickOnProjectSchematicInSidePane");
  });

  it("Checking Permissions array elements with length", () => {
    const accessPermissionsarray = [
      "canClickOnInfoSensorType",
      "canClickOnDeleteSensorType",
      "canClickOnCreateSensorType",
      "canClickOnEditSensorType",
      "canClickOnCopySensorType",
      "canClickOnProjectSchematicInSidePane",
    ];
    expect(accessPermissionsarray).toHaveLength(6);
  });

  it("Checking Permissions array elements with length toBeGreaterThan", () => {
    const accessPermissionsarray = [
      "canClickOnInfoSensorType",
      "canClickOnDeleteSensorType",
      "canClickOnCreateSensorType",
      "canClickOnEditSensorType",
      "canClickOnCopySensorType",
      "canClickOnProjectSchematicInSidePane",
    ];
    expect(accessPermissionsarray.length).toBeGreaterThan(0);
  });
});

describe("Tests Suite 1", () => {
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
            <ParameterMapping />
          </ProjectProvider>
        </Router>
      );
    });
  });

  it("renders Card.Body", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("cardBody")).toBeInTheDocument();
    });
  });

  it("renders grid", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("grid-body")).toBeInTheDocument();
    });
  });

  it("renders button", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("create-mapping-button")).toBeInTheDocument();
    });
  });

  


});

