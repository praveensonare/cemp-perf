import {
  render,
  waitFor,
  fireEvent,
  screen,
  within,
  getByTestId,
} from "@testing-library/react";
import React from "react";
import { useNavigate } from 'react-router-dom';
import { act } from "react-dom/test-utils";
import Login from "../../pages/Login.js";
import { ProjectProvider } from "../../ProjectContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Auth } from "aws-amplify";
import { message } from "antd";

// Mocking aws-amplify
jest.mock("aws-amplify", () => ({
  Auth: {
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
  Amplify: {
    configure: jest.fn(),
  },
}));

// Mocking antd message
jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    error: jest.fn(),
  },
}));

//mock the useNavigate and useLocation hooks from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: () => jest.fn().mockName("navigate"),
}));

describe("Login-Page", () => {
  let wrapper;

  beforeEach(async () => {
    //act
    await act(async () => {
      wrapper = render(
        <Router>
          <Login />
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

  it("should render email input", async () => {
    await waitFor(() => {
      expect(wrapper.getByPlaceholderText("name@mail.com")).toBeInTheDocument();
    });
  });

  it("should render password input", async () => {
    await waitFor(() => {
      expect(wrapper.getByPlaceholderText("Password")).toBeInTheDocument();
    });
  });

  it("should render login Text", async () => {
    await waitFor(() => {
      const loginButtons = wrapper.getAllByText("Login");
      expect(loginButtons).toHaveLength(2);
    });
  });

  it("should render login button", async () => {
    await waitFor(() => {
      const loginButton = wrapper.getByRole("button", { name: "Login" });
      expect(loginButton).toBeInTheDocument();
    });
  });

  it("should render forgot password link", async () => {
    await waitFor(() => {
      expect(wrapper.getByText("Forgot Password?")).toBeInTheDocument();
    });
  });

  it("should change value of email input when onChange is triggered", async () => {
    await waitFor(() => {
      const emailInput = wrapper.getByPlaceholderText("name@mail.com");
      fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
      expect(emailInput.value).toBe("test@mail.com");
    });
  });

  it("should change value of password input when onChange is triggered", async () => {
    await waitFor(() => {
      const passwordInput = wrapper.getByPlaceholderText("Password");
      fireEvent.change(passwordInput, { target: { value: "password" } });
      expect(passwordInput.value).toBe("password");
    });
  });

  // Test Case 9 : Error Message Displayed when Email or Password is wrong
  it("displays error message when password or email is wrong", async () => {
    const errorMessage = "Incorrect Email or Password";
    Auth.signIn.mockImplementationOnce(() => {
      throw {
        code: "NotAuthorizedException",
        message: errorMessage,
      };
    });

    const emailInput = wrapper.getByPlaceholderText("name@mail.com");
    const passwordInput = wrapper.getByPlaceholderText("Password");
    const loginButton = wrapper.getByTestId("login-button");

    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongPassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  // Test Case 10 : Error Message Displayed when Email is not present
  it("displays error message when email is not present", async () => {
    const errorMessage = "Please Enter Your Email ID";
    Auth.signIn.mockImplementationOnce(() => {
      throw {
        code: "NotAuthorizedException",
        message: errorMessage,
      };
    });

    const emailInput = wrapper.getByPlaceholderText("name@mail.com");
    const passwordInput = wrapper.getByPlaceholderText("Password");
    const loginButton = wrapper.getByTestId("login-button");

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "Welcome@2023#" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  // Test Case 11 : Error Message Displayed when Password is not present
  it("displays error message when password is not present", async () => {
    const errorMessage = "Please Enter The Password";
    Auth.signIn.mockImplementationOnce(() => {
      throw {
        code: "NotAuthorizedException",
        message: errorMessage,
      };
    });

    const emailInput = wrapper.getByPlaceholderText("name@mail.com");
    const passwordInput = wrapper.getByPlaceholderText("Password");
    const loginButton = wrapper.getByTestId("login-button");

    fireEvent.change(emailInput, {
      target: { value: "ram.krishan@infosys.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  // Test Case 12 : Error Message Displayed when Temporary Password is expired
  it("displays error message when temporary password is expired", async () => {
    const errorMessage =
      "Your temporary password has expired. Please reset your password.";
    Auth.signIn.mockImplementationOnce(() => {
      throw {
        code: "ExpiredCodeException",
        message: errorMessage,
      };
    });

    const emailInput = wrapper.getByPlaceholderText("name@mail.com");
    const passwordInput = wrapper.getByPlaceholderText("Password");
    const loginButton = wrapper.getByTestId("login-button");

    fireEvent.change(emailInput, {
      target: { value: "ram.krishan@infosys.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "Welcome@2023#" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  //Test Case 13 : Should show password when clicked on eye icon
  it("should show password when clicked on eye icon", async () => {
    const icon = wrapper.getByTestId("password-visibility-toggle");
    const passwordInput = wrapper.getByPlaceholderText("Password");
    expect(passwordInput.type).toBe("password");
    fireEvent.click(icon);
    expect(passwordInput.type).toBe("text");
  });

  //Test Case 14 : Should hide password when clicked on eye icon
  it("should hide password when clicked on eye icon", async () => {
    const icon = wrapper.getByTestId("password-visibility-toggle");
    const passwordInput = wrapper.getByPlaceholderText("Password");
    expect(passwordInput.type).toBe("password");
    fireEvent.click(icon);
    expect(passwordInput.type).toBe("text");
    fireEvent.click(icon);
    expect(passwordInput.type).toBe("password");
  });

});

describe("Login Component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
    window.alert = jest.fn();
  });

  // Test Case 15 : handleUserInteraction function when token is not expired
  it("handleUserInteraction function when token is not expired", () => {
    const navigate = useNavigate();
    render(
      <Router>
        <Login />
      </Router>
    );
    fireEvent.keyDown(window);
    expect(Auth.signOut).not.toHaveBeenCalled();
    expect(window.localStorage.setItem).not.toHaveBeenCalled();
    expect(window.localStorage.removeItem).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });
});
