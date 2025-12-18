import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Amplify } from "aws-amplify";
import configureStore from "redux-mock-store";
import { act } from "react-dom/test-utils";
import { ProjectContext, ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MockAdapter from "axios-mock-adapter";
import Projects from "../../pages/RoleManager/Projects";
import Swal from "sweetalert2";

// Mock the Axios library with Jest
jest.mock("axios");

//Mock the sweetalert2 library with Jest
jest.mock("sweetalert2");

//Mock the amplify library with Jest
jest.mock("aws-amplify", () => ({
  Amplify: {
    configure: jest.fn(),
  },
  Auth: {
    currentAuthenticatedUser: jest.fn(() =>
      Promise.resolve({ username: "ram.krishan@infosys.com" })
    ),
  },
}));

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

describe("Test suite 1", () => {
  let wrapper;

  beforeEach(async () => {
    mock.reset();
    const mockDispatch = jest.fn();
    let mockUserRole = "SuperAdmin";
    useDispatch.mockReturnValue(mockDispatch);
    const mockPermissions = ["canClickOnDeviceHubInSidePane"];
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("permissions")) return mockPermissions;
      if (selector.toString().includes("userRole")) return mockUserRole;
    });

    axios.get.mockResolvedValueOnce({
      data: [
        {
          projectGroups: ["Infy3UG", "JTC2", "test"],
          projectSiteName: "DDU_Test_Bed",
          projectSiteAlias: "DDU_Microgrid",
          description: "test site at DDU campus",
          projectLocation: "Ahmedabad,GJ,IN",
        },
        {
          projectGroups: ["INFOSYS_Grp", "JTC2"],

          projectSiteName: "InfosysPuneMG",
          projectSiteAlias: "InfosysPuneMG",
          description: "Pune site",
          projectLocation: "Pune,MH,IN",
        },
        {
          projectGroups: ["JTC2", "Infy3UG", "Test_dataCleanUp"],

          projectSiteName: "JTC2",
          projectSiteAlias: "JTC_Microgrid",
          description: "JTC2",
          projectLocation: "Singapore,01,SG",
        },
      ],
    });

    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <Projects />
          </ProjectProvider>
        </Router>
      );
    });
  });

  // Test case 1
  it("should render the component without throwing an error", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper).toBeTruthy();
    });
  });

  //Test case 2
  it("Should render projects heading", async () => {
    //Assert
    await waitFor(() => {
      expect(screen.getByText("Projects")).toBeInTheDocument();
    });
  });

  it("Should render create project site button", async () => {
    //Assert
    await waitFor(() => {
      expect(screen.getByText("New Project")).toBeInTheDocument();
    });
  });

  it("Should render search input box", async () => {
    // Assert
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Search project..")
      ).toBeInTheDocument();
    });
  });

  it("handle input changes correctly", async () => {
    // Act
    const input = screen.getByPlaceholderText("Search project..");
    fireEvent.change(input, { target: { value: "JTC2" } });
    // Assert
    expect(input.value).toBe("JTC2");
  });

  it("Should render project name column", async () => {
    // Assert
    await waitFor(() => {
      expect(screen.getByText("Project Name")).toBeInTheDocument();
    });
  });

  it("Should render project alias column", async () => {
    // Assert
    await waitFor(() => {
      expect(screen.getByText("Project Alias")).toBeInTheDocument();
    });
  });

  it("Should render project location column", async () => {
    // Assert
    await waitFor(() => {
      expect(screen.getByText("Project Location")).toBeInTheDocument();
    });
  });

  it("On click of create project site button form should open and have name , alias name ,img and description field with submit button", async () => {
    //Act
    fireEvent.click(screen.getByText("New Project"));
    //Assert
    await waitFor(() => {
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Alias Name")).toBeInTheDocument();
      expect(screen.getByText("Country")).toBeInTheDocument();
      expect(screen.getByText("or drag and drop*")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Submit")).toBeInTheDocument();
      expect(screen.getByText("New Project")).toBeInTheDocument();
      expect(screen.getByText("Project Details")).toBeInTheDocument();
    });
  });

  it("show error msg when submited and fields are empty", async () => {
    //Act
    fireEvent.click(screen.getByText("New Project"));
    fireEvent.click(screen.getByText("Submit"));
    //Assert
    await waitFor(() => {
      expect(screen.getByText("All fields are required")).toBeInTheDocument();
    });
  });

  it("fetches project sites from an API", async () => {
    const data = {
      data: [
        {
          projectGroups: ["Infy3UG", "JTC2", "test"],
          projectSiteName: "DDU_Test_Bed",
          projectSiteAlias: "DDU_Microgrid",
          description: "test site at DDU campus",
          projectLocation: "Ahmedabad,GJ,IN",
        },
        {
          projectGroups: ["INFOSYS_Grp", "JTC2"],

          projectSiteName: "InfosysPuneMG",
          projectSiteAlias: "InfosysPuneMG",
          description: "Pune site",
          projectLocation: "Pune,MH,IN",
        },
        {
          projectGroups: ["JTC2", "Infy3UG", "Test_dataCleanUp"],

          projectSiteName: "JTC2",
          projectSiteAlias: "JTC_Microgrid",
          description: "JTC2",
          projectLocation: "Singapore,01,SG",
        },
      ],
    };
    axios.get.mockResolvedValue(data);

    render(
      <Router>
        <ProjectProvider>
          <Projects />
        </ProjectProvider>
      </Router>
    );

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith("/sites/project/projectSites")
    );

    await waitFor(() =>
      expect(axios.get.mock.results[0].value).resolves.toEqual(data)
    );
  });

  it("renders with all columns", () => {
    const columns = [
      { field: "projectSiteName", headerName: "Project Name" },
      { field: "projectSiteAlias", headerName: "Project Alias" },
      { field: "projectLocation", headerName: "Project Location" },
    ];
    const rows = [
      { id: 1, name: "John Doe", age: 30 },
      { id: 2, name: "Jane Doe", age: 25 },
    ];

    columns.forEach((column) => {
      const header = screen.getByRole("columnheader", {
        name: column.headerName,
      });
      expect(header).toBeInTheDocument();
    });
  });
  it("should send a delete request to the API", async () => {
    // Arrange
    const selectedProject = "JTC2";
    const deleteUrl = `/sites/project/projectSite/${selectedProject}`;
    const deleteResponse = { success: true };
    axios.delete.mockResolvedValueOnce({ data: deleteResponse });
  });

  // it("renders with the associated project from the state", () => {
  //   const mockStore = configureStore();
  //   const initialState = { AssociatedProject: "JTC2" };
  //   const store = mockStore(initialState);

  //   render(
  //     <Router>
  //       <ProjectProvider store={store}>
  //         <Projects />
  //       </ProjectProvider>
  //     </Router>
  //   );

  //   // Replace the following line with an actual check that depends on the associated project
  //   expect(
  //     screen.getByText(initialState.AssociatedProject)
  //   ).toBeInTheDocument();
  // });

  // it("renders with the user groups for project from the state", () => {
  //   const mockStore = configureStore();
  //   const initialState = { userGroupsForProject: "JTC2" };
  //   const store = mockStore(initialState);

  //   render(
  //     <Router>
  //       <ProjectProvider store={store}>
  //         <Projects />
  //       </ProjectProvider>
  //     </Router>
  //   );

  //   // Replace the following line with an actual check that depends on the user groups for project
  //   expect(
  //     screen.getByText(initialState.userGroupsForProject)
  //   ).toBeInTheDocument();
  // });

});
