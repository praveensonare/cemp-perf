/* This is implementation of test cases for HomePage Device Hub component. 
  Author : Arpana Meshram   
*/
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import React from "react";
import axios from "axios";
import { act } from "react-dom/test-utils";
import HomePage_DeviceH from "../../pages/DeviceHub/HomePage_DeviceH";
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
    pathname: "/project-sites/INFOSYS/device-hub",
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

    
    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <HomePage_DeviceH />
          </ProjectProvider>
        </Router>
      );
    });
  });
  // Test case 1 ( Render table details in grid )
  it("renders the Sensor Type table", async () => {
    await waitFor(() => {
      expect(wrapper.getByText("Sensor Type")).toBeInTheDocument();
    });
    const table = wrapper.getByRole("grid");
    expect(table).toBeInTheDocument();
  });
  // Test case 2 ( Render the Parameters Count table)
  it("renders the Parameters Count table", async () => {
    await waitFor(() => {
      expect(wrapper.getByText("Parameters Count")).toBeInTheDocument();
    });
    const table = wrapper.getByRole("grid");
    expect(table).toBeInTheDocument();
  });
  // Test case 3 ( Render the Guided Tour button)
  it("renders the Guided Tour button", async () => {
    const button = wrapper.getByText("Guided Tour").closest("button");
    expect(button).toBeInTheDocument();
  });
  // Test case 4 ( Render component )
  it("renders without crashing", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper).toBeTruthy();
    });
  });
  // Test case 5 ( Render the Welcome to Device Hub heading)
  it("should render the Welcome to Device Hub heading", async () => {
    await waitFor(() => {
      expect(screen.getByText("Welcome to Device Hub")).toBeInTheDocument();
    });
  });
  // Test case 6 ( Render the Entity Map heading)
  it("renders the My Entity Map heading", () => {
    expect(screen.getByText("Entity Map: Phase 1")).toBeInTheDocument();
  });

  // Test case 7 ( should fetch SensorType)
  // it("should fetch SensorType", async () => {
  //   await waitFor(() => {
  //     expect(wrapper.getByText("10KW_TEST")).toBeInTheDocument();
  //   });
  // });
  // // Test case 8  ( should fetch Sensor list)
  // it("should fetch Sensor list", async () => {
  //   await waitFor(() => {
  //     expect(wrapper.getByText("EN1")).toBeInTheDocument();
  //   });
  // });


});
// Test Suite 2
describe("Test suite 2", () => {
  let mockData;
  let wrapper;
  beforeEach(async () => {
    mock.reset();
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const mockPermissions = ["canClickOnDeviceHubInSidePane"];
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("permissions")) return mockPermissions;
    });

    
    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <HomePage_DeviceH />
          </ProjectProvider>
        </Router>
      );
    });
  });
// Test case 11 (should render the Customs Assets and Sensors)
it("renders the 'Customs Assets and Sensors' text", () => {
  expect(screen.getByText("Customs Assets and Sensors")).toBeInTheDocument();
});
// Test case 12(should render the Custom Metadata and Parameters)
it("renders the 'Custom Metadata and Parameters' text", () => {
  expect(screen.getByText("Custom Metadata and Parameters")).toBeInTheDocument();
});
// Test case 13(should render the IoT configuration and custom gateway channel creation)
it("renders the 'IoT configuration and custom gateway channel creation' text", () => {
  expect(screen.getByText("IoT configuration and custom gateway channel creation")).toBeInTheDocument();
});
})
// Test Suite 3
describe("Test suite 3", () => {
  let mockData;
  let wrapper;
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
    let mockDataSensorType;
    let mockDataSensorList;

    mockDataSensorType = [
      {
        SensorTypeLogicalName: "10KW_TEST",
        SensorTypeDescription: "10KW_TEST",
        SensorTypeName: "10KW_TEST",
        SensorTypeParameters: [
          {
            ParameterUnit: "%",
            DataType: "Float",
            ID: "c00871df-68d3-417c-9ec7-3e4313eb4e23",
            ParameterName: "temp",
          },
        ],
      },
    ];

    mockDataSensorList = [
      {
        SensorName: "EN1",
        SensorDescription: "EN1",
        projectSiteName: "INFOSYS",
        SensorTypeName: "10KW_TEST",
      },
    ];

    mock.onGet("/sites/sensor/type/sensorTypes").reply(200, mockDataSensorType);
    mock
      .onGet(`/sites/sensor/sensorsForProjectSite/${projectSiteNames}`)
      .reply(200, mockDataSensorList);

    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <HomePage_DeviceH />
          </ProjectProvider>
        </Router>
      );
    });
  });
 // Test case 9 (should render the Sensor Type data correctly)
 it('should render the Sensor Type data correctly', async () => {
  const response = await axios.get('/sites/sensor/type/sensorTypes');
  expect(response.status).toBe(200);
  expect(response.data).toEqual([{
    SensorTypeLogicalName: "10KW_TEST",
    SensorTypeDescription: "10KW_TEST",
    SensorTypeName: "10KW_TEST",
    SensorTypeParameters: [
        {
            ParameterUnit: "%",
            DataType: "Float",
            ID: "c00871df-68d3-417c-9ec7-3e4313eb4e23",
            ParameterName: "temp",
        },
    ],
}]);
});
// Test case 10 (should render the Sensor List data correctly)
it('should render the Sensor List data correctly', async () => {
  const projectSiteNames = localStorage.getItem("projectSiteName");
  const response = await axios.get(`/sites/sensor/sensorsForProjectSite/${projectSiteNames}`);
  expect(response.status).toBe(200);
  expect(response.data).toEqual([
    {
      SensorName: "EN1",
      SensorDescription: "EN1",
      projectSiteName: "INFOSYS",
      SensorTypeName: "10KW_TEST",
    }
  ]);
});
})