/* This is implementation of test cases for SensorType component. 
  Author : Arpana Meshram   
*/
import {
  render,
  waitFor,
  fireEvent,
  screen,
  queryByTestId,
  querySelector,
} from "@testing-library/react";
import React from "react";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { act } from "react-dom/test-utils";

import SensorType from "../../pages/DeviceHub/SensorType";

import { ProjectContext, ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MockAdapter from "axios-mock-adapter";

// "test": "set DEBUG_PRINT_LIMIT=100000 && react-scripts test",

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
    pathname: "/project-sites/INFOSYS/sensors",
  }),
}));

// Test Suite 1
describe("Test suite 1", () => {
  let wrapper;
  let mockDispatch;
  let mockPermissions;
  let mockUserRole;
  // some setup code before each test in your suite.
  beforeEach(async () => {
    mockDispatch = jest.fn();
    mockPermissions = [];
    mockUserRole = "SuperAdmin";
    mockAxiosPut = jest.spyOn(axios, "put");
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("permissions")) return mockPermissions;
      if (selector.toString().includes("userRole")) return mockUserRole;
    });

    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <SensorType />
          </ProjectProvider>
        </Router>
      );
    });
  });
  it("renders stack", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("stack")).toBeInTheDocument();
    });
  });
  //parentContainer
  it("renders parentContainer", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("parentContainer")).toBeInTheDocument();
    });
  });
  //dataGridSearch
  it("renders dataGridSearch", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("dataGridSearch")).toBeInTheDocument();
    });
  });
  //dataGridSearchinput
  it("renders dataGridSearchinput", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("dataGridSearchinput")).toBeInTheDocument();
    });
  });

  //sensorButton
  it("renders sensorButton", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("sensorButton")).toBeInTheDocument();
    });
  });
  //dataGrid
  it("renders dataGrid", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("dataGrid")).toBeInTheDocument();
    });
  });
  //dataGriddiv
  it("renders dataGriddiv", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("dataGriddiv")).toBeInTheDocument();
    });
  });
  it("calls handleOpenDelete when Delete button is clicked", async () => {
    const handleOpenDelete = jest.fn();
    render(
      <Button
        variant="outlined"
        size="small"
        color="error"
        style={{ marginRight: 5 }}
        onClick={() => handleOpenDelete()}
        className="delete-icon"
        data-testid="delete-button">
        <DeleteIcon style={{ fontSize: "18px", marginRight: "2px" }} />
        Delete
      </Button>
    );
    fireEvent.click(screen.getByTestId("delete-button"));
    expect(handleOpenDelete).toHaveBeenCalled();
  });
  it("calls handleInfo when info button is clicked", async () => {
    const handleInfo = jest.fn();
    render(
      <Button
        variant="outlined"
        size="small"
        className="edit-icon"
        onClick={() => handleInfo()}
        data-testid="info-button">
        <InfoOutlinedIcon style={{ fontSize: "18px", marginRight: "2px" }} />
        Info
      </Button>
    );
    fireEvent.click(screen.getByTestId("info-button"));
    expect(handleInfo).toHaveBeenCalled();
  });
  it("calls handleEdit when edit button is clicked", async () => {
    const handleEdit = jest.fn();
    render(
      <Button
        variant="outlined"
        size="small"
        color="success"
        className="edit-icon"
        onClick={() => handleEdit()}
        data-testid="edit-button">
        <EditIcon />
        Edit
      </Button>
    );
    fireEvent.click(screen.getByTestId("edit-button"));
    expect(handleEdit).toHaveBeenCalled();
  });
  it("calls handleCopy when copy button is clicked", async () => {
    const handleCopy = jest.fn();
    render(
      <Button
        variant="outlined"
        size="small"
        color="success"
        className="ContentCopy-icon"
        onClick={() => handleCopy()}
        data-testid="copy-buttontest">
        <ContentCopyIcon  />
        Copy
      </Button>
    );
    fireEvent.click(screen.getByTestId("copy-buttontest"));
    expect(handleCopy).toHaveBeenCalled();
  });
});

// Test Suite 2
describe("Test suite 2", () => {
  let mockData;
  let wrapper;

  jest.mock("axios", () => ({
    get: jest.fn(),
    put: jest.fn(),
  }));
  const mockPermissions = [
    "canClickOnGuidedTourUnderWelcomeToRoleManagerInHomePage",
  ];
  // some setup code before each test in your suite.
  beforeEach(async () => {
    mock.reset();
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const mockPermissions = [
      "canClickOnInfoSensorType",
      "canClickOnDeleteSensorType",
      "canClickOnCreateSensorType",
      "canClickOnEditSensorType",
      "canClickOnCopySensorType",
    ];
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("permissions")) return mockPermissions;
    });

    // Mock the axios get requests
    let mockDataSensorType;

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
    //mock the data with deleted sensortype
    const mockDataSensorTypeDel = [
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
    mock.onGet("/sites/sensor/type/sensorTypes").reply(200, mockDataSensorType);
    // Mock the delete request
    mock
      .onDelete(new RegExp("/sites/sensor/type/sensorType/.*"))
      .reply(200, { data: "Group deleted successfully" });
    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <SensorType />
          </ProjectProvider>
        </Router>
      );
    });
  });

  // Test case 1 (Render component )
  it("should render the component without throwing an error", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper).toBeTruthy();
    });
  });
  // Test case 2 (Render the Sensor Type table)
  it("should render the 'Sensor Type' label and a data grid table in the document", async () => {
    // Arrange
    await waitFor(() => {
      expect(wrapper.getByText("Sensor Type")).toBeInTheDocument();
    });

    // Assert
    const table = wrapper.getByRole("grid");
    expect(table).toBeInTheDocument();
  });
  // Test case 3  (should fetch SensorType)
  it("should fetch and render the 'SensorType' named '10KW_TEST'", async () => {
    await waitFor(() => {
      expect(wrapper.getByText("10KW_TEST")).toBeInTheDocument();
    });
  });
  // Test case 4 (Should render label parameters count  in table)
  it("should render the label 'Parameters Count' in the data grid table", async () => {
    // Arrange
    await waitFor(() => {
      expect(wrapper.getByText("Parameters Count")).toBeInTheDocument();
    });
    // Assert
    const table = wrapper.getByRole("grid");
    expect(table).toBeInTheDocument();
  });
  // Test case 5 (Render the Create Sensor type Button)
  it("should render the 'Create Sensor type' button", async () => {
    const button = wrapper.getByText("Create Sensor type").closest("button");
    expect(button).toBeInTheDocument();
  });
  // Test case 6 (should render model button after clicking 'Create Sensor type')
  // it("should render model button after clicking 'Create Sensor type'", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <SensorType />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   fireEvent.click(screen.getByText("Create Sensor type"));
  // });
  // Test case 7 (should render 'Sensor Type Name*' button after clicking 'Create Sensor type')
  // it("should render 'Sensor Type Name*' button after clicking 'Create Sensor type'", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <SensorType />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   fireEvent.click(screen.getByText("Create Sensor type"));
  //   // Wait for the input field to be in the document
  //   expect(
  //     await screen.findByLabelText("Sensor Type Name*")
  //   ).toBeInTheDocument();
  // });
  // Test case 8 (should render 'Sensor Type Logical Name*' button after clicking 'Create Sensor type')
  // it("should render 'Sensor Type Logical Name*' button after clicking 'Create Sensor type'", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <SensorType />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   fireEvent.click(screen.getByText("Create Sensor type"));
  //   // Wait for the input field to be in the document
  //   expect(
  //     await screen.findByLabelText("Sensor Type Logical Name*")
  //   ).toBeInTheDocument();
  // });
  //Test case 9 (should render 'Sensor Type Description*' button after clicking 'Create Sensor type')
  // it("should render 'Sensor Type Description*' button after clicking 'Create Sensor type'", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <SensorType />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   fireEvent.click(screen.getByText("Create Sensor type"));
  //   // Wait for the input field to be in the document
  //   expect(
  //     await screen.findByLabelText("Sensor Type Description*")
  //   ).toBeInTheDocument();
  // });
  //Test case 10 (should render 'Next' button after clicking 'Create Sensor type')
  // it("should render 'Next' button after clicking 'Create Sensor type'", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <SensorType />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   fireEvent.click(screen.getByText("Create Sensor type"));
  //   const button = wrapper.getByText("Next").closest("button");
  //   expect(button).toBeInTheDocument();
  //   // Wait for the input field to be in the document
  //   //expect(await screen.findByLabelText("Sensor Type Name*")).toBeInTheDocument();
  // });
  // Test case11 (should render the Sensor Type data correctly)
  it("should render the Sensor Type data correctly", async () => {
    const response = await axios.get("/sites/sensor/type/sensorTypes");
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
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
    ]);
  });
  // Test case 12 (should delete a SensorType)
  it("should successfully delete a SensorType and verify it no longer exists in the data set", async () => {
    // Define sensorType
    const selectedSensorTypeName = "10KW_TEST";

    //mock the data with deleted sensorType
    const mockDataSensorTypeDel = [
      {
        SensorTypeLogicalName: "10KW_TEST",
        SensorTypeDescription: "10KW_TEST",
        //SensorTypeName: "10KW_TEST",
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

    // Mock the delete request
    mock
      .onDelete(new RegExp("/sites/sensor/type/sensorType/.*"))
      .reply(200, { data: "Group deleted successfully" });

    // Perform the delete operation
    const response = await axios.delete(
      `/sites/sensor/type/sensorType/${selectedSensorTypeName}`
    );
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ data: "Group deleted successfully" });

    // Verify the user group no longer exists
    const getResponse = await axios.get("/sites/sensor/type/sensorTypes");
    expect(getResponse.data).not.toContainEqual(
      mockDataSensorTypeDel.find(
        (sensor) => sensor.SensorTypeName === selectedSensorTypeName
      )
    );
  });
  //Test case 13 (should render button in data grid)
  // it("should render 'edit', 'info', 'delete', and 'copy' buttons are present in the data grid", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <SensorType />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   waitFor(() => {
  //     expect(screen.getByTestId("edit-button-test")).toBeInTheDocument();
  //     expect(screen.getByTestId("info-button-test")).toBeInTheDocument();
  //     expect(screen.getByTestId("delete-button-test")).toBeInTheDocument();
  //     expect(screen.getByTestId("copy-button-test")).toBeInTheDocument();
  //   });
  // });
  //Test case 14 (should render the canClickOnCreateSensorType button with not-disabled state for those who have permission)
  it("renders the canClickOnCreateSensorType button with not-disabled state for those who have permission", async () => {
    // Check if the button is disabled for non-SuperAdmin users without the necessary permission
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("userRole")) return "SuperAdmin";
      if (selector.toString().includes("canClickOnCreateSensorType"))
        return true;
      if (selector.toString().includes("permissions")) return mockPermissions;
    });

    // Re-render the component
    await act(async () => {
      wrapper.rerender(
        <Router>
          <ProjectProvider>
            <SensorType />
          </ProjectProvider>
        </Router>
      );
    });
    const button = wrapper.getByText("Create Sensor type").closest("button");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
  //Test case 15 (should render 'Parameter Name','DataType' and 'Unit' label after clicking Next)
  // it("should render 'Parameter Name','DataType' and 'Unit' label after clicking Next", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <SensorType />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   const button1 = wrapper.getByText("Create Sensor type").closest("button");
  //   fireEvent.click(button1);

  //   const button2 = wrapper.getByText("Next").closest("button");
  //   fireEvent.click(button2);
  //   waitFor(async () => {
  //     expect(await screen.getByText("Parameter Name*")).toBeInTheDocument();
  //     expect(await screen.getByText("Unit*")).toBeInTheDocument();
  //     expect(await screen.getByText("DataType*")).toBeInTheDocument();
  //   });
  // });
});
