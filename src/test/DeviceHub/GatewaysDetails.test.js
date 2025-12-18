/* This is implementation of test cases for Gateways Details component. 
  Author : Karbhari Gadekar  
*/
import {
    render,
    waitFor,
    screen,
  } from "@testing-library/react";
  import React from "react";
  import axios from "axios";
  import { Amplify } from "aws-amplify";
  import { act } from "react-dom/test-utils";
  import { ProjectContext, ProjectProvider } from "../../ProjectContext";
  import { BrowserRouter as Router } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import MockAdapter from "axios-mock-adapter";
  import GatewatsDetails from "../../pages/DeviceHub/GatewaysDetails";
  
  
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
      pathname: "/project-sites/JTC2/gateways/INFOSYS/gateways-details",
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
        data: {
          IOTTopicName: "Vflow/JTC2/INFOSYS",
          IOTPrivateKeyS3Location:
            "https://d3nu7v4e1iwqhz.cloudfront.net/iot/things/INFOSYS_private.pem.key",
          IOTThingName: "INFOSYS",
          projectSiteName: "JTC2",
          IOTCertificateId:
            "ba0e99210670247992caa67edaed7157c33e6be651157a46a32e18d9055e4d51",
          Description: "INFOSYS Edge",
          GatewayName: "INFOSYS",
          IOTServerURL: "a4p7ltwn43gm2-ats.iot.ap-southeast-2.amazonaws.com",
          IOTCertificatePemS3Location:
            "https://d3nu7v4e1iwqhz.cloudfront.net/iot/things/INFOSYS_certificate.pem.crt",
          IOTCertificateArn:
            "arn:aws:iot:ap-southeast-2:213376546282:cert/ba0e99210670247992caa67edaed7157c33e6be651157a46a32e18d9055e4d51",
        },
      });
  
      await act(async () => {
        wrapper = render(
          <Router>
            <ProjectProvider>
              <GatewatsDetails />
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
  
   
  });
  