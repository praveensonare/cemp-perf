/* This is implementation of test cases for Device Controller component. 
  Author : Karbhari Gadekar
*/
import { render, waitFor, screen, fireEvent } from "@testing-library/react";

import React from "react";
import axios from "axios";
import { Amplify } from "aws-amplify";
import { act } from "react-dom/test-utils";
import { ProjectContext, ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MockAdapter from "axios-mock-adapter";
import DeviceController from "../../pages/DeviceController";

jest.mock("axios");

//Mock the sweetalert2 library with Jest
jest.mock("sweetalert2");

//Mock the amplify library with Jest
jest.mock("aws-amplify", () => ({
  Amplify: {
    configure: jest.fn(),
  },
  Auth: {
    currentAuthenticatedUser: jest.fn(
      () => Promise.resolve({ username: "ram.krishan@infosys.com" }) // 1
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
    pathname: "/",
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

    axios.get.mockResolvedValue({
      status: 200,
      data: [
        {
          powerMode: "discharge",
          commandId: "100",
          cost: "100",
          deviceId: "JTC_EDGE_1",
          projectSiteName: "JTC2",
          timestamp: "1724823188",
          kw: "10",
          transactionId: "64fb161b-3999-4c47-8088-0839702ca48d",
          controllerStatus: "Initiated",
        },
      ],
    });

    mock.onGet("/sites/et/deviceControllers").reply(200, [
      {
        powerMode: "discharge",
        commandId: "100",
        cost: "100",
        deviceId: "JTC_EDGE_1",
        projectSiteName: "JTC2",
        timestamp: "1724823188",
        kw: "10",
        transactionId: "64fb161b-3999-4c47-8088-0839702ca48d",
        controllerStatus: "Initiated",
      },
    ]);

    // Mock the axios delete requests
    mock
      .onDelete(`/sites/et/deviceController/JTC_EDGE_1`)
      .reply(200, "Data deleted successfully.");

    await act(async () => {
      wrapper = render(
        <Router>
          <ProjectProvider>
            <DeviceController />
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

  it("should fetch the Device Controlers Data", async () => {
    const response = await axios.get("/sites/et/deviceControllers");
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      {
        powerMode: "discharge",
        commandId: "100",
        cost: "100",
        deviceId: "JTC_EDGE_1",
        projectSiteName: "JTC2",
        timestamp: "1724823188",
        kw: "10",
        transactionId: "64fb161b-3999-4c47-8088-0839702ca48d",
        controllerStatus: "Initiated",
      },
    ]);
  });

  it("should render Device Controller header", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper.getByText("Device Controller")).toBeInTheDocument();
    });
  });

  it("should render the Device Id column in table", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper.getByText("Device Id")).toBeInTheDocument();
    });
  });

  it("should render the Device Id column in table", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper.getByText("Device Id")).toBeInTheDocument();
    });
  });

  it("Should render autorefresh toggle button", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper.getByText("Auto Refresh")).toBeInTheDocument();
    });
  });


  it("should render the Tran Id column in table", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper.getByText("Trans Id")).toBeInTheDocument();
    });
  });

  //ADD CONTROLLER DEVICE button to be prsent in the document
  it("should render the Add Controller Device button", async () => {
    // Assert
    await waitFor(() => {
      expect(wrapper.getByText("Add Controller Device")).toBeInTheDocument();
    });
  });

    it("should delete the Device Controller Data", async () => {
      var deviceId = "JTC_EDGE_1";
      const response = await axios.delete(
        `/sites/et/deviceController/JTC_EDGE_1`
      );
      // expect(response.status).toBe(200);
      // expect(response.data).toEqual("Data deleted successfully.");
    });

  it("should change value of KW input and trigger onChange", async () => {
    const button = wrapper.getByText("Add Controller Device");
    fireEvent.click(button);
    const kwInput = wrapper.getByTestId("kw-input").querySelector("input");

    // Simulate valid input change
    fireEvent.change(kwInput, { target: { value: "10" } });

    await waitFor(() => {
      expect(kwInput.value).toBe("10");
    });
  });

  it("should show error msg when inavlid KW input is given", async () => {
    const button = wrapper.getByText("Add Controller Device");
    fireEvent.click(button);
    const kwInput = wrapper.getByTestId("kw-input").querySelector("input");
    fireEvent.change(kwInput, { target: { value: "abc" } });

    await waitFor(() => {
      expect(
        wrapper.getByText("kw value must be non-empty and contain only digits")
      ).toBeInTheDocument();
    });
  });

  it("should change value of cost input and trigger onChange", async () => {
    const button = wrapper.getByText("Add Controller Device");
    fireEvent.click(button);
    const costInput = wrapper.getByTestId("cost-input").querySelector("input");

    // Simulate valid input change
    fireEvent.change(costInput, { target: { value: "10" } });

    await waitFor(() => {
      expect(costInput.value).toBe("10");
    });
  });

  it("should show error msg when inavlid cost input is given", async () => {
    const button = wrapper.getByText("Add Controller Device");
    fireEvent.click(button);
    const costInput = wrapper.getByTestId("cost-input").querySelector("input");
    fireEvent.change(costInput, { target: { value: "abc" } });

    await waitFor(() => {
      expect(
        wrapper.getByText(
          "cost value must be non-empty and contain only digits"
        )
      ).toBeInTheDocument();
    });
  });

  it("should change value of Power Mode input and trigger onChange", async () => {
    const button = wrapper.getByText("Add Controller Device");
    fireEvent.click(button);
    const powerModeInput = wrapper
      .getByTestId("powerMode-input")
      .querySelector("input");

    // Simulate valid input change
    fireEvent.change(powerModeInput, { target: { value: "charge" } });

    await waitFor(() => {
      expect(powerModeInput.value).toBe("charge");
    });
  });

  it("should show error msg when inavlid Power Mode input is given", async () => {
    const button = wrapper.getByText("Add Controller Device");
    fireEvent.click(button);
    const powerModeInput = wrapper
      .getByTestId("powerMode-input")
      .querySelector("input");
    fireEvent.change(powerModeInput, { target: { value: "abc0*" } });

    await waitFor(() => {
      expect(
        wrapper.getByText(
          "Power Mode Must Not Contain Digits And Special Characters"
        )
      ).toBeInTheDocument();
    });
  });

  it("should change value of command input and trigger onChange", async () => {
    const button = wrapper.getByText("Add Controller Device");
    fireEvent.click(button);
    const commandInput = wrapper
      .getByTestId("command-input")
      .querySelector("input");

    // Simulate valid input change
    fireEvent.change(commandInput, { target: { value: "001" } });

    await waitFor(() => {
      expect(commandInput.value).toBe("001");
    });
  });

  it("should change value of TransId input and trigger onChange", async () => {
    const button = wrapper.getByText("Add Controller Device");
    fireEvent.click(button);
    const TransIdInput = wrapper
      .getByTestId("transId-input")
      .querySelector("input");

    // Simulate valid input change
    fireEvent.change(TransIdInput, { target: { value: "001" } });

    await waitFor(() => {
      expect(TransIdInput.value).toBe("001");
    });
  });

  it("should change value of deviceId input and trigger onChange", async () => {
    const button = wrapper.getByText("Add Controller Device");
    fireEvent.click(button);
    const deviceIdInput = wrapper
      .getByTestId("deviceId-input")
      .querySelector("input");

    // Simulate valid input change
    fireEvent.change(deviceIdInput, { target: { value: "JTC_EDGE_1" } });

    // Simulate selecting an option
    fireEvent.keyDown(deviceIdInput, { key: "ArrowDown" });
    fireEvent.keyDown(deviceIdInput, { key: "Enter" });

    await waitFor(() => {
      expect(deviceIdInput.value).toBe("");
    });
  });

  

  //projectSite-input
});
