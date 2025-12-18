/* This is implementation of gateways page where user can see the list of gateways and can add, delete and view the details of the gateways.
  Author : Shweta Vyas    
*/

import React from "react";
import Layout from "../../components/Layout";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Stack from "@mui/material/Stack";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProjectContext } from "../../ProjectContext";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CustomNoRowsOverlay from "../../components/common/CustomNoRowsOverlay";
import Loader from "../../components/common/LoaderDatagrid";
//css
import "../../styles/Gateways.css";
// stepper
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
// cards
import ModelForm from "../../components/common/ModelForm";
import DialogBox from "../../components/common/DialogBox";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const initialFormData = {
  GatewayName: "",
  channel: "MQTT",
  edgeDeviceChannel: "",
  IOTTopicName: "",
  projectSiteName: "",
  edgeDeviceName: "",
  edgeDeviceDescription: "",
};

export default function Gateways() {
  const { projectSiteName } = useContext(ProjectContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [gateways, setGateways] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [editData, setEditData] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [edgeDeviceNameError, setEdgeDeviceNameError] = useState("");
  const [edgeDeviceChannelError, setEdgeDeviceChannelError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const steps = [];

  const columns = [
    {
      field: "GatewayName",
      headerName: "Edge Device Name",
      flex: 2,
    
    },
    {
      field: "channel",
      headerName: "Channel",
      flex: 2,
    },
    { field: "IOTTopicName", headerName: "MQTT Topic", flex: 3 },
    {
      field: "Action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      filterable: false, // Ensure the column is not filterable
      flex: 2,
      renderCell: (params) => {
        const id = params.row.id;
        const gatewayName = params.row.GatewayName;
        return (
          <div>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickOnInfoEdgeDevice
                  ? "You do not have permission "
                  : "Info"
              }
              arrow>
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  data-testid="info-button"
                  key={id}
                  className="info-button"
                  style={{ marginRight: 4 }}
                  disabled={
                    userRole !== "SuperAdmin" && !canClickOnInfoEdgeDevice
                  }
                  onClick={() =>
                    navigate(
                      `/project-sites/${projectSiteName}/gateways/${gatewayName}/gateways-details`
                    )
                  }>
                  <InfoIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickOnDeleteEdgeDevice
                  ? "You do not have permission"
                  : "Delete"
              }
              arrow>
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => handleOpenDelete(params.row.GatewayName)}
                  disabled={
                    userRole !== "SuperAdmin" && !canClickOnDeleteEdgeDevice
                  }
                  key={id}
                  className="delete-button"
                  style={{ marginRight: 1 }}
                  data-testid="delete-button">
                  <DeleteIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickOnMappingUnderEdgeDevice
                  ? "You do not have permission"
                  : "Mapping"
              }
              arrow>
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  style={{ marginLeft: 5 }}
                  disabled={
                    userRole !== "SuperAdmin" &&
                    !canClickOnMappingUnderEdgeDevice
                  }
                  onClick={() =>
                    navigate(
                      `/project-sites/${projectSiteName}/gateways/${gatewayName}/parameter-mapping`
                    )
                  }
                  key={id}
                  className="edit-button">
                  <AddCircleIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userRole = useSelector((state) => state.userRole);
  // console.log("userrole redux", userRole);
  const canClickOnInfoEdgeDevice = permissions.includes(
    "canClickOnInfoEdgeDevice"
  );
  const canClickOnDeleteEdgeDevice = permissions.includes(
    "canClickOnDeleteEdgeDevice"
  );
  const canClickOnMappingUnderEdgeDevice = permissions.includes(
    "canClickOnMappingInEdgeDevice"
  );
  const canClickOnAddEdgeDevice = permissions.includes(
    "canClickOnAddEdgeDevice"
  );

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  // get edge device for project site
  const getEdgeDeviceforProjectSite = async () => {
    try {
      const response = await axios.get(
        `/sites/gateway/edgeDevicsForProjectSite/${projectSiteName}`
      );
      const gatewaysData = response.data.map((gateway) => ({
        ...gateway,
        channel: "MQTT", // Add the channel property with the value "MQTT"
      }));
      console.log("Edge devices for project site", gatewaysData);
      setGateways(gatewaysData);
      setTimeout(() => {
        setIsLoading(false);
      }, 400); // 400ms delay
    } catch (error) {
      setIsLoading(false);
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setGateways([]);
      
      } else {
        Swal.fire("Error", error.response.data);
      }
    }
  };

  useEffect(() => {
    getEdgeDeviceforProjectSite();
  }, []);

  // take data from the form and post it to the list
  const handleSubmit = () => {
    if (!formData.edgeDeviceName || !formData.edgeDeviceName.trim()) {
      setEdgeDeviceNameError("Edge Device Name cannot be empty");
      return; // Stop the function if there's an error
    }

    if (!formData.edgeDeviceChannel) {
      setEdgeDeviceChannelError("Edge Device Channel cannot be empty");
      return; // Stop the function if there's an error
    }

    if (
      !formData.edgeDeviceDescription ||
      !formData.edgeDeviceDescription.trim()
    ) {
      setDescriptionError("Description cannot be empty");
      return; // Stop the function if there's an error
    }
    const formDataWithBase64 = {
      projectSiteName: projectSiteName,
      channel: "MQTT",
      edgeDeviceName: formData.edgeDeviceName,
      edgeDeviceDescription: formData.edgeDeviceDescription,
    };
    axios
      .post(`/sites/gateway/edgeDevice`, formDataWithBase64)
      .then((response) => {
        console.log("response from post edge device:", response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Edge Device added successfully", //hardcoded because no response message coming from the api
        });
        setFormData(initialFormData);
        setActiveStep(0);
        getEdgeDeviceforProjectSite();
        setOpen(false);
      })
      .catch((error) => {
        setOpen(false);
        console.log(error.response);
        Swal.fire("Error", error.response.data);
      });
  };

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


  //Stepper functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValidationMessage("");
    setEdgeDeviceNameError("");
    setEdgeDeviceChannelError("");
    setDescriptionError("");
    setFormData(initialFormData);
  };
  // stepper logic
  const handleChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;
    if (name === "edgeDeviceName") {
      // Capitalize the value and replace spaces with underscores
      formattedValue = value.toUpperCase().replace(/\s+/g, "_");
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: formattedValue,
    }));
  };

  //check for duplicacy
  const handleBlur = async (event) => {
    const { name, value } = event.target;
    if (name === "edgeDeviceName") {
      // Capitalize the value and replace spaces with underscores
      let formattedValue = value.toUpperCase().replace(/\s+/g, "_");
      try {
        const response = await axios.get(
          `/sites/gateway/isEdgeDeviceExist/${formattedValue}`
        );
        console.log(response); // Log the entire response object
        if (response.data && response.data === "True") {
          setValidationMessage("This Edge Device name already exists");
        } else {
          setValidationMessage("");
        }
      } catch (error) {
        console.error("Error checking duplicacy:", error);
      }
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="userdetail">
            <h3 className="Project_Heading">Add Edge Device</h3>
            <Stack
              component="form"
              sx={{ width: "100%" }}
              spacing={2.3}
              noValidate
              autoComplete="off">
              <TextField
                id="filled-basic"
                label="Edge Device Name*"
                name="edgeDeviceName"
                value={formData.edgeDeviceName}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="filled"
                className=""
                InputProps={{
                  disableUnderline: true,
                  disabled: editData !== null,
                }}
              />
              {validationMessage && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}>
                  {validationMessage}
                </div>
              )}
              {edgeDeviceNameError && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}>
                  {edgeDeviceNameError}
                </div>
              )}

              <FormControl variant="filled">
                <InputLabel id="state-label" style={{ paddingBottom: "20px" }}>
                  Edge Device Channel*
                </InputLabel>
                <Select
                  labelId="state-label"
                  id="state-select"
                  name="edgeDeviceChannel"
                  value={formData.edgeDeviceChannel}
                  onChange={handleChange}
                  InputProps={{ disableUnderline: true }}>
                  <MenuItem value="MQTT">MQTT</MenuItem>
                </Select>
              </FormControl>
              {edgeDeviceChannelError && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}>
                  {edgeDeviceChannelError}
                </div>
              )}
              <TextField
                id="filled-multiline-static"
                label="Description"
                required
                name="edgeDeviceDescription"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                variant="filled"
                InputProps={{ disableUnderline: true }}
              />
              {descriptionError && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}>
                  {descriptionError}
                </div>
              )}
            </Stack>
          </div>
        );
    }
  };

  const handleOpenDelete = (GatewayName) => {
    setSelectedGateway(GatewayName);
    setOpen5(true);
  };

  const handleCloseDelete = () => {
    setOpen5(false);
  };

  // Delete gateway
  const handleDelete = async () => {
    try {
      await axios
        .delete(`/sites/gateway/edgeDevice/${selectedGateway}`)
        .then((response) => {
          switch (response.status) {
            case 200:
              Swal.fire(`Deprovisioned ${selectedGateway}`);
              break;
            case 404:
              Swal.fire(`Gateway: ${selectedGateway} doesn't exist`);
              break;
            default:
              Swal.fire("There is an error in getting information from server");
              break;
          }
          // getEdgeDeviceforProjectSite();
          setOpen5(false);
        })
        .then(() => {
          // Call getEdgeDeviceforProjectSite() after the delete operation has completed
          getEdgeDeviceforProjectSite();
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            if (error.response.data.message.includes("Unable to Deprovision")) {
              Swal.fire(`Unable to Deprovision ${selectedGateway}`);
            } else {
              Swal.fire("There is an error in getting information from server");
            }
          } else {
            console.error("Error deleting gateway:", error);
            console.log(error.response);
          }
        });
    } catch (error) {
      console.error("Error deleting gateway:", error);
      console.log(error.response);
    }
  };

  


  return (
    <>
      {/* Delete dialog popup*/}
      <DialogBox
        data-testid="dialog-box"
        open={open5}
        onClose={handleCloseDelete}
        onDelete={handleDelete}
        itemToDelete={selectedGateway}
      />
      <ModelForm open={open} onClose={handleClose} onSubmit={handleSubmit}>
        {activeStep === steps.length ? (
          <div>
            {/* Form content for the final step */}
            {getStepContent(activeStep)}
            <div className="btns">
              <Button variant="contained" onClick={handleClose} id="backBtn">
                Close
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                id="nextBtn"
                // style={{ marginTop: '20px' }}
              >
                Submit
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        )}
      </ModelForm>

      <Layout>
       
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
                sx={{ paddingLeft: "20px" }}>
                Edge Devices
              </Typography>

              <div className="parentContainer">
                {/* stack for search box and button */}
                <Stack
                  direction="row"
                  className="myStack my-0 mb-0 pt-1"
                  data-testid="stack">
                  {/* search box */}

                  <div className="searchContainerDatagrid">
                    <OutlinedInput
                      className="dataGridSearch uniqueClass"
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search edge device..."
                      // inputProps={{ style: { fontSize: '15px' }}}
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

                  {/* button */}
                  <Tooltip
                    title={
                      userRole !== "SuperAdmin" && !canClickOnAddEdgeDevice
                        ? "You do not have permission"
                        : ""
                    }
                    arrow>
                    <span>
                      <Button
                        variant="contained"
                        onClick={handleClickOpen}
                        // className="button_color"
                        className={
                          userRole !== "SuperAdmin" && !canClickOnAddEdgeDevice
                            ? ""
                            : "button_color"
                        }
                        disabled={
                          userRole !== "SuperAdmin" && !canClickOnAddEdgeDevice
                        }
                        startIcon={<AddCircleIcon />}
                        data-testid="add-edge-device-button">
                        Add Edge Device
                      </Button>
                    </span>
                  </Tooltip>
                </Stack>

                {/* data grid */}
                <div
                  style={{
                    height: "359px",
                    width: "100%",
                    marginTop: "-9px",
                    position:"relative"
                  }}
                  // className='p-2'
                >
                  <DataGrid
                     rows={
                      searchTerm.length === 0
                        ? gateways
                        : gateways.filter((gateways) =>
                        gateways.GatewayName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                    }
                    
                    columns={columns}
                    disableColumnSelector={true}
                    data-testid="gateways-table"
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    components={{
                      NoRowsOverlay: isLoading ? () => false : CustomNoRowsOverlay,
                    }}
                    getRowId={(row) =>row.IOTThingName}
                    pageSizeOptions={[5, 10]}
                    className="data-grid"
                    // checkboxSelection
                    rowHeight={50}
                    hideFooterSelectedRowCount={true}
                   
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
            </Card.Body>
          </Card>
      
      </Layout>
    </>
  );
}
