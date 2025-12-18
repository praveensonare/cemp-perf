/* This is implementation of sensors under DEVICE HUB. where we have two tabs one for sensor type and other for sensor list.  
  Author : Shweta Vyas    
*/

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Layout from "../../components/Layout";
import SensorType from "./SensorType";
import SensorList from "./SensorList";
import Card from "react-bootstrap/Card";
import { useEffect } from "react";
//RBAC
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //RBAC
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userRole = useSelector((state) => state.userRole);
  const canClickSensorTab = permissions.includes("canClickOnSensorList");
  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  return (
    <Layout>
      <Card
        style={{
          width: "100%",
          border: "none",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}>
        <Card.Body>
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{ borderBottom: 0, borderColor: "divider", marginTop: "-10px", marginLeft: '5px' }}>

              {userRole === 'SuperAdmin' || canClickSensorTab ? (
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example">
                  <Tab
                    label="Sensor Type List"
                    {...a11yProps(0)}
                    sx={{
                      backgroundColor: value === 0 ? '#ddd' : '#fff', // Change color when tab is active
                      borderRadius: '5px',
                      marginRight: '8px',
                      fontWeight: value === 0 ? 'bold' : 'normal', // Make text bold when tab is active
                      color: value === 0 ? '#000' : '#777' // Change text color when tab is active
                    }}
                    />

                  <Tab
                    label="Sensors List"
                    {...a11yProps(1)}
                    sx={{
                      backgroundColor: value === 1 ? '#ddd' : '#fff', // Change color when tab is active
                      borderRadius: '5px',
                      marginRight: '8px',
                      fontWeight: value === 1 ? 'bold' : 'normal', // Make text bold when tab is active
                      color: value === 1 ? '#000' : '#777' // Change text color when tab is active
                    }}
                  />

                </Tabs>
              ) : (
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example">
                  <Tab label="Sensor Type List" {...a11yProps(0)} />
                  <Tooltip title={userRole !== 'SuperAdmin' && !canClickSensorTab ? "You do not have permission" : ""} arrow>
                    <span>
                      <Tab
                        label="Sensors List"
                        {...a11yProps(1)}
                        disabled
                      />
                    </span>
                  </Tooltip>
                </Tabs>

              )}

            </Box>
            <CustomTabPanel value={value} index={0}>
              <SensorType />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <SensorList />
            </CustomTabPanel>
          </Box>
        </Card.Body>
      </Card>
    </Layout>
  );
}
