/* This is implementation of Reset Password page where user can reset their password by entering the confirmation code sent to their registered email id and new password.
  Author : Shweta Vyas 
  Revision: 4/2/2023 - updated the password policy according to cognito,displayed error messages, UI Modification and added password visibility     
*/

import React, { useState } from 'react';
import { Form, Input, message, Button, Alert } from 'antd';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../assets/brand/Logo.webp'
import logo from '../assets/brand/Logo.webp'
import infosys from '../assets/images/infosys.png'
import Container from "react-bootstrap/esm/Container";
import { Auth } from 'aws-amplify';
import { Amplify } from 'aws-amplify';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Link, useNavigate } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Tooltip from "@mui/material/Tooltip";
import { Email } from '@mui/icons-material';


// Amplify cognito configuration
Amplify.configure({
  Auth: {
    region: window.REACT_APP_REGION,
    userPoolId: window.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: window.REACT_APP_USER_POOL_APP_CLIENT_ID,
  }
})



function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [open, setOpen] = React.useState(false);

  //password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //password policy according to cognito
  const checkPasswordPolicy = (password) => {
    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPolicy.test(password);
  };

  //password validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
  };

  // Reset password function 
  async function forgotPasswordSubmit(event) {
    event.preventDefault();
    if (email === '') {
      setEmailError('Please Enter you Email.');
      return;
    }
    if (newPassword === '') {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (code === '') {
      setCodeError('Please enter confirmation code.');
      return;
    }
    try {
      const data = await Auth.forgotPasswordSubmit(email.trim(), code, newPassword);
      console.log('password updated');
      console.log('auth response', data);
      message.success('Password reset successful');
      navigate('/')
    }
    catch (err) {
      console.log(err);
      if (err.code === 'UserNotFoundException') {
        message.error('User does not exist.');
      } else if (err.code === 'ExpiredCodeException') {
        message.error('Invalid code provided, please request a code again.')
      } else if (err.code === 'CodeMismatchException') {
        message.error('Invalid verification code provided, please try again.')
      } else if (err.code === 'LimitExceededException') {
        message.error('Attempt limit exceeded, please try after some time.')
      } else if (err.code === 'InvalidParameterException') {
        message.error('Password did not conform with policy ');
      } else if (err.code === 'InvalidPasswordException') {
        message.error('Password did not conform with policy');
      }
      else {
        console.log(err);
      }
    }
  }


  return (
    <div>
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
          <form className="form_container" >
            <div className="logo_containers" style={{ marginBottom: '-5px', marginTop: '15px' }}>
              <img src={Logo} className="img_con" alt="dd" />
            </div>
            <div className="title_container" style={{ marginBottom: '-20px' }}>
              <span className="subtitle">
                Please enter the confirmation code sent to your registered email ID & new password
              </span>
            </div>

            {/* input fields */}
            <div className="input_container spaced">
              {/* Email field */}
              <div className="input_container">
                <label className="input_label" htmlFor="email_field">
                  Email
                </label>
                <OutlinedInput
                  placeholder="name@mail.com"
                  value={email}
                  type="text"
                  title='Enter Email'
                  className="input_field"
                  id="email_field"
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (e.target.value !== '') {
                      setEmailError(null);
                    }
                  }}
                />
                {emailError && (
                  <div className="error_message">
                    <InfoIcon style={{ fontSize: 15, marginRight: '5px', marginBottom: '3px' }} />
                    {emailError}</div>
                )}
              </div>

              {/* confirmation code field */}
              <div className="input_container">
                <label className="input_label" htmlFor="confirmation_code_field">
                  Confirmation Code
                </label>
                <OutlinedInput
                  value={code}
                  type="text"
                  title='Enter Confirmation Code'
                  className="input_field"
                  id="confirmation_code_field"
                  onChange={(e) => {
                    setCode(e.target.value)
                    if (e.target.value !== '') {
                      setCodeError(null);
                    }
                  }}
                />
                {codeError && (
                  <div className="error_message">
                    <InfoIcon style={{ fontSize: 15, marginRight: '5px', marginBottom: '3px' }} />
                    {codeError}</div>
                )}
              </div>

              {/* new password field */}
              <div className="input_container">
                <label className="input_label" htmlFor="new_password_field">
                  New Password
                </label>
                <Tooltip title="Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
                  placement="right"
                  arrow
                  open={open}
                  componentsProps={{
                    popper: { className: 'myTooltip' }
                  }}>
                  <div>
                    <OutlinedInput
                      title="Enter New Password"
                      value={newPassword}
                      type={showPassword ? "text" : "password"}
                      className="input_field_resetPassword"
                      id="new_password_field"
                      onFocus={() => setOpen(true)}
                      onBlur={() => setOpen(false)}
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
                      // onChange={handlePasswordChange}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        if (e.target.value !== '') {
                          setPasswordError(null);
                        }
                      }}
                    />
                  </div>
                </Tooltip>
                {passwordError && (
                  <div className="error_message">
                    <InfoIcon style={{ fontSize: 15, marginRight: '5px', marginBottom: '3px' }} />
                    {passwordError}</div>
                )}
              </div>
            </div>

            {/* change password button */}
            <div>
              <button
                type="submit"
                onClick={forgotPasswordSubmit}
                className='ChangePasswordbtn'
              >Change Password</button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;