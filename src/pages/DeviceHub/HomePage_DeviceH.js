/* DeviceHubHomePage Component

  * This page is responsible for displaying the home page of the device hub. 
  * It fetches and displays sensor types and sensor details.
  * It also provides a brief introduction to the device hub tool and its features.
  * 
  Author : Arpana Meshram
  Date : 31-08-2023
   Revision:
         1.0 - 31-08-2023  : Development of React.JS code for Device hub- Home page.
         2.0 - 03-10-2023  : UI Modification Development: Change the layout for Device Hub home page
         3.0 - 02-11-2023  : API integration for Get sensorType and Get sensor in Device hub-Sensor type.
         4.0 - 08-02-2024  : Add scrollbar in deviceHub Home page card design.
         5.0 - 15-03-2023  : comment added for each function and variable.
*/
import * as React from "react";
import Layout from "../../components/Layout";
import "../../styles/home.css";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../components/common/LoaderDatagrid";
import SensorsIcon from "@mui/icons-material/Sensors";
import Swal from "sweetalert2";
import axios from "axios";
import { useContext } from "react";
import { ProjectContext } from "../../ProjectContext";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";
import { Linking } from "@aws-amplify/core";
import { Spin } from "antd";
import CustomNoRowsOverlay from "../../components/common/CustomNoRowsOverlay";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

export default function DataTable() {
  const { projectSiteName } = useContext(ProjectContext);
  //data grid columns
  const columns = [
    {
      field: "SensorTypeName",
      headerName: "Sensor Type",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "parameters",
      headerName: "Parameters Count",
      align: "left",
      headerAlign: "left",
      flex: 1,
      filterable: false, // Ensure the column is not filterable
      renderCell: (params) => {
        const parameters = params.row.SensorTypeParameters.length;
        return <div>{parameters}</div>;
      },
    },
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(true);
  const [sensorList, setSensorList] = useState([]);
  const [SensorTypes, setSensorTypes] = useState([]);
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userRole = useSelector((state) => state.userRole);
  const ProjectForUserGroup = useSelector(
    (state) => state.userGroupsForProject
  );
  console.log("ProjectForUserGroup line 206", ProjectForUserGroup);

  const canClickOnGuidedTourInDeviceHubHomePage = permissions.includes(
    "canClickOnGuidedTourInDeviceHubHomePage"
  );
  useEffect(() => {
    getAllsensorTypes();
  }, []);

  useEffect(() => {
    getSensorListDetails();
  }, []);

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  const getAllsensorTypes = async () => {
    await axios
      .get(`/sites/sensor/type/sensorTypes`)
      .then((response) => {
        setSensorTypes(response.data);
        //map sensorType paramter list and get their count
        response.data.forEach((sensorType) => {
          console.log("data 13", sensorType.SensorTypeParameters);
          const parameterListCount = sensorType.SensorTypeParameters.length;
          console.log(parameterListCount);
        });

        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: JSON.stringify(error.response.data),
          });
          setSensorTypes([]);

          setIsLoading(false);
        } else {
          Swal.fire("Error", error.response.data);
        }
      });
  };
  //fetch the sensor
  const getSensorListDetails = async () => {
    try {
      const response = await axios.get(
        `/sites/sensor/sensorsForProjectSite/${projectSiteName}`
      );
      setSensorList(response.data);

      
      setIsLoading1(false);
      

      console.log("Sensor List:", response.data);
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setSensorList([]);
        setIsLoading(false);
      } else {
        Swal.fire("Error", error.response.data);
      }
    }
  };
 

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <box>
            <div className="cardbox p-4">
              <h4 className="borderBottom">Welcome to Device Hub</h4>
              <div className="cardHeight">
                <p>
                  Manage Assets and sensors under the defined project, create
                  entity relationship map and configure gateways to link
                  parameters with the existing sensors
                </p>
                <div className="List mt-1">
                  <ul>
                    <li><div>
                      <span className="listdesign"></span>Customs Assets and Sensors</div></li>
                    <li><div>
                      <span className="listdesign"></span>Custom Metadata and Parameters</div></li>
                    <li><div>
                      <span className="listdesign"></span>
                      IoT configuration and custom gateway channel creation</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="text-white">
                <Tooltip
                  title={
                    userRole !== "SuperAdmin" &&
                    !canClickOnGuidedTourInDeviceHubHomePage
                      ? "You do not have permission to access this page"
                      : ""
                  }
                  arrow
                >
                  <span>
                    <Button
                      variant="contained"
                      disabled={
                        userRole !== "SuperAdmin" &&
                        !canClickOnGuidedTourInDeviceHubHomePage
                      }
                      className="w-100"
                      size="sm"
                    >
                      <Link
                        to={`/guidedTour`}
                        className="text-white text-decoration-none"
                        underline="none"
                      >
                        Guided Tour
                      </Link>
                    </Button>
                  </span>
                </Tooltip>
              </div>
            </div>
          </box>
        </Grid>
        <Grid xs={12} sm={6}>
          <box>
            <div className="cardbox p-4">
              <h4 className="borderBottom">Entity Map: Phase 1</h4>
              <div className="cardHeight">
                <div className="px-5 mt-3">
                  <h6 className="entityHeading m-0">{projectSiteName}</h6>

                  <ul className="entityList">
                    <div className="Listdiv">
                     
                       {
                        isLoading1 ? (<div style={{position:"relative" ,top:"70px",right:"30px"}}><Loader /></div>) :  <>
                        {sensorList.map((sensorL) => (
                          <li key={sensorL.id}>
                            <SensorsIcon /> {sensorL.SensorName}
                          </li>
                        ))}
                      </>
                       }
                     
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </box>
        </Grid>
        <Grid xs={12} sm={12}>
          <box>
            <div className="cardbox-table p-4">
              <div
                style={{
                  height: "359px",
                  width: "100%",
                  marginTop: "-9px",
                  position: "relative",
                }}
              >
                <DataGrid
                  rows={SensorTypes}
                  columns={columns}
                  // loading={loading}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  components={{
                    NoRowsOverlay: isLoading
                      ? () => false
                      : CustomNoRowsOverlay,
                  }}
                  pageSizeOptions={[5, 10]}
                  getRowId={(row) =>row.SensorTypeLogicalName}
                  className="data-grid"
                  role="grid"
                  rowHeight={50}
                  hideFooterSelectedRowCount={true}
                  disableColumnSelector={true}
                  sx={{
                    width: "100%", // Set the width to a medium size
                    margin: "0 auto", // Center the DataGrid horizontally
                    border: "none", // Remove the border
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f4f6f8", // Change this to your desired header color
                      color: "#777", // Change this to your desired text color
                    },
                    "& .MuiDataGrid-root": {
                      borderColor: "#d3d3d3", // Change this to your desired border color
                    },
                    "& .MuiDataGrid-cell": {
                      borderColor: "#f4f6f8", // Change this to your desired cell border color
                    },
                    "& .MuiDataGrid-cell:focus": {
                      outline: "none", // Remove the outline when a cell is focused
                    },
                    "& .MuiDataGrid-cell--withRenderer:focus-within": {
                      outline: "none", // Remove the outline for cells with renderers
                    },
                    "& .MuiDataGrid-cell--editing": {
                      outline: "none", // Remove the outline for cells in editing mode
                    },
                    "& .MuiDataGrid-columnHeaders:focus": {
                      outline: "none", // Remove the outline when a cell is focused
                    },
                    "& .MuiDataGrid-columnHeader:focus-within": {
                      outline: "none", // Remove the outline when a column header is focused within
                    },
                    "& .MuiTablePagination-selectLabel": {
                      fontSize: "14px", // Change this to your desired font size
                      fontWeight: "400", // Change this to your desired font weight
                    },
                  }}
                />
                {isLoading && <Loader />}
              </div>
            </div>
          </box>
        </Grid>
      </Grid>
    </Layout>
  );
}
