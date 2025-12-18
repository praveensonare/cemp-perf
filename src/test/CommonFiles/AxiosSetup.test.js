// axiosSetup.test.js
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import setupAxiosInterceptors from "../../axiosSetup";
import { Auth } from "aws-amplify";

jest.mock("aws-amplify");

describe("Axios Interceptors", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    setupAxiosInterceptors();
  });

//Test case 1 : should handle token expired error
  it("should handle token expired error", async () => {
    mock.onGet("/test").networkError();

    try {
      await axios.get("/test");
    } catch (error) {
      expect(error.message).toBe("Network Error");
    }
  });
//Test case 2 : should handle token expiration and redirect
  it("should handle token expiration and redirect", async () => {
    Auth.signOut = jest.fn();
    mock.onGet("/tokenExpired").reply(() => {
      throw new Error("Token expired");
    });
    const originalLocation = window.location;
    delete window.location;
    window.location = { replace: jest.fn() };

    try {
      await axios.get("/tokenExpired");
    } catch (error) {
      expect(window.location.replace).toHaveBeenCalledWith("/");
    }

    window.location = originalLocation;
  });
  //Test case 3 : should handle successful responses
  it("should handle successful responses", async () => {
    mock.onGet("/success").reply(200, { data: "Success" });

    const response = await axios.get("/success");

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ data: "Success" });
  });
  //Test case 4 : should handle token expiration and redirect
  it("should handle token expiration and redirect", async () => {
    Auth.signOut = jest.fn();
    mock.onGet("/tokenExpired").reply(() => {
      throw new Error("Token expired");
    });
    const originalLocation = window.location;
    delete window.location;
    window.location = { replace: jest.fn() };

    try {
      await axios.get("/tokenExpired");
    } catch (error) {
      expect(window.location.replace).toHaveBeenCalledWith("/");
    }

    window.location = originalLocation;
  });
   // Test case: should handle other errors
   it("should handle other errors", async () => {
    mock.onGet("/otherError").reply(() => {
      throw new Error("Other error");
    });

    try {
      await axios.get("/otherError");
    } catch (error) {
      expect(error.message).toBe("Other error");
    }
  });
    // Test case: should handle 'Refresh Token has been revoked' error
    it("should handle 'Refresh Token has been revoked' error", async () => {
      Auth.signOut = jest.fn();
      mock.onGet("/refreshTokenRevoked").reply(() => {
        throw new Error("Refresh Token has been revoked");
      });
      const originalLocation = window.location;
      delete window.location;
      window.location = { replace: jest.fn() };
  
      try {
        await axios.get("/refreshTokenRevoked");
      } catch (error) {
        expect(window.location.replace).toHaveBeenCalledWith("/");
      }
  
      window.location = originalLocation;
    });
   
  
});
