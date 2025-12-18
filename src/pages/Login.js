/* This is implementation of Login flow in the application.
  Author : Shweta Vyas
  Revision:
        21-02-2024 : changes done for session timeout and token expiration  
        4/3/24: UI modification   
        17/24: configured TV-user for different session timeout 
*/

import React, { useEffect, useState } from "react";
import Navbar from 'react-bootstrap/Navbar';
import { message } from "antd";
import logo from '../assets/brand/Logo.webp'
import "../styles/RegisterStyles.css";
import Logo from '../assets/brand/Logo.webp'
import infosys from '../assets/images/infosys.png'
import { Auth } from "aws-amplify";
import { Link, useNavigate } from "react-router-dom";
import { Amplify } from 'aws-amplify';
import Container from "react-bootstrap/esm/Container";
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { FormHelperText } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const Login = () => {
  const navigate = useNavigate()
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const [passwordError, setPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [user, setUser] = useState(null);
  //conditional rendering
  const [showNewPasswordForm, setShowNewPasswordForm] = React.useState(false);

  //password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  //it prevents the button from losing focus when clicked
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //New password validation according to cognito password policy
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,99}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be 6-99 characters, and include one uppercase letter, one lowercase letter, one number, and one special character.');
    } else {
      setPasswordError('');
    }
  };

  // This function checks if the token has expired
  function isTokenExpired() {
    const currentTime = Math.floor(new Date().getTime() / 1000); // current time in seconds
    //If the current time is greater than or equal to initialTokenExpirationTime, the token has expired, and the function returns true.
    return currentTime >= initialTokenExpirationTime;
  }

  // Call this function whenever the user interacts with your application
  function handleUserInteraction() {
    if (isTokenExpired()) {
      // The token has expired, so sign out the user
      Auth.signOut();
      localStorage.setItem('authState', 'signedOutCurrentBrowserSession'); // set authState to 'signedOutCurrentBrowserSession' to redirect to the login page
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('tokenExpirationTime');
      navigate('/');
      alert('Your session has timed out. Please log in again.');
      console.log('handleUserInteraction function called and User signed out after token expired ');
    } else {
      // The token is still valid, so the user can continue interacting with the application
    }
  }

  // Login-function
  let initialTokenExpirationTime;
  let handleSubmit = async function (event) {
    event.preventDefault();
    // Check if the code field is empty.
    if (password === "") {
      message.error("Please Enter The Password");
      return;
    }
    if (email === "") {
      message.error("Please Enter Your Email ID");
      return;
    }
    // Configure Amplify based on the general user and Tv user
    try {
      if (email.trim() === window.REACT_APP_TV_USEREMAIL) {
        console.log('Client ID : TV user');
        Amplify.configure({
          Auth: {
            region: window.REACT_APP_REGION,
            userPoolId: window.REACT_APP_USER_POOL_ID,
            userPoolWebClientId: window.REACT_APP_USER_POOL_APP_CLIENT_ID_1,
          },
        });
      } else {
        console.log('Client ID: General user');
        Amplify.configure({
          Auth: {
            region: window.REACT_APP_REGION,
            userPoolId: window.REACT_APP_USER_POOL_ID,
            userPoolWebClientId: window.REACT_APP_USER_POOL_APP_CLIENT_ID,
          },
        });
      }

      const user = await Auth.signIn(email.trim(), password.trim());
      setUser(user);
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        setShowNewPasswordForm(true);
        const loggedInUser = await Auth.completeNewPassword(
          user, // the Cognito User Object
          newPassword // the new password
        );
        message.success("Password Changed Successfully");
        navigate("/");
        console.log("loggged In user", loggedInUser);
        console.log("Temporary password has been changed");
      } else {
        const token = user.signInUserSession.accessToken.jwtToken;
        //Decodes the payload part of the JWT.
        const payload = JSON.parse(atob(token.split(".")[1]));
        //Extracts the expiration time (exp) from the decoded payload.
        initialTokenExpirationTime = payload.exp;

        // Store the token and expiration time in local storage
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("tokenExpirationTime", initialTokenExpirationTime);
      }
      localStorage.setItem("authState", "signedIn");
      navigate("/project-sites");
      message.success("Logged In Successfully");
    } catch (error) {
      // Display the "Incorrect Username or Password" message only if the user's password is actually incorrect.
      if (error.code === "NotAuthorizedException") {
        if (
          error.message === "Access Token has been revoked" ||
          error.message === "Refresh Token has been revoked"
        ) {
          console.log("Your session has expired. Please log in again.");
          console.log("error from line 188", error);
        } else {
          message.error("Incorrect Email or Password");
        }
      } else if (error.code === "ExpiredCodeException") {
        message.error(
          "Your temporary password has expired. Please reset your password."
        );
      } else {
        console.log(error);
        message.error(error.message);
      }
    }
  };

  useEffect(() => {
    // Call handleUserInteraction whenever the user interacts with the application
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  return (
    <>
      {showNewPasswordForm && (<div>
        <div className="bg-image">
          <Navbar bg="white" data-bs-theme="light">
            <Container className="login_Header">
              <Navbar.Brand href="#home" >
                <img className='vflow_logo_login' width="150" height="76" src={logo} alt='logo' />
              </Navbar.Brand>
              <Navbar.Brand href="#home">
                <img className='infosys_logo_login' src={infosys} alt='logo' />
              </Navbar.Brand>
            </Container>
          </Navbar>
          <div className="center">
            <form className="form_container" onSubmit={handleSubmit}>
              <div className="logo_containers" style={{ marginTop: '25px' }}>
                <img src={Logo} className="img_con" alt="dd" />
              </div>
              <div className="title_container" style={{ marginTop: '10px' }}>

                <span className="subtitle">
                  Please enter a New Password to login
                </span>
              </div>
              <div className="input_container" style={{ gap: '10px' }}>

                <OutlinedInput
                  placeholder="New Password"
                  title="Enter New Password"
                  value={newPassword}
                  type={showPassword ? "text" : "password"}
                  id="outlined-adornment-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={evt => {
                    setNewPassword(evt.target.value);
                    validatePassword(evt.target.value);
                  }}
                  inputProps={{ style: { marginLeft: '25px' } }}
                />
                <FormHelperText id="component-error-text" style={{ color: 'red' }}>
                  {passwordError && <InfoIcon style={{ fontSize: 18 }} />} {passwordError}
                </FormHelperText>
                <div className='sendCodeBtn'>
                  <button
                    type="submit"
                    className='ChangePasswordbtn'
                  >Change Password</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>)}

      {/* Otherwise, render the normal login form. */}
      {!showNewPasswordForm && (
        <div>
          {/* Normal login */}
          <div className="bg-image">
            <Navbar bg="white" data-bs-theme="light">
              <Container className="login_Header">
                <Navbar.Brand href="#home">
                  <img className='vflow_logo_login' width="150" height="76" src={logo} alt='logo' />
                </Navbar.Brand>
                <Navbar.Brand href="#home">
                  <img className='infosys_logo_login' src={infosys} alt='logo' />
                </Navbar.Brand>
              </Container>
            </Navbar>
            <div className="center">
              <form className="form_container" onSubmit={handleSubmit}>
                <div className="logo_containers">
                  <img src={Logo} className="img_con" alt="dd" />
                </div>
                <div className="title_container">
                  <p className="title">Login</p>
                  <span className="subtitle">
                    Please Enter Your Login Credentials

                  </span>
                </div>
                {/* Email field */}
                <div className="input_container">
                  <label className="input_label" htmlFor="email_field">
                    Email
                  </label>

                  <OutlinedInput
                    placeholder="name@mail.com"
                    title="Enter Email"
                    name="input-name"
                    type="text"
                    className="input_field"
                    id="email_field"
                    onChange={evt => setEmail(evt.target.value)}
                  />
                </div>

                {/* Password field */}
                <div className="input_container">
                  <label className="input_label" htmlFor="password_field">
                    Password
                  </label>
                  <OutlinedInput
                    placeholder="Password"
                    title="Enter Password"
                    type={showPassword ? "text" : "password"}
                    className="input_field"
                    id="outlined-adornment-password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          data-testid="password-visibility-toggle"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    onChange={evt => setPassword(evt.target.value)}
                  />
                </div>



                {/*  Forgot password-button */}
                <div style={{ marginLeft: '209px' }}>
                  <Link to='/ForgotPassword'>
                    <button
                      className="forgotPasswordBtn"
                      data-fullwidth="false"
                      data-size="small"
                      data-variation="link"
                      type="button"
                      id="forgotPasswordbtn">Forgot Password?
                    </button>
                  </Link>
                </div>

                {/* Sign In button */}
                <button title="Sign In" type="submit" className="sign-in_btn" data-testid="login-button" >
                  <span >Login</span>
                </button>
                <div className="separator">
                  <span></span>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </>

  );
};

export default Login;