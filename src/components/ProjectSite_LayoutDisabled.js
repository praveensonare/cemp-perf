import React from 'react'
import '../styles/LayoutStyles.css'
import { Link } from "react-router-dom";
import Navbar from './Navbar';
import { Box } from '@mui/material'
import ProjectSite_SidebarDisabled from './ProjectSite_SidebarDisabled';



const ProjectSite_LayoutDisabled = ({ children }) => {
    return (
        <>
          <div className="main">
            <div className="layout">
              <ProjectSite_SidebarDisabled />
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

export default ProjectSite_LayoutDisabled