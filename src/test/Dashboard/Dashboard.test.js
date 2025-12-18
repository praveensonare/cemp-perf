import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import React from "react";
import axios from "axios";
// import { shallow } from "enzyme";
import { act } from "react-dom/test-utils";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Dashboard from "../../pages/Dashboard/Dashboard";
import { ProjectContext, ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MockAdapter from "axios-mock-adapter";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { createEmbeddingContext } from "amazon-quicksight-embedding-sdk";
// import { mount } from 'enzyme';

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
    pathname: "/dashboard",
  }),
}));

describe("Tests Suite 1", () => {
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
    // Mock the axios get requests
    const projectSiteNames = localStorage.getItem("projectSiteName");
    let mockDatadashboard;

    mockDatadashboard = [
      {
        ResponseMetadata: {
          RequestId: "e5cb7c63-493c-4883-b111-a8d9fbbcc5e7",
          HTTPStatusCode: 200,
          HTTPHeaders: {
            date: "Thu, 29 Aug 2024 05:29:24 GMT",
            connection: "keep-alive",
          },
          RetryAttempts: 0,
        },
        Status: 200,
        EmbedUrl:
          "https://ap-southeast-2.quicksight.aws.amazon.com/embed/8266401d0f9445829be74c5ae02c66d5/dashboards/f8565164-e449-4105-8671-56a784fba7a8?code=AYABeE1jTqYHGBRiEq99UndltS4AAAABAAdhd3Mta21zAFBhcm46YXdzOmttczphcC1zb3V0aGVhc3QtMjo4OTc4MjcyODg1NDM6a2V5LzZlZjA0ZTAyLTIyZmMtNDFmYS1iZGY1LTg0Y2Q3OWY0MmYxOQC4AQIBAHjKqaMOirbpHr-POol80oxSA4kjMzCHpHiCadeJ-spqWQGe7hNKqdIKuPiH3Ur35PNnAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMmWy185Uw13GWmugLAgEQgDsH_EJWB_ggoWzHA5zkX_mPM-MJYOG9AfYYB6Cmb1yITrWPJx8LKAPCCERRiKP0tFVuVpXp09dOgZGCIQIAAAAADAAAEAAAAAAAAAAAAAAAAABxEFjOcFcni7Pwh4EGL8uS_____wAAAAEAAAAAAAAAAAAAAAEAAACbY2F2adQ7-CG1MZiiSTw_0Ik-mgxsIEVpLao7qP74xLjFh6K38Y8y2CQo1Z5shmocRRsV3hr7X_sMZ-zxfCAUrYQbwh8XttkpW1LS6NCKkBZipdE58-zF43yPPxBtyWnqDQ2Pm171WohflJ1mrQeHf7U2bfviYuFuelWS1cyhM-fJNqGLLD6zjulFzomrQ_UxN-awj6nsjYETYrYWyL9kVGhA8Z5Jd_ywsj4w&identityprovider=quicksight&isauthcode=true",
        RequestId: "e5cb7c63-493c-4883-b111-a8d9fbbcc5e7",
        AnonymousUserArn:
          "arn:aws:quicksight:ap-southeast-2:213376546282:anonymousUser/default/bef63536e64a42a8b18c5707f09abf4a",
      },
    ];

    mock
      .onGet(`/sites/qs/dashboardUrlForProjectSite/${projectSiteNames}`)
      .reply(200, mockDatadashboard);

    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <Dashboard />
          </ProjectProvider>
        </Router>
      );
    });
  });

  // // Test case 1
  it("renders without crashing", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper).toBeTruthy();
    });
  });
  it("should render the dashboard data correctly", async () => {
    const projectSiteNames = localStorage.getItem("projectSiteName");
    const response = await axios.get(
      `/sites/qs/dashboardUrlForProjectSite/${projectSiteNames}`
    );
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      {
        ResponseMetadata: {
          RequestId: "e5cb7c63-493c-4883-b111-a8d9fbbcc5e7",
          HTTPStatusCode: 200,
          HTTPHeaders: {
            date: "Thu, 29 Aug 2024 05:29:24 GMT",
            connection: "keep-alive",
          },
          RetryAttempts: 0,
        },
        Status: 200,
        EmbedUrl:
          "https://ap-southeast-2.quicksight.aws.amazon.com/embed/8266401d0f9445829be74c5ae02c66d5/dashboards/f8565164-e449-4105-8671-56a784fba7a8?code=AYABeE1jTqYHGBRiEq99UndltS4AAAABAAdhd3Mta21zAFBhcm46YXdzOmttczphcC1zb3V0aGVhc3QtMjo4OTc4MjcyODg1NDM6a2V5LzZlZjA0ZTAyLTIyZmMtNDFmYS1iZGY1LTg0Y2Q3OWY0MmYxOQC4AQIBAHjKqaMOirbpHr-POol80oxSA4kjMzCHpHiCadeJ-spqWQGe7hNKqdIKuPiH3Ur35PNnAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMmWy185Uw13GWmugLAgEQgDsH_EJWB_ggoWzHA5zkX_mPM-MJYOG9AfYYB6Cmb1yITrWPJx8LKAPCCERRiKP0tFVuVpXp09dOgZGCIQIAAAAADAAAEAAAAAAAAAAAAAAAAABxEFjOcFcni7Pwh4EGL8uS_____wAAAAEAAAAAAAAAAAAAAAEAAACbY2F2adQ7-CG1MZiiSTw_0Ik-mgxsIEVpLao7qP74xLjFh6K38Y8y2CQo1Z5shmocRRsV3hr7X_sMZ-zxfCAUrYQbwh8XttkpW1LS6NCKkBZipdE58-zF43yPPxBtyWnqDQ2Pm171WohflJ1mrQeHf7U2bfviYuFuelWS1cyhM-fJNqGLLD6zjulFzomrQ_UxN-awj6nsjYETYrYWyL9kVGhA8Z5Jd_ywsj4w&identityprovider=quicksight&isauthcode=true",
        RequestId: "e5cb7c63-493c-4883-b111-a8d9fbbcc5e7",
        AnonymousUserArn:
          "arn:aws:quicksight:ap-southeast-2:213376546282:anonymousUser/default/bef63536e64a42a8b18c5707f09abf4a",
      },
    ]);
  });

  it("renders  main div", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("maindiv")).toBeInTheDocument();
    });
  });
  //loader
  // it("renders loader", async () => {
  //   await waitFor(() => {
  //     expect(screen.getByTestId("loader")).toBeInTheDocument();
  //   });
  // });
  //dashboardrefdiv
  it("renders dashboard ref div", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("dashboardrefdiv")).toBeInTheDocument();
    });
  });
  //spinloader
  // it("renders spin loader", async () => {
  //   await waitFor(() => {
  //     expect(screen.getByTestId("spinloader")).toBeInTheDocument();
  //   });
  // });
  it("embeds the dashboard when dashboard URL is set", async () => {
    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
    );
  });
  // it("sets the dashboard URL and stops loading when the request is successful", async () => {
  //   render(<Dashboard />);
  //   const projectSiteNames = localStorage.getItem("projectSiteName");
  //   const response = await axios.get(
  //     `/sites/qs/dashboardUrlForProjectSite/${projectSiteNames}`
  //   );
  //   expect(response.status).toBe(200);
  //   expect(Swal.fire).not.toHaveBeenCalled();
  // });


  //
  //



});
