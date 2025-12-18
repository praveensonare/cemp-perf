/* This is implementation of Device Controller for Energy Trading in the application.
  Author : Karbhari Gadekar
  Revision: 1.0 - 14-08-2024 
 
*/

import React from "react";
import ProjectSite_Layout from "../components/ProjectSite_Layout";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import { Button, colors, Tooltip } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid,GridFilterInputValue } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogBox from "../components/common/DialogBox";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../src/styles/Table.css";
import axios, { all } from "axios";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import CustomNoRowsOverlay from "../components/common/CustomNoRowsOverlay";
import "../styles/DeviceController.css";
import Loader from "../components/common/LoaderDatagrid";




axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;
const DeviceController = () => {
  const [validationMessage, setValidationMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectSites, setProjectSites] = useState([]);
  const [dashboardId, setDashboardId] = useState("");
  const [openDeleteBox, setOpenDeleteBox] = useState(false);

  // Add a state variable to track whether the form is in create or edit mode
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [groupNameError, setGroupNameError] = useState("");
  // Add a state variable to store the data being edited
  const [editingGroup, setEditingGroup] = useState(null);

  const [allData, setAllData] = useState([]);
  const [selectedProjectSite, setSelectedProjectSite] = useState([]);
  const [controllerDevicesData, setControllerDevicesData] = useState({});
  const [deviceId, setDeviceId] = useState("");
  const [kw, setKw] = useState([""]);
  const [cost, setCost] = useState([""]);
  const [powerMode, setPowerMode] = useState("");
  const [edgeDevices, setEdgeDevices] = useState([]);
  let controllerDevicesData1 = [];
  controllerDevicesData1.push(controllerDevicesData);

  const [commandId, setCommandId] = useState("");
  const [kwError, setKwError] = useState(false);
  const [costError, setCostError] = useState(false);
  const [deviceIdError, setDeviceIdError] = useState(false);
  const [projectSiteError, setProjectSiteError] = useState(false);
  const [powerModeError, setPowerModeError] = useState(false);
  const [validError, setValidError] = useState("");
  const [TransId, setTransId] = useState("");
  const [isDeviceIdLoading, setIsDeviceIdLoading] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState("");

  // state to toggle auto refresh
  const [isToggled, setIsToggled] = useState(false);
  const [toggleDisable, setToggleDisable] = useState(false);
  const label = { inputProps: { "aria-label": "Auto Refresh" } };
  let rowsPerPages=5;
  


  // Columns for the table
  const columns = [
    {
      field: "deviceId",
      headerName: "Device Id",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        let deviceId1 = params.row.deviceId;
        return (
          <div>
            <span>{deviceId1}</span>
          </div>
        );
      },
    },
    {
      field: "transId",
      headerName: "Trans Id",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row.transId}</span>
          </div>
        );
      },
    },
    {
      field: "commondId",
      headerName: "Command Id",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <span >{params.row.commandId}</span>
          </div>
        );
      },
    },

    {
      field: "kw",
      headerName: "Power (kw)",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row.kw}</span>
          </div>
        );
      },
    },
    {
      field: "cost",
      headerName: "Cost",
      width: 110,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row.cost}</span>
          </div>
        );
      },
    },
    {
      field: "powerMode",
      headerName: "Power Mode",
      width: 145,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const textColor= params.row.powerMode==='charge' ? 'red' : 'green'; 
        return (
          
          <div>
           
            <span style={{color:textColor}} >{params.row.powerMode}</span>
            
            
          </div>
        );
      },
    },
    {
      field: "controllerStatus",
      headerName: "Command Status",
      width: 240,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row.controllerStatus}</span>
          </div>
        );
      },
    },
    {
      field: "transactionStatus",
      headerName: "Transaction Status",
      width: 280,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <span>{params.row.transactionStatus}</span>
          </div>
        );
      },
    },
    {
      field: "createdTS",
      headerName: "Creation Time",
      width: 220,
      headerAlign: "center",
      align: "center",
      filterable: false, // Ensure the column is filterable
      renderCell: (params) => {
        const timestamp = Number(params.row.createdTS);
        const localDateTime = new Date(timestamp)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });
          
          
        return (
          <div>
            <span>{localDateTime}</span>
          </div>
        );
      },
    },

    {
      field: "transactionTS",
      headerName: "Transaction Time",
      width: 220,
      filterable: false, 
      headerAlign: "center",
      align: "center",
      
     

      renderCell: (params) => {
        const transactionTimets = Number(params.row.transactionTS);
        const transactionTimeLocal = new Date(transactionTimets)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
          ;
        return (
          <div>
            <span>{transactionTimeLocal}</span>
          </div>
        );
      },
    },

    {
      field: "Action",
      headerName: "Action",
      width: 100,
      headerAlign: "center",
      align: "center",
      filterable: false, // Ensure the column is not filterable
      renderCell: (params) => {
        return (
          <div>
            <Tooltip title="Delete" placement="top" arrow>
              <Button
                size="small"
                color="error"
                className="delete-button"
                onClick={() => handleOpenDelete(params.row.transactionId)}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  //function to get all details of controller device
  const getAllControllerDevices = async () => {
    try {
      let response = await axios.get("/sites/et/deviceControllers");
      setAllData(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setAllData([]);
        setLoading(false); // Stop the loader
      } else {
        Swal.fire("Error", error.response.data);
      }
    } finally {
           setTimeout(()=>{
            setIsLoading(false)  //stop loader
           },400)
    }
  };

  useEffect(() => {
    getAllControllerDevices();
  }, []);

  // function to refresh data automatically when Autorefresh button us Toggled
  useEffect(() => {
    if (isToggled) {
      const interverId = setInterval(() => {
        if (isToggled) {
          getAllControllerDevices();
        }
      }, 5000);

      return () => {
        clearInterval(interverId); // cleanup interval
      };
    }
  }, [isToggled]);

  // //Function to disable toggle button if there is no data
  useEffect(() => {
    if (allData.length === 0) {
      setToggleDisable(true);
      setIsToggled(false);
    } else {
      setToggleDisable(false);
    }
  }, [allData]);



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


  //Function to get edge devices of selected project site
  const getEdgeDevices = async (newValue) => {
    setIsDeviceIdLoading(true);
    try {
      let response = await axios.get(
        `/sites/gateway/edgeDevicsForProjectSite/${newValue}`
      );
      let IOTTopicNames = response.data.map((item) => item.IOTThingName);
      setEdgeDevices(IOTTopicNames);
      console.log("Edge Devices", IOTTopicNames);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          Swal.fire({
            text: JSON.stringify(error.response.data),
          });
          setEdgeDevices([]);
          setLoading(false); // Stop the loader
        } else if (error.response.status === 404) {
          Swal.fire({
            text: JSON.stringify(error.response.data),
          });
        } else {
          Swal.fire("Error", error.response.data);
        }
      } else if (error.request) {
        Swal.fire("Error", "Network Error");
      } else {
        Swal.fire("Error", "Something went wrong");
      }
    } finally {
    
        setIsLoading(false); // Stop the loader
     
      setIsDeviceIdLoading(false);
    }
  };

  const handleOpenDelete = (transactionId) => {
    setSelectedToDelete(transactionId);
    setOpenDeleteBox(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteBox(false);
  };

  console.log("All data" ,allData)


  //function to handle delete of controller device
  const handleDelete = async () => {
    try {
      let response = await axios.delete(
        `/sites/et/deviceController/${selectedToDelete}`
      );
      Swal.fire({
        icon: "success",
        title: "Deleted successfully",
        text: response.data,
      });
      handleCloseDelete();
      getAllControllerDevices();
    } catch (error) {
      Swal.fire("Error", error.response.data);
    }
  };

  // Effect hook to fetch project sites when the component mounts for the first time
  useEffect(() => {
    projectSitesApi();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Prepare the data to be sent
    if (
      projectSiteError ||
      deviceIdError ||
      kwError ||
      costError ||
      powerModeError ||
      !selectedProjectSite ||
      !deviceId ||
      !kw ||
      !cost ||
      !powerMode ||
      powerMode === "" ||
      TransId === ""
    ) {
      setValidError("Please fill all the fields");
    } else {
      const data = {
        projectSiteName: selectedProjectSite,
        commandId: commandId,
        deviceId: deviceId,
        kw: kw,
        cost: cost,
        powerMode: powerMode,
        transId: TransId,
      };

      // const isAvailable = allData.some(
      //   (item) =>
      //     item.deviceId === data.deviceId && item.powerMode === data.powerMode
      // );

      

      try {
        // Send a POST request to the server
        const response = await axios.post("/sites/et/deviceController", data);
        Swal.fire({
          icon: "success",
          title: "Created successfully",
          text: response.data,
        });
        getAllControllerDevices();
        handleClose();
        setDeviceId([]);
        setKw("");
        setCost("");
        setPowerMode([]);
        setTransId("");
        // Handle the response
      } catch (error) {
        if (error.response.status === 500) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: JSON.stringify(error.response.data),
          });
        } else if (error.response.status === 404) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: JSON.stringify(error.response.data),
          });
        } else {
          Swal.fire("Error", error.response.data);
        }
      }
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
    setTransId("");
    setOpen(false);
  };
  // Function to open the form
  const handleClickOpen = () => {
    if (viewMode || editMode) {
      setEditMode(false);
      setViewMode(false);
      setEditingGroup(null);

      setSelectedProjectSite([]);
     
    }
    setOpen(true);
    setCommandId("");
    setKw("");
    setCost("");
    setPowerMode("");
    setDeviceId([]);
    setKwError("");
    setCostError("");
    setProjectSiteError("");
    setDeviceIdError("");
    setPowerModeError("");
    setValidError("");
    setTransId("");
  };

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
  // Effect hook to stop showing the loader after a certain time
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000); // Adjust the time as needed
  //   return () => clearTimeout(timer);
  // }, []);

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
  //         he: "center",
  //         backgroundColor: "#fff",
  //         zIndex: 9999,
  //       }}
  //     >
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  return (
    <ProjectSite_Layout>
      <DialogBox
        open={openDeleteBox}
        onClose={handleCloseDelete}
        onDelete={handleDelete}
      />
      <>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            id="responsive-dialog-title"
            style={{ textAlign: "center" }}
          >
            {viewMode
              ? "View Dashboard Configuration"
              : editMode
              ? "Create Controller Device"
              : "Create Controller Device"}
          </DialogTitle>
          <DialogContent>
            <Box
              component="form"
              sx={{ width: "384px" }}
              noValidate
              autoComplete="off"
            >
              <div className="userdetail">
                <Stack
                  component="form"
                  sx={{ width: "100%" }}
                  spacing={2.3}
                  noValidate
                  autoComplete="off"
                >
                  <Autocomplete
                    id="projectSites"
                    varient="filled"
                    data-testid="projectSite-input"
                    name="projectSites"
                    options={projectSites}
                    getOptionLabel={(option) => option || ""}
                    onChange={(event, newValue) => {
                      if (!newValue) {
                        setProjectSiteError(true);
                      } else {
                        setProjectSiteError(false);
                      }
                      setSelectedProjectSite(newValue);
                      getEdgeDevices(newValue); // Make the API call
                    }}
                    disabled={editMode}
                    // onChange={getEdgeDevices(selectedProjectSite)}
                    value={selectedProjectSite}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project Sites"
                        varient="filled"
                        required
                        error={projectSiteError}
                        helperText={
                          projectSiteError
                            ? "Project Site must be selected"
                            : ""
                        }
                      />
                    )}
                  />

                  <Autocomplete
                    id="deviceId"
                    variant="filled"
                    data-testid="deviceId-input"
                    noOptionsText="No devices to add please select other project"
                    name="deviceId"
                    loading={isDeviceIdLoading}
                    options={edgeDevices}
                    getOptionLabel={(option) => option || ""}
                    onChange={(event, newValue) => {
                      if (!newValue) {
                        setDeviceIdError(true);
                      } else {
                        setDeviceIdError(false);
                      }
                      setDeviceId(newValue);
                    }}
                    // disabled={editMode}
                    value={deviceId}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Device Id"
                        variant="filled"
                        required
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {isDeviceIdLoading ? (
                                <CircularProgress
                                  color="primary"
                                  size={20}
                                  sx={{ marginBottom: "15px" }}
                                />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        error={deviceIdError}
                        helperText={
                          deviceIdError ? "Device Id must be selected" : ""
                        }
                      />
                    )}
                  />

                  <TextField
                    id="TransId"
                    label="Trans Id"
                    data-testid="transId-input"
                    variant="filled"
                    value={TransId}
                    onChange={(event) => setTransId(event.target.value)}
                    required
                  />

                  <TextField
                    id="commandId"
                    label="Command Id"
                    data-testid="command-input"
                    variant="filled"
                    value={commandId}
                    onChange={(event) => setCommandId(event.target.value)}
                    required
                  />

                  <TextField
                    id="KW"
                    label="KW"
                    variant="filled"
                    value={kw}
                    data-testid="kw-input"
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value.trim() === "" || !/^\d+$/.test(value)) {
                        setKwError(true);
                      } else {
                        setKwError(false);
                      }
                      setKw(value);
                    }}
                    required
                    error={kwError}
                    helperText={
                      kwError
                        ? "kw value must be non-empty and contain only digits"
                        : ""
                    }
                  />

                  <TextField
                    id="cost"
                    label="cost"
                    data-testid="cost-input"
                    variant="filled"
                    value={cost}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value.trim() === "" || !/^\d+$/.test(value)) {
                        setCostError(true);
                      } else {
                        setCostError(false);
                      }
                      setCost(value);
                    }}
                    required
                    error={costError}
                    helperText={
                      costError
                        ? "cost value must be non-empty and contain only digits"
                        : ""
                    }
                  />

                  <TextField
                    name="powerMode"
                    id="powerMode"
                    label="Power Mode"
                    data-testid="powerMode-input"
                    variant="filled"
                    value={powerMode}
                    onChange={(event) => {
                      const value = event.target.value;
                      const regex = /^[A-Za-z]+$/;
                      if (!regex.test(value)) {
                        setPowerModeError(true);
                      } else {
                        setPowerModeError(false);
                      }
                      setPowerMode(value);
                    }}
                    required
                    error={powerModeError}
                    helperText={
                      powerModeError
                        ? "Power Mode Must Not Contain Digits And Special Characters"
                        : ""
                    }
                  />

                  {validError ? (
                    <p
                      style={{
                        color: "red",
                        marginBottom: "-12px",
                        marginTop: "1px",
                      }}
                    >
                      {validError}
                    </p>
                  ) : (
                    ""
                  )}
                  <button
                    className="btn btn-primary btn-block"
                    onClick={handleSubmit}
                    disabled={viewMode} // Disable the button in view mode
                  >
                    Submit
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
            justifyContent: "centere",
          }}
         
        >
          <Card.Body >
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="myTypography"
            >
              Device Controller
            </Typography>
            <div className="parentContainer">
              <Stack
                direction="row"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "16px 16px 0px 0px",
                  boxShadow:
                    "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px",
                }}
                className="myStack my-0 mb-0 pt-2"
              >
                <div className="searchContainerDatagrid">
                  <OutlinedInput
                    className="dataGridSearch"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search device id..."
                    startAdornment={
                      <InputAdornment
                        className="dataGridSearchinput"
                        position="start"
                        style={{ marginRight: "-2px" }}
                      ></InputAdornment>
                    }
                  />
                  <i
                    className="fa fa-search searchIcon"
                    style={{
                      fontSize: "18px",
                      color: "#919eab",
                      paddingLeft: "5px",
                    }}
                  ></i>
                </div>

                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1 }}
                ></Typography>
                <Button
                  variant="contained"
                  onClick={handleClickOpen}
                  sx={{ textTransform: "none" }}
                  className="button_color"
                  startIcon={<AddCircleIcon />}
                >
                  Add Controller Device
                </Button>

                {!toggleDisable && (
                  <Button
                    variant="contained"
                    className="button_color"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "32px",
                      paddingLeft: "2px",
                      width: "140px,",
                      marginLeft: "20px",
                      textTransform: "none",
                    }}
                  >
                    <Switch
                      {...label}
                      onClick={() => {
                        if (isToggled === false) {
                          setIsToggled(true);
                        } else {
                          setIsToggled(false);
                        }
                      }}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#74e9c4',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 234, 0, 0.08)',
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#74e9c4',
                        },
                      }}
                    />
                    <span style={{ fontSize: "15px" }}>Auto Refresh</span>
                  </Button>
                )}
              </Stack>

              <Box height={10} />

              <div
                style={{
                  height: "380px",
                  width: "100%",
                  marginTop: "-9px",
                  position: "relative",
                }}
                // className="custom-scrollbar"
              >
                <DataGrid
                 hideFooterSelectedRowCount={true}
                 disableColumnSelector={true}
                  rows={
                    searchTerm.length <= 0
                      ? allData
                      : allData.filter(
                          (row) =>
                            row.deviceId
                              .toLowerCase()
                              .indexOf(searchTerm.toLowerCase()) > -1
                        )
                  }
                  components={{
                    NoRowsOverlay: isLoading ? () => false : CustomNoRowsOverlay,
                  }}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: rowsPerPages },
                      
                    },
                    sorting: {
                      sortModel: [{ field: 'transactionTS', sort: 'desc' }], // Sort by transactionTS in descending order
                    },
                  }}
                  getRowId={(row) =>row.transactionId}
                  pageSizeOptions={[5, 10, allData.length]}
                  className="data-grid"
    
                 
                  disabled={editMode}
                  role="grid"
                  rowHeight={50}
                  sx={{
                    overflow: "auto",
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
                    "& .MuiDataGrid-columnHeaderTitle": {
                      // marginLeft: "30px",
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

export default DeviceController;
