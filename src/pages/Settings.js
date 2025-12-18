/* This is implementation of Login flow in the application.
  Author : Tinku Gupta
  Revision: 1.0 - 13-03-2021 : Comment and 404 handle on data grid .
  Revision: 2.0 - 13-03-2021 : integrate dashboard id in the dropdown and submit the data.
*/
/*
  Author : Karbhari Gadekar
  Revision: 2.0 - 13-08-2024 : Modified DataGrid UI.
*/

import React from "react";
import ProjectSite_Layout from "../components/ProjectSite_Layout";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import { styled, Button } from "@mui/material";
import Loader from "../components/common/LoaderDatagrid"
import Tooltip from "@mui/material/Tooltip";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../src/styles/Table.css";
import { FormGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";

import CustomNoRowsOverlay from "../components/common/CustomNoRowsOverlay";
import Swal from "sweetalert2";
import WarningIcon from "@mui/icons-material/Warning";
import { DialogContentText, DialogActions } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Spin } from "antd";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const Setting = () => {
  const [existingGroupNames, setExistingGroupNames] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [open5, setOpen5] = React.useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectSites, setProjectSites] = useState([]);
  const [selectedProjectSite, setSelectedProjectSite] = useState([]);
  const [selectedProjectSites, setSelectedProjectSites] = useState([]);
  const [dashboardId, setDashboardId] = useState("");
  // Add a state variable to track whether the form is in create or edit mode
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [creatingMode, setCreatingMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [groupNameError, setGroupNameError] = useState("");
  // Add a state variable to store the data being edited
  const [editingGroup, setEditingGroup] = useState(null);
  const [dashboardIds, setDashboardIds] = useState([]);
  // Columns for the table
  const columns = [
    {
      field: "projectSiteName",
      headerName: "Project Site Name",
      flex: 1.1,
      headerClassName: "header-project-name",
      renderCell: (params) => {
        return (
          <div
            style={{
            
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontSize: "0.875rem",
              fontWeight: "600",
              fontSize: "0.875rem",
              fontWeight: "600",
            }}>
            <div
              className="user_group_svg"
              style={{
                marginRight: "9px",
                backgroundColor: "#CECECE",
                height: "37px",
                width: "37px",
                textAlign: "center",
                borderRadius: "50%",
              }}>
              <div className="datagridIcon_img">
                <img src="./location.png" height={32}    />
              </div>
            </div>
            <div>{params.row.projectSiteName}</div>
          </div>
        );
      },
    },

    {
      field: "dashboardIds",
      headerName: "Dashboard ID",
      flex: 1.5,
    },
    {
      field: "Action",
      headerName: "Action",
      flex: .5,
      headerAlign: "center",
      align:"center",
      filterable: false, // Ensure the column is not filterable
      renderCell: (params) => {
        let projectSiteName1 = params.row.projectSiteName;
        return (
          <div>
            <Tooltip title="Info">
              <Button
                variant="outlined"
                size="small"
                color="success"
                onClick={() => handleEdit(params.row.projectSiteName, false)}
                key={params.row.projectSiteName}
                style={{ marginRight: 5 }}
                data-testid="edit-button"
                className="edit-button">
                <EditIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => handleOpenDelete(params.row.projectSiteName)}
                key={params.row.projectSiteName}
                className="delete-button"
                data-testid="delete-button">
                <DeleteIcon fontSize="small" />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  // Function to fetch dashboard data from the server
  const getDashboardData = async () => {
    try {
      let response = await axios.get("/sites/qs/dashboards");
      console.log("line 187", response.data);
      setUsers(response.data.reverse());
      setDashboardId(false);
      
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setUsers([]);
        setLoading(false); // Stop the loader
      } else {
        Swal.fire("Error", error.response.data);
      }
    } finally {
      setTimeout(()=>{
        setIsLoading(false); // Stop showing the loader
      },600)
      
    }
  };

  // fetching the dashboard id from the server
  const getDashboardId = async () => {
    try {
      const response = await axios.get("/sites/qs/dashboardList");
      console.log("line 169", response.data);
      const ids = response.data;
      setDashboardIds(ids);
      setTimeout(() => {
        setIsLoading(false);
      }, 400); // 400ms delay
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setUsers([]);
        setLoading(false); // Stop the loader
      } else {
        Swal.fire("Error", error.response.data);
      }
    } finally {
      setIsLoading(false);
       //Stop showing the loader
    }
  };

  useEffect(() => {
    getDashboardId();
  }, []);
  // Function to fetch project sites from the server
  const projectSitesApi = async () => {
    try {
      let response = await axios.get("/sites/project/projectSitesList");
      setProjectSites(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false); // Stop the loader
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
      } else {
        Swal.fire("Error", error.response.data);
      }
    }
  };
  // Array of project sites that are not yet assigned to users
  const availableProjectSites = projectSites.filter(
    (projectSite) => !users.some((user) => user.projectSiteName === projectSite)
  );
  // Function to open the delete confirmation dialog box
  const handleOpenDelete = (projectSites) => {
    setSelectedProject(projectSites);
    setOpen5(true);
  };
  // Function to close the delete confirmation dialog box
  const handleCloseDelete = () => {
    setOpen5(false);
  };
  // Effect hook to fetch dashboard data when the component mounts
  useEffect(() => {
    getDashboardData();
  }, []);
  // Effect hook to fetch project sites when the component mounts
  useEffect(() => {
    projectSitesApi();
  }, []);

  // Function to handle changes in the group name field
  // const handleGroupNameChange = (e) => {
  //   const groupNameValue = e.target.value;
  //   setGroupName(groupNameValue);

  //   // Clear the error message when the user starts typing
  //   if (groupNameValue !== "") {
  //     setGroupNameError("");
  //   }

  //   if (existingGroupNames.includes(groupNameValue)) {
  //     setValidationMessage(
  //       "Group name already exists, please choose a different name"
  //     );
  //   } else {
  //     setValidationMessage("");
  //   }
  // };

  // Function to delete a project site
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios
        .delete(`/sites/qs/dashboardForProjectSite/${selectedProject}`)
        .then((response) => {
          // Swal.fire("success", response.data);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: response.data,
          });
          getDashboardData();
          setOpen5(false);
        })
        .catch((error) => {
          if (error) {
            Swal.fire("Error", error.response.data);
          } else {
            console.error("Error deleting gateway:", error);
          }
        });
    } catch (error) {
      console.error("Error", error);
      Swal.fire("Error", error.response.data);
    } finally {
      setLoading(false);
    }
  };
  // Function to handle editing a project site
  const handleEdit = async (projectSiteName, viewMode) => {
    const groupToEdit = users.find(
      (user) => user.projectSiteName === projectSiteName
    );
    if (groupToEdit) {
      setEditMode(!viewMode);
      setViewMode(viewMode);
      setCreatingMode(false);
      setEditingGroup(groupToEdit);
      setSelectedProjectSite(groupToEdit.projectSiteName);
      setDashboardId(groupToEdit.dashboardIds[0]);
    }
    handleClickOpen();
  };
  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Extract the id from the dashboardId
    const id = dashboardId.split(",")[1];

    // Prepare the data to be sent
    const data = {
      projectSiteName: selectedProjectSite,
      dashboardIds: [id],
    };

    try {
      // Send a POST request to the server
      const response = await axios.post("/sites/qs/dashboard", data);
      Swal.fire({
        icon: "success",
        title: "Created successfully",
        text: response.data,
      });
      getDashboardData();
      setSelectedProjectSites("");
      setDashboardId("");
      handleClose();

      // Handle the response
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  // Function to close the form
  const handleClose = () => {
    // Reset the viewMode and editMode states
    setDashboardId("");
    setSelectedProjectSite(null);
    setGroupNameError("");
    setEditMode(false);
    setValidationMessage("");
    setOpen(false);
  };
  // Function to open the form
  const handleClickOpen = () => {
    if (viewMode || editMode) {
      setEditMode(false);
      setViewMode(false);
      setEditingGroup(null);
      setGroupName("");
      setSelectedProjectSite([]);
      setCreatingMode(true);
    }
    setOpen(true);
  };
  // Function to reset the form fields
  // const handleReset = () => {
  //   // Reset the form fields
  //   setGroupName("");
  //   setGroupNameError("");
  //   setSelectedProjectSites([]);
  // };

  // Function to handle changes in the project site field
  // const handleProjectSiteChange = (event, newValue) => {
  //   setSelectedProjectSites(newValue);
  // };
  // // Function to handle changes in the dashboard ID field
  // const handleDashboardIdChange = (event) => {
  //   setDashboardId(event.target.value);
  // };
  // Function to generate a random string
  function generateRandom() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  

  // if (isLoading) {
  //   return (
  //     <div
  //       style={{
  //         position: "fixed",
  //         top: 0,
  //         left: 0,
  //         width: "100vw",
  //         height: "100vh",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: "#fff",
  //         zIndex: 9999,
  //       }}>
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  return (
    <ProjectSite_Layout data-testid="Projectlayout">
      <>
        <Dialog open={open5} onClose={handleCloseDelete}>
          <DialogTitle>Delete {selectedProject}</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ maxWidth: "280px" }}>
              <WarningIcon style={{ marginRight: "10px" }} />
              Warning message: Are you sure you want to delete ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDelete}
              style={{ color: "black" }}
              id="backBtn">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              style={{ backgroundColor: "red", color: "white" }}
              autoFocus
              id="nextBtn"
              disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Delete"}
              {/* Delete */}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          data-testid="Dialog">
          <DialogTitle
            id="responsive-dialog-title"
            style={{ textAlign: "center" }}
            data-testid="DialogTitle">
            {viewMode
              ? "View Dashboard Configuration"
              : editMode
              ? "Update Dashboard Configuration"
              : "Create Dashboard Configuration"}
          </DialogTitle>
          <DialogContent data-testid="dailogcontent">
            <Box
              component="form"
              sx={{ width: "384px" }}
              noValidate
              autoComplete="off"
              // onSubmit={e => onSubmit(e)}
              data-testid="box">
              <div className="userdetail">
                <Stack
                  component="form"
                  sx={{ width: "100%" }}
                  spacing={2.3}
                  noValidate
                  autoComplete="off"
                  data-testid="stackDivModel">
                  <Autocomplete
                    id="project-sites"
                    variant="filled"
                    name="Projectsite"
                    options={availableProjectSites}
                    getOptionLabel={(option) => option || ""}
                    onChange={(event, newValue) => {
                      setSelectedProjectSite(newValue);
                    }}
                    disabled={editMode}
                    data-testid="projectSitesDropdown"
                    value={selectedProjectSite}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project Sites"
                        varient="filled"
                        required
                      />
                    )}
                  />

                  <Autocomplete
                    id="dashboard-ids"
                    variant="filled"
                    options={dashboardIds}
                    getOptionLabel={(option) => option || ""}
                    onChange={(event, newValue) => {
                      setDashboardId(newValue);
                    }}
                    // disabled={editMode}
                    value={dashboardId}
                    data-testid="dashboardIdDropdown"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Dashboard Id"
                        variant="filled"
                        required
                      />
                    )}
                  />

                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleSubmit}
                    data-testid="submitButton"
                    disabled={viewMode} // Disable the button in view mode
                  >
                    {viewMode ? "close" : editMode ? "Submit" : "Submit"}
                  </button>
                </Stack>
              </div>
            </Box>
          </DialogContent>
        </Dialog>
        {/* Loader  */}
        <Card
          style={{
            width: "100%",
            border: "none",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
          }}
          data-testid="card">
          <Card.Body data-testid="cardBody">
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="myTypography"
              sx={{ paddingLeft: "8px" }}
              data-testid="Typography">
              Dashboard Configuration
            </Typography>

            <div className="parentContainer">
              {/* stack for serach and add button */}
              <Stack
                direction="row"
                className="myStack my-0 mb-0 pt-1"
                data-testid="stack">
                {/* search box  */}
                <div className="searchContainerDatagrid">
                  <OutlinedInput
                    className="dataGridSearch"
                    // value={searchTerm} // Assuming searchTerm is your state variable
                    onChange={(event) => setSearchTerm(event.target.value)}
                    // onChange={(e) => filterData(e.target.value)}
                    placeholder="search project site..."
                    data-testid="searchproject"
                    startAdornment={
                      <InputAdornment
                        className="dataGridSearchinput"
                        position="start"
                        style={{ marginRight: "-2px" }}></InputAdornment>
                    }
                  />
                  <i
                    className="fa fa-search searchIcon"
                    style={{
                      fontSize: "small",
                      color: "#919eab",
                      paddingLeft: "5px",
                    }}></i>
                </div>

                {/* Button to add a new configuration */}
                <Button
                  variant="contained"
                  onClick={handleClickOpen}
                  className="button_color"
                  startIcon={<AddCircleIcon />}
                  data-testid="button">
                  Add Configuration
                </Button>
              </Stack>

              {/* Data grid */}  
                <div
                  style={{
                    height: "359px",
                    width: "100%",
                    marginTop: "-9px",
                    position: "relative"
                  }}
                  data-testid="datagridDiv">
                  <DataGrid
                    hideFooterSelectedRowCount={true}
                    disableColumnSelector={true}
                    components={{
                      NoRowsOverlay: isLoading ? () => false : CustomNoRowsOverlay,
                    }}
                    rows={
                      searchTerm.length === 0
                        ? users
                        : users.filter((user) =>
                            user.projectSiteName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                    }
                    columns={columns}
                    //loading={loading}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    getRowId={(row) =>row.dashboardIds}
                    pageSizeOptions={[5, 10]}
                    className="data-grid"
                    disabled={editMode}
                    data-testid="grid"
                    role="grid"
                    rowHeight={50}
                    sx={{
                      padding: "0px 15px 0px 15px",
                      width: "100%", // Set the width to a medium size
                      margin: "0 auto", // Center the DataGrid horizontally
                      border: "none", // Remove the border
                      marginBottom: "16px", // Add some space at the bottom
                      borderRadius: "0px 0px 16px 16px", // Optional: Add rounded corners
                      boxShadow:
                        "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px", // Add box shadow
                      backgroundColor: "#fff", // Change this to your desired background color
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
                    "& .header-project-name .MuiDataGrid-columnHeaderTitle": {
                      marginLeft: "25px", // Add desired margin-left for Project Name header label
                    },
                    "& .MuiDataGrid-cell--editing": {
                      outline: "none", // Remove the outline for cells in editing mode
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
          </Card.Body>
        </Card>
      </>
    </ProjectSite_Layout>
  );
};

export default Setting;
