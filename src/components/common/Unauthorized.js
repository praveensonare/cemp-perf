/* This is implementation of Protected Routes which should only be accessible for the authenticated users that exist in cognito pool.
  Author : Shweta Vyas    
*/

import React from 'react'
import { Typography, Button } from '@mui/material';

export default function Unauthorized() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
      <img src="https://cdn.dribbble.com/users/761395/screenshots/6287961/error_401.jpg?resize=800x600&vertical=center" alt="Not Found" style={{ width: '50%', height: 'auto' }} />
      <Button variant="contained" color="primary" href="/project-sites" style={{marginTop:'10px'}}>Go to Home Page</Button>
    </div> 
  )
}
