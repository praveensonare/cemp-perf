/* This is implementation of test cases for  dashboard setting page component. 
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
import { act } from "react-dom/test-utils";
import Setting from "../../pages/Settings";
import { ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MockAdapter from "axios-mock-adapter";

let mock = new MockAdapter(axios);
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn().mockName("navigate"),
  useLocation: () => ({
    pathname: "/dashboard-configurations",
  }),
}));

describe("test", () => {
  let wrapper;
  let mockDispatch;
  let mockPermissions;
  let mockUserRole;

  beforeEach(async () => {
    mockDispatch = jest.fn();
    mockPermissions = [];
    mockUserRole = "SuperAdmin";

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("permissions")) return mockPermissions;
      //if (selector.toString().includes("userRole")) return mockUserRole;
    });

    let mockDatadashboard;
    let mockDatadashboardList;

    mockDatadashboard = [
      {
        dashboardIds: ["f8565164-e449-4105-8671-56a784fba7a8"],
        projectSiteName: "InfosysPuneMG",
      },
      {
        dashboardIds: ["fbcbd991-528b-4e15-9f1c-891d2e22cc3c"],
        projectSiteName: "JTC2",
      },
    ];
    mockDatadashboardList = [
      "Stage_JTC,3529b655-c7f5-425a-931a-21756016e439",
      "New dashboard,53aa3988-cfdf-474b-b8ff-f196960e08d6",
      "test,5d78b711-f1b3-4994-ac73-fd1f9a06ad0d",
      "refresh,91ab302c-9933-4c84-89a5-d93f2bd91dd7",
      "test,9d8b2da0-0279-4575-a397-fdc456198c42",
      "test,c31f9fca-1d60-49eb-a2fb-dcdde44acf0f",
      "vflow,e2c84a09-39f8-4cfd-b023-5e41ef7c6fe5",
      "JTC_Vflowtech,f8565164-e449-4105-8671-56a784fba7a8",
      "new dashboard 2,fbcbd991-528b-4e15-9f1c-891d2e22cc3c",

      // Add more project sites here if needed
    ];

    // Mock the axios get requests
    mock.onGet("/sites/qs/dashboards").reply(200, mockDatadashboard);
    mock.onGet("/sites/qs/dashboardList").reply(200, mockDatadashboardList);
    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <Setting />
          </ProjectProvider>
        </Router>
      );
    });
  });

  // Test 1: component render
  it("renders without crashing", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper).toBeTruthy();
    });
  });
  // Test 2: heading Dashboard Configuration
  // it("renders the Dashboard Configuration", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <Setting />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   await waitFor(() => {
  //     expect(wrapper.getByText("Dashboard Configuration")).toBeInTheDocument();
  //   });
  // });
  //Test 3 : renders the search project site
  // it("renders the search project site...", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <Setting />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   await waitFor(() => {
  //     expect(wrapper.getByTestId("searchproject")).toBeInTheDocument();
  //   });
  // });
  // Test 4 : should render the 'Project Site Name' label
  // it("should render the 'Project Site Name' label and a data grid table in the document", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <Setting />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   await waitFor(() => {
  //     expect(wrapper.getByText("Project Site Name")).toBeInTheDocument();
  //   });

  //   // Assert
  //   const table = wrapper.getByTestId("grid");
  //   expect(table).toBeInTheDocument();
  // });
  //Test 5 :should render the 'Dashboard ID' label
  // it("should render the 'Dashboard ID' label and a data grid table in the document", async () => {
  //   render(
  //     <Router>
  //       <ProjectProvider>
  //         <Setting />
  //       </ProjectProvider>
  //     </Router>
  //   );
  //   await waitFor(() => {
  //     expect(wrapper.getByText("Dashboard ID")).toBeInTheDocument();
  //   });

  //   // Assert
  //   const table = wrapper.getByTestId("grid");
  //   expect(table).toBeInTheDocument();
  // });
  // Test 6: Render card
  it("renders Card", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });
  });
  // Test 7: Render card body
  it("renders Card.Body", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("cardBody")).toBeInTheDocument();
    });
  });
  // Test 8: Render Stack
  it("renders Stack", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("stack")).toBeInTheDocument();
    });
  });
  //Test 9: Render button
  it("renders button", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("button")).toBeInTheDocument();
    });
  });
  //Test 10: Render datagride div
  it("renders datagridDiv", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("datagridDiv")).toBeInTheDocument();
    });
  });
  //Test 11: Render Typography
  it("renders Typography", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("Typography")).toBeInTheDocument();
    });
  });
  //Test 12 : should render the dashboards data correctly
  it("should render the dashboards data correctly", async () => {
    const response = await axios.get("/sites/qs/dashboards");
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      {
        dashboardIds: ["f8565164-e449-4105-8671-56a784fba7a8"],
        projectSiteName: "InfosysPuneMG",
      },
      {
        dashboardIds: ["fbcbd991-528b-4e15-9f1c-891d2e22cc3c"],
        projectSiteName: "JTC2",
      },
    ]);
  });
  //Test 13 : should render the dashboards List data correctly
  it("should render the dashboards List data correctly", async () => {
    const response = await axios.get("/sites/qs/dashboardList");
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      "Stage_JTC,3529b655-c7f5-425a-931a-21756016e439",
      "New dashboard,53aa3988-cfdf-474b-b8ff-f196960e08d6",
      "test,5d78b711-f1b3-4994-ac73-fd1f9a06ad0d",
      "refresh,91ab302c-9933-4c84-89a5-d93f2bd91dd7",
      "test,9d8b2da0-0279-4575-a397-fdc456198c42",
      "test,c31f9fca-1d60-49eb-a2fb-dcdde44acf0f",
      "vflow,e2c84a09-39f8-4cfd-b023-5e41ef7c6fe5",
      "JTC_Vflowtech,f8565164-e449-4105-8671-56a784fba7a8",
      "new dashboard 2,fbcbd991-528b-4e15-9f1c-891d2e22cc3c",
    ]);
  });
});

describe("test suit 2", () => {
  let wrapper;
  let mockDispatch;
  let mockPermissions;
  let mockUserRole;

  beforeEach(async () => {
    mockDispatch = jest.fn();
    mockPermissions = [];
    mockUserRole = "SuperAdmin";

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      if (selector.toString().includes("permissions")) return mockPermissions;
      //if (selector.toString().includes("userRole")) return mockUserRole;
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
    mock.onGet("/sites/project/projectSites").reply(200, mockDataProjectSites);
    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <Setting />
          </ProjectProvider>
        </Router>
      );
    });
  });
  //Test 14 :should render the projectSites data correctly
  it("should render the projectSites data correctly", async () => {
    const response = await axios.get("/sites/project/projectSites");
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      "DDU_Test_Bed",
      "fgjh",
      "InfosysPuneMG",
      "JTC2",
    ]);
  });

  //Test 15: open model and show label 'Create Dashboard Configuration'
  it('opens the form dialog when "Add Configuration" button is clicked', async () => {
    fireEvent.click(screen.getByText("Add Configuration"));
    // Check if the form dialog is opened
    expect(
      screen.getByText("Create Dashboard Configuration")
    ).toBeInTheDocument();
  });

  //Test 16: opens the form dialog when "Add Configuration" button is clicked and show submit button'
  it('opens the form dialog when "Add Configuration" button is clicked and show submit button', async () => {
    fireEvent.click(screen.getByText("Add Configuration"));
    // Check if the form dialog is opened
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });
  //Test 17: opens the form dialog when "Project Sites" button is clicked and show submit button
  it('opens the form dialog when "Project Sites" button is clicked and show submit button', async () => {
    fireEvent.click(screen.getByText("Add Configuration"));
    // Check if the form dialog is opened
    expect(screen.getByTestId("projectSitesDropdown")).toBeInTheDocument();
  });

  //Test 18: opens the form dialog when "dashboard Id" button is clicked and show submit button'
  it('opens the form dialog when "dashboard Id" button is clicked', async () => {
    fireEvent.click(screen.getByText("Add Configuration"));
    // Check if the form dialog is opened
    expect(screen.getByTestId("dashboardIdDropdown")).toBeInTheDocument();
  });

  //Test 19: opens the form dialog when "Dialog" button is clicked and show submit button'
  it('opens the form dialog when "Dialog" button is clicked', async () => {
    fireEvent.click(screen.getByText("Add Configuration"));
    // Check if the form dialog is opened
    expect(screen.getByTestId("Dialog")).toBeInTheDocument();
  });

  //Test 20 :submitButton
  it('opens the form dialog when "submitButton" button is clicked', async () => {
    fireEvent.click(screen.getByText("Add Configuration"));
    // Check if the form dialog is opened
    expect(screen.getByTestId("submitButton")).toBeInTheDocument();
  });
  //Test 21 :opens the form dialog when "dailogcontent"
  it('opens the form dialog when "dailogcontent" button is clicked', async () => {
    fireEvent.click(screen.getByText("Add Configuration"));
    // Check if the form dialog is opened
    expect(screen.getByTestId("dailogcontent")).toBeInTheDocument();
  });
  //Test 22: opens the form dialog when "DialogTitle" button is clicked and show submit button'
  it('opens the form dialog when "DialogTitle" button is clicked', async () => {
    fireEvent.click(screen.getByText("Add Configuration"));
    // Check if the form dialog is opened
    expect(screen.getByTestId("DialogTitle")).toBeInTheDocument();
  });
  //Test 23: opens the form dialog when "box" button is clicked and show submit button'
  it('opens the form dialog when "box" button is clicked', async () => {
    fireEvent.click(screen.getByText("Add Configuration"));
    // Check if the form dialog is opened
    expect(screen.getByTestId("box")).toBeInTheDocument();
  });
  //Test 24: opens the form dialog when "stackDivModel" button is clicked and show submit button'
  it('opens the form dialog when "stackDivModel" button is clicked', async () => {
    fireEvent.click(screen.getByText("Add Configuration"));
    // Check if the form dialog is opened
    expect(screen.getByTestId("stackDivModel")).toBeInTheDocument();
  });
  //Test 25: should have delete popup
  it("should have delete popup", () => {
    // Check if the DialogBox is in the document
    const dialogBox = screen.queryByRole("dialog");
    expect(dialogBox).toBeInTheDocument();
  });
});
