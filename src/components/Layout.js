import React from 'react'
import '../styles/LayoutStyles.css'
import { Link } from "react-router-dom";
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Box } from '@mui/material'
import BreadCrumbs from './BreadCrumbs';

const Layout = ({ children }) => {
  return (
    <>
      <div className="main">
        <div className="layout">
          <Sidebar />
          {/* CONTAINER */}
          <div className="content">
            {/* <Navigation/> */}
            <Navbar />
            <div className='body-content' >
              <Box height={80}/>
              <BreadCrumbs/>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout
