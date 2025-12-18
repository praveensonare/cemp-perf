/* This is implementation of landing page layout which is common for project sites, role manager and settings. it contains top navbar, sidebar and main body.
  Author : Shweta Vyas
  Revision: 1.0 - 17-07-2021 : UI Creation.
*/
import React from 'react'
import '../styles/LayoutStyles.css'
import { Link } from "react-router-dom";
import ProjectSite_Sidebar from './ProjectSite_Sidebar';
import Navbar from './Navbar';
import { Box } from '@mui/material'


const ProjectSite_Layout = ({ children }) => {
  return (
    <>
      <div className="main">
        <div className="layout">
          <ProjectSite_Sidebar />
          {/* CONTAINER */}
          <div className="content">
            {/* <Navigation/> */}
            <Navbar />
            <div className='body-content'>
              <Box height={80}/>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectSite_Layout
