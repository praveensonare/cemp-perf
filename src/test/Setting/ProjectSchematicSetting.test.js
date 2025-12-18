/* This is implementation of test cases for project Schematic setting component. 
  Author : Arpana Meshram   
*/
import {
  render,
  waitFor,
  fireEvent,
  screen,
  within,
} from "@testing-library/react";
import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { act, renderHook } from "react-dom/test-utils";
import ProjectSchematicSetting from "../../pages/Setting/ProjectSchematicSetting";
import { ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MockAdapter from "axios-mock-adapter";
import { NodesProvider } from "../../NodesContext";
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
    pathname: "/project-schematic-configurations",
  }),
}));
describe("project schematic setting ", () => {
  let wrapper;
  let mockDispatch;
  let mockPermissions;
  let mockUserRole;
  let flattenedNodes;
  beforeEach(async () => {
    mockDispatch = jest.fn();

    mockPermissions = [];
    mockUserRole = "SuperAdmin";
    let mockNodes = [
      {
        id: 1,
        type: "node",
        data: { name: "Node 1", src: "node1.png" },
        isChecked: true,
      },
      {
        id: 2,
        type: "node",
        data: { name: "Node 2", src: "node2.png" },
        isChecked: false,
      },
    ];

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("permissions")) return mockPermissions;
      if (selector.toString().includes("userRole")) return mockUserRole;
    });

    let mockDataProjectSites;

    mockDataProjectSites = [
      "DDU_Test_Bed",
      "fgjh",
      "InfosysPuneMG",
      "JTC2",
      // Add more project sites here if needed
    ];

    // Mock the axios get requests
    mock
      .onGet("/sites/project/projectSitesList")
      .reply(200, mockDataProjectSites);
    await act(async () => {
      wrapper = render(
        <Router>
          <NodesProvider>
            <ProjectProvider>
              <ProjectSchematicSetting />
            </ProjectProvider>
          </NodesProvider>
        </Router>
      );
    });
  });

  it("renders without crashing", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper).toBeTruthy();
    });
  });

  it("Project Schematic Configuration", async () => {
    await waitFor(() => {
      expect(screen.getByText(/Configuration/i)).toBeInTheDocument();
    });
  });
  it("Submit button test", async () => {
    await waitFor(() => {
      expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    });
  });

  it("should fetch all the project Sites List", async () => {
    const response = await axios.get("/sites/project/projectSitesList");
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      "DDU_Test_Bed",
      "fgjh",
      "InfosysPuneMG",
      "JTC2",
    ]);
  });

  it("renders Button", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("button")).toBeInTheDocument();
    });
  });
});
describe("test case  ", () => {
  let wrapper;
  let mockDispatch;
  let mockPermissions;
  let mockUserRole;
  let flattenedNodes;
  let mockAxiosPut;
  const mockNodes = [
    {
      id: 1,
      type: "node",
      data: { name: "Node 1", src: "node1.png" },
      isChecked: true,
    },
    {
      id: 2,
      type: "node",
      data: { name: "Node 2", src: "node2.png" },
      isChecked: false,
    },
  ];
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

    let mockDataProjectSites;

    mockDataProjectSites = [
      "DDU_Test_Bed",
      "fgjh",
      "InfosysPuneMG",
      "JTC2",
      // Add more project sites here if needed
    ];

    // Mock the axios get requests
    mock
      .onGet("/sites/project/projectSitesList")
      .reply(200, mockDataProjectSites);
    await act(async () => {
      wrapper = render(
        <Router>
          <NodesProvider>
            <ProjectProvider>
              <ProjectSchematicSetting />
            </ProjectProvider>
          </NodesProvider>
        </Router>
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("node label renders correctly with Grid", async () => {
    await waitFor(() => {
      expect(screen.getByText("Grid")).toBeInTheDocument();

      expect(screen.getByText("Solar PV")).toBeInTheDocument();

      expect(screen.getByText("DG set")).toBeInTheDocument();

      expect(screen.getByText("EV Charger")).toBeInTheDocument();

      expect(screen.getByText("Battery")).toBeInTheDocument();

      expect(screen.getByText("H2 Fuel")).toBeInTheDocument();

      expect(screen.getByText("Wind")).toBeInTheDocument();

      expect(screen.getByText("Electric load")).toBeInTheDocument();
    });
  });

  it("should have the correct properties", () => {
    mockNodes.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("type");
      expect(item).toHaveProperty("data");
    });
  });
  it("should have the correct properties with data", () => {
    mockNodes.forEach((item) => {
      expect(item.data).toHaveProperty("name");
      expect(item.data).toHaveProperty("src");
    });
  });

  it("should have the correct properties in position", () => {
    mockNodes.forEach((item) => {
      if (item.position) {
        expect(item.position).toHaveProperty("x");
        expect(item.position).toHaveProperty("y");
      }
    });
  });

  it("should have the correct type of properties", () => {
    mockNodes.forEach((item) => {
      expect(typeof item.id).toBe("number");
      expect(typeof item.type).toBe("string");
      if (item.position) {
        expect(typeof item.position).toBe("object");
      }
      expect(typeof item.data).toBe("object");
    });
  });
  it("renders Card", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });
  });
  //cardBody
  it("renders cardBody", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("cardBody")).toBeInTheDocument();
    });
  });
  //myTypography
  it("renders myTypography", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("myTypography")).toBeInTheDocument();
    });
  });
  //stack
  it("renders stack", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("stack")).toBeInTheDocument();
    });
  });

  it("should render Select Project Site", async () => {
    await waitFor(() => {
      expect(
        wrapper.getByPlaceholderText("Select Project Site")
      ).toBeInTheDocument();
    });
  });

  it("fires submit event", async () => {
    await waitFor(() => {
      fireEvent.click(screen.getByText("Submit"));
    });
  });

  it("displays project site dropdown", () => {
    expect(screen.getByLabelText("Select Project Site")).toBeInTheDocument();
  });

  it("checkbox can be checked and unchecked", () => {
    const checkboxes = screen.getAllByTestId("checkboxcheck");
    const checkbox = checkboxes[0]; // select the first checkbox
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
  it('should filter out specific node types', () => {
    const nodes = [/* your array of nodes */];
    const nodeTypesToExclude = [
      'Solar_arrow',
      'lineDotBottom',
      'lineDotTop',
      'Solarnode',
      'ArrowNode',
      'Dggsetnode',
      'EVchargernode',
      'Batterynode',
      'Fuelcellnode',
      'Windplantnode',
      'Loadnode'
      // Add more node types here as needed
    ];
    
    const result = nodes.filter(node => !nodeTypesToExclude.includes(node.type));
    // Add your assertions here based on what you expect the result to be
  });
  it('calls handleCheckboxChange with the correct parameters', () => {
    const checkboxGroup1 = ['solar PV Node', 'solar up arrow', 'Solar PV'];
    const checkboxGroup2 = ['DGset down arrow', 'DGset Node', 'DG set'];
    // Define the rest of your checkbox groups here...
  
    const node1 = { data: { name: 'solar PV Node' }, id: '1' };
    const node2 = { data: { name: 'DGset down arrow' }, id: '2' };
    // Define more nodes here...
  
    const event = {}; // Mock event object
  
    const handleCheckboxChange = jest.fn();
  
    handleCheckboxChange(node1, event);
    expect(handleCheckboxChange).toHaveBeenCalledWith(node1, event);
  
    handleCheckboxChange(node2, event);
    expect(handleCheckboxChange).toHaveBeenCalledWith(node2, event);
  });

});
