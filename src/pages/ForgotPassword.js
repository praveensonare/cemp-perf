/* This is implementation of forgot password page where user can enter the email address and get the confirmation code to reset the password.
  Author : Shweta Vyas      
*/

import React, { useState } from "react";
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from "react-router-dom";
import OutlinedInput from '@mui/material/OutlinedInput';
import Logo from '../assets/brand/Logo.webp'
import logo from '../assets/brand/Logo.webp'
import infosys from '../assets/images/infosys.png'
import InfoIcon from '@mui/icons-material/Info';
import TextField from '@mui/material/TextField';
import Container from "react-bootstrap/esm/Container";
import { Form, message, Button, Input } from "antd";
import { Auth } from "aws-amplify";
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: window.REACT_APP_REGION,
    userPoolId: window.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: window.REACT_APP_USER_POOL_APP_CLIENT_ID,
  }
})

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState('');

  //send confirmation code to user's email
  let handleSubmit = async function (event) {
    event.preventDefault();

    // Check if the email field is empty
    if (!email || email.trim() === '') {
      setEmailError("Please Enter an Email");
      return;
    }

    // Validate email format
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please Enter a Valid Email Address");
      return;
    }

    try {
      let response = await Auth.forgotPassword(email.trim())
      console.log('auth response', response)
      message.success("Confirmation code sent to your email")
      navigate('/resetPassword')
    } catch (err) {
      console.log(err);
      if (err.code === 'LimitExceededException') {
        message.error('Attempt limit exceeded, please try after some time.');
      }
      else if (err.code === 'UserNotFoundException') {
        message.error('User not found');
      }
    }

  };


  return (
    <div className="bg-image" data-testid="forgot-password-component">
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
        <Form className="form_container" >
          <div className="logo_containers" style={{ marginBottom: '130px' }}>
            <img src={Logo} className="img_con" alt="dd" />
          </div>
          <div className="title_container" style={{ marginTop: '-110px' }}>
            <p className="title">Forgot Your Password?</p>
            <span className="subtitle">
              Please enter the email address linked to your account
            </span>
          </div>
          <div className="input_container_forgotPassword">
            <div >
              <div className="input_container">
                <label className="input_label" htmlFor="email_field" style={{ paddingLeft: '5px' }}>
                  Email
                </label>
                <Input
                  placeholder="name@mail.com"
                  value={email}
                  name="input-name"
                  type="text"
                  className="forgot_password_input"
                  id="email_field"
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (e.target.value !== '') {
                      setEmailError(null);
                    }
                  }}
                />

              </div>
              {/* Error message */}
              {emailError && <div className="error" style={{ color: 'rgb(222 39 39)', fontSize: '15px', padding: '6px' }}><InfoIcon style={{ fontSize: 15, marginRight: '5px', marginBottom: '3px' }} />{emailError}</div>}
            </div>
            <span className="subtitle" style={{ marginTop: '10px' }}>
              Remember Your Password ?
              <Link
                to='/'
                style={{ fontSize: '18px', padding: '8px' }}
                className="login-link"> Login Here
              </Link>
            </span>
            <div className="sendCodeBtn">
              <button title="Sign In" type="submit" className="sign-in_btn" onClick={handleSubmit}>
                <span>Send Code</span>
              </button>
            </div>
          </div>
        </Form>

      </div>

    </div>
  );
};

export default ForgotPassword;
