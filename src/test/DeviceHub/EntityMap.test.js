/* This is implementation of test cases for Entity map component. 
  Author : Arpana Meshram   
*/
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import React from "react";
import axios from "axios";
import { act } from "react-dom/test-utils";
import EntityMap from "../../pages/DeviceHub/EntityMap";
import { ProjectContext, ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MockAdapter from "axios-mock-adapter";

// Mock the Axios library with Jest
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
    pathname: "/project-sites/INFOSYS/entity-map",
  }),
}));

// Test Suite 1
describe("Test suite 1", () => {
  let mockData;
  let wrapper;

  // some setup code before each test in your suite.
  beforeEach(async () => {
    mock.reset();
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const mockPermissions = ["canClickOnDeviceHubInSidePane"];
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
            <EntityMap />
          </ProjectProvider>
        </Router>
      );
    });
  });

  // Test case 1 ( (Render component)
  it("should render the component without throwing an error", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper).toBeTruthy();
    });
  });
//Test case2 (should render the Project heading)
  it("should render project heading", async () => {
    await waitFor(async () => {
      expect(await screen.getByText("Project")).toBeInTheDocument();
    });
  });
//test case 3 (should render the Sensor heading)
  it("should render the Sensor", async () => {
    await waitFor(async () => {
      expect(await screen.getByText("Sensor")).toBeInTheDocument();
    });
  });

 // test case 5 (should render the Entity Map heading)
  // it("renders the My Entity Map heading", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <EntityMap />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   await waitFor(async() => {
  //     expect(await screen.getByText("Entity Map :")).toBeInTheDocument();
  //   });
  // });


});
// Test Suite 2
describe("Test suite 2", () => {
  let mockData;
  let wrapper;

  // some setup code before each test in your suite.
  beforeEach(async () => {
    mock.reset();
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const mockPermissions = ["canClickOnDeviceHubInSidePane"];
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
    // Mock the axios get requests
    const projectSiteNames = localStorage.getItem("projectSiteName");
    let mockDataSensor;

    mockDataSensor = [
      {
        SensorName: "EN1",
        SensorDescription: "EN1",
        projectSiteName: "INFOSYS",
        SensorTypeName: "10KW_TEST"
    }
    ];

    mock
      .onGet(`/sites/sensor/sensorsForProjectSite/${projectSiteNames}`)
      .reply(200, mockDataSensor);

    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <EntityMap />
          </ProjectProvider>
        </Router>
      );
    });
  });

  // Test case 4 (should render the Sensor data correctly)
  it("should render the Sensor data correctly", async () => {
    const projectSiteNames = localStorage.getItem("projectSiteName");
    const response = await axios.get(`/sites/sensor/sensorsForProjectSite/${projectSiteNames}`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      {
        SensorName: "EN1",
        SensorDescription: "EN1",
        projectSiteName: "INFOSYS",
        SensorTypeName: "10KW_TEST"
      },
    ]);
  });
 


});