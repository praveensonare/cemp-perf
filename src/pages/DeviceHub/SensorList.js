/* This is implementation of sensors list page. It is used to display the list of sensors for a particular project site. It also provides the functionality to add, view and delete sensors. 
  Author : Shweta Vyas   
  Revision:
  Date:3/20/2024
  Author: Shweta Vyas
  Changes: Integrated new Api which fetches the list of all sensor type names for the dropdown. 

  Revision: Shweta vyas
  Date: 04/12/2024
  Changes: UI modification in stepper form buttons
*/

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Grid from "@mui/material/Grid";
import DialogBox from "../../components/common/DialogBox";
import { useContext } from "react";
import { ProjectContext } from "../../ProjectContext";
import { Spin } from "antd";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { FormControl } from "@mui/material";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import ModelForm from "../../components/common/ModelForm";
import "../../styles/Project.css";
import "../../styles/Stepper.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CustomNoRowsOverlay from "../../components/common/CustomNoRowsOverlay";
import Loader from "../../components/common/LoaderDatagrid";
//RBAC
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";
axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const initialFormData = {
  SensorName: "",
  SensorTypeName: "",
  projectSiteName: "",
  SensorDescription: "",
};

export default function DataTable() {
  //fetch the project site name from the context
  const { projectSiteName } = useContext(ProjectContext);
  const [isInfoClicked, setIsInfoClicked] = useState(false);
  const steps = ["Details"];
  const [warning, setWarning] = useState(null);
  const [error, setError] = useState(null);
  const [open5, setOpen5] = React.useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensorTypeParameters, setSensorTypeParameters] = useState([]);
  const [sensorList, setSensorList] = useState([]);
  const [sensorListLogical, setSensorListLogical] = useState([]);
  //get project name
  const [params, setParams] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [opendelete, setOpenDelete] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  //tab design stepper code
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [sensorTypeNameError, setSensorTypeNameError] = useState(null);
  const [sensorNameError, setSensorNameError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  //Data grid columns
  const columns = [
    {
      field: "SensorName",
      headerName: "Sensors",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "SensorTypeName",
      headerName: "Sensor Type Name",
      align: "left",
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "Action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      flex: 1.1,
      filterable: false, // Ensure the column is not filterable
      renderCell: (params) => {
        const id = params.row.id;
        const sensorTypeName = params.row.SensorTypeName;
        return (
          <div>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickInfoButton
                  ? "You do not have permission"
                  : "Info"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    getSensorType(sensorTypeName);
                    handleInfoClick(params.row);
                  }}
                  disabled={userRole !== "SuperAdmin" && !canClickInfoButton}
                  key={id}
                  className="info-button"
                  style={{ marginRight: 5 }}
                >
                  <InfoIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickDeleteButton
                  ? "You do not have permission"
                  : "Delete"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  // onClick={() => handleDelete(params.row.SensorName)}
                  onClick={() => handleOpenDelete(params.row.SensorName)}
                  disabled={userRole !== "SuperAdmin" && !canClickDeleteButton}
                  key={id}
                  className="delete-button"
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  if (isInfoClicked) {
    steps.push("Parameters");
  }

  //RBAC
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userRole = useSelector((state) => state.userRole);
  const canClickInfoButton = permissions.includes(
    "canClickOnInfoSensorDetails"
  );
  const canClickDeleteButton = permissions.includes("canClickOnDeleteSensor");
  const canClickAddSensorButton = permissions.includes("canClickOnAddSensor");
  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  // add sensor modal
  const handleClickOpen = () => {
    setIsInfoClicked(false);
    setOpen(true);
  };

  //handles modal close
  const handleClose = () => {
    setOpen(false);
    setIsInfoClicked(false);
    setFormData(initialFormData);
    setSensorTypeNameError("");
    setSensorNameError("");
    setDescriptionError("");
    setActiveStep(0); // Reset the active step
    setWarning(null);
  };

  //get list of all the sensors for the project site
  const getsensorsForProjectSite = async () => {
    axios
      .get(`/sites/sensor/sensorsForProjectSite/${projectSiteName}`)
      .then((response) => {
        const sensorData = response.data;
        const sensorTypes = sensorData.map((sensor) => {
          return {
            id: sensor.id,
            SensorTypeName: sensor.SensorTypeName,
          };
        });
        console.log("Sensor Type Name", sensorTypes);
        setSensorList(sensorData);
        setTimeout(() => {
          setIsLoading(false);
        }, 400); // 400ms delay
      })
      .catch((error) => {
        if (error.response.status === 404) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: JSON.stringify(error.response.data),
          });
          setSensorList([]);
          setIsLoading(false); // Stop the loader
        } else {
          Swal.fire("Error", error.response.data);
        }
      });
  };

  useEffect(() => {
    getsensorsForProjectSite();
  }, [params]);

  //Fetch all sensor types list in the DROPDOWN
  const getAllSensorTypes = async () => {
    try {
      const response = await axios.get(`/sites/sensor/type/sensorTypesList`);
      const sensorTypeList = response.data;
      console.log("Sensor Types List", sensorTypeList);
      setSensorListLogical(sensorTypeList);
      setError(null); // reset the error message
    } catch (error) {
      console.error("Error fetching sensor type list:", error);
      setError("Couldn't get sensor types");
    }
  };

  useEffect(() => {
    getAllSensorTypes();
  }, []);

  //  [To fetch SENSOR TYPE PARAMETERS]
  const getSensorType = async (sensorTypes) => {
    try {
      const response = await axios.get(
        `/sites/sensor/type/getSensorType/${sensorTypes}`
      );
      // console.log('Sensor Type Data', response.data);
      const sensorTypeParameters = response.data.SensorTypeParameters;
      // console.log(sensorTypeParameters, 'Parameters array')
      setSensorTypeParameters(sensorTypeParameters);
      setTimeout(() => {
        setIsLoading(false);
      }, 400); // 400ms delay
    } catch (error) {
      console.error("Error fetching project groups:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;
    if (name === "SensorName") {
      // Capitalize the value and replace spaces with underscores
      formattedValue = value.toUpperCase().replace(/\s+/g, "_");
      if (formattedValue.length > 20) {
        setWarning("Only 20 characters are allowed");
        return; // Don't update the form data if the length exceeds 20
      } else {
        setWarning(null); // Clear the warning if the length is 20 or less
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: formattedValue,
    }));
  };

  //sensors name duplicity check on blur
  const handleBlur = async () => {
    try {
      const response = await axios.get(
        `/sites/sensor/sensorsForProjectSite/${projectSiteName}`
      );
      const sensorNames = response.data.map((sensor) => sensor.SensorName);
      if (sensorNames.includes(formData.SensorName)) {
        setSensorNameError("This sensor name already exists");
      } else {
        setSensorNameError(null);
      }
    } catch (error) {
      console.error("Error fetching sensors:", error);
    }
  };

  //post the sensor data
  const handleSubmit = () => {
    if (sensorNameError) {
      return; // Stop the function if there's an error
    }

    setSensorTypeNameError(null);
    setSensorNameError(null);
    setDescriptionError(null);

    if (!formData.SensorTypeName) {
      setSensorTypeNameError("Sensor Type Name cannot be empty");
      return; // Stop the function if there's an error
    }

    if (!formData.SensorName || !formData.SensorName.trim()) {
      setSensorNameError("Sensor Name cannot be empty or contain spaces");
      return; // Stop the function if there's an error
    }

    if (!formData.SensorDescription || !formData.SensorDescription.trim()) {
      setDescriptionError("Description cannot be empty or contain spaces");
      return; // Stop the function if there's an error
    }
    const formDataWithBase64 = {
      SensorTypeName: formData.SensorTypeName,
      SensorName: formData.SensorName,
      SensorDescription: formData.SensorDescription,
      //ProjectSiteName needs to be fetched from projectSite HomePage
      projectSiteName: projectSiteName,
      // projectSiteName: projectSiteName
    };
    axios
      .put(`sites/sensor/sensor`, formDataWithBase64)
      .then((response) => {
        console.log("Form data updated:", response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data,
        });
        // Refresh the sensor types list for dropdown
        getAllSensorTypes();
        setFormData(initialFormData);
        setActiveStep(0);
        getsensorsForProjectSite();
        setOpen(false);
      })
      .catch((error) => {
        setOpen(false);
        if (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response.data,
          });
        } else {
          console.error("Error updating form data:", error);
        }
      });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleOpenDelete = (SensorName) => {
    setSelectedSensor(SensorName);
    setOpen5(true);
  };

  const handleCloseDelete = () => {
    setOpen5(false);
  };

  //delete sensor fron the project site
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `/sites/sensor/${selectedSensor}/${projectSiteName}`
      );
      // Refresh the sensor types list for dropdown
      await getAllSensorTypes();

      switch (response.status) {
        case 200:
          Swal.fire(
            "Deleted!",
            `Sensor: ${selectedSensor} deleted successfully`,
            "success"
          );
          break;
        case 500:
          Swal.fire("Error!", "Sensor not deleted", "error");
          break;
        default:
          Swal.fire(
            "Error!",
            "There is an error in getting information from server",
            "error"
          );
          break;
      }

      await getsensorsForProjectSite();

      setOpen5(false);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        Swal.fire(
          "Error!",
          "There is an error in getting information from server",
          "error"
        );
      } else {
        console.error("Error deleting sensor:", error);
      }
    }
  };

  //info button modal
  const handleInfoClick = (sensor) => {
    setOpen(true);
    setIsInfoClicked(true);
    setFormData(sensor);
    setDescriptionError("");
  };

  // stepper logic
  const getStepContent = (step) => {
    const sensorTypesSet = new Set();
    sensorList.forEach((sensorType) => {
      sensorTypesSet.add(sensorType.SensorTypeName);
    });
    switch (step) {
      case 0:
        return (
          <div className="userdetail">
            <h3 className="H1">
              {isInfoClicked ? "View Sensor " : "Add Sensors"}
            </h3>
            <Stack
              component="form"
              sx={{ width: "100%" }}
              spacing={2.3}
              noValidate
              autoComplete="off"
            >
              <FormControl variant="filled" disabled={isInfoClicked}>
                <InputLabel id="demo-simple-select-filled-label">
                  Sensor Type *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  name="SensorTypeName"
                  value={formData.SensorTypeName}
                  onChange={handleChange}
                  InputProps={{ disableUnderline: true }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 2.5, // where 48 is the item height
                        width: "20ch",
                      },
                    },
                  }}
                >
                  {error ? (
                    <MenuItem value="">{error}</MenuItem>
                  ) : (
                    sensorListLogical.map((sensorType, index) => (
                      <MenuItem key={index} value={sensorType}>
                        {sensorType}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              {sensorTypeNameError && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
                >
                  {sensorTypeNameError}
                </div>
              )}

              <TextField
                id="filled-basic"
                label="Sensor Name*"
                name="SensorName"
                value={formData.SensorName}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="filled"
                className=""
                InputProps={{ disableUnderline: true }}
                disabled={isInfoClicked}
              />
              {warning && <div style={{ color: "red" }}>{warning}</div>}
              {sensorNameError && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
                >
                  {sensorNameError}
                </div>
              )}
              <TextField
                id="filled-multiline-static"
                label="Sensor Description"
                required
                name="SensorDescription"
                value={formData.SensorDescription}
                onChange={handleChange}
                multiline
                rows={4}
                variant="filled"
                InputProps={{ disableUnderline: true }}
                disabled={isInfoClicked}
              />

              {!isInfoClicked && descriptionError && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
                >
                  {descriptionError}
                </div>
              )}
            </Stack>
          </div>
        );
      case 1:
        return (
          <div className="scrollable-content">
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              {sensorTypeParameters.length > 0 ? (
                sensorTypeParameters.map((parameter) => (
                  <Grid
                    container
                    spacing={-2}
                    key={parameter.ID}
                    className="params"
                  >
                    <Grid item xs={4} className="params-content">
                      <TextField
                        label="Parameter Name"
                        value={parameter.ParameterName}
                        variant="filled"
                        color="secondary"
                        focused
                        InputProps={{
                          readOnly: true,
                          disableUnderline: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4} className="params-content">
                      <TextField
                        label="Parameter Unit"
                        value={parameter.ParameterUnit}
                        variant="filled"
                        color="secondary"
                        focused
                        InputProps={{
                          readOnly: true,
                          disableUnderline: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4} className="params-content">
                      <TextField
                        label="Data Type"
                        value={parameter.DataType}
                        variant="filled"
                        color="secondary"
                        focused
                        InputProps={{
                          readOnly: true,
                          disableUnderline: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                ))
              ) : (
                <div>No parameters found for the sensor type</div>
              )}
            </Typography>
          </div>
        );
    }
  };

 

  return (
    <>
      {/* Delete dialog popup*/}
      <DialogBox
        open={open5}
        onClose={handleCloseDelete}
        onDelete={handleDelete}
        itemToDelete={selectedSensor}
      />
      <>
        <ModelForm open={opendelete} onClose={handleClose}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="heading_model">
              <svg
                width="75"
                height="75"
                viewBox="0 0 75 75"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="37.5" cy="37.5" r="37.5" fill="#FFF5F6" />
                <path
                  d="M48.6796 31.7898C49.0008 31.7898 49.2923 31.93 49.5226 32.1668C49.7373 32.4198 49.8454 32.7339 49.814 33.0658C49.814 33.1754 48.9554 44.0341 48.4649 48.6048C48.1578 51.4097 46.3496 53.1127 43.6374 53.1594C41.5518 53.2061 39.5133 53.2222 37.5061 53.2222C35.3751 53.2222 33.2912 53.2061 31.2683 53.1594C28.6469 53.0966 26.8372 51.363 26.5457 48.6048C26.0412 44.018 25.1982 33.1754 25.1825 33.0658C25.1669 32.7339 25.2734 32.4198 25.4896 32.1668C25.7027 31.93 26.0098 31.7898 26.3326 31.7898H48.6796ZM40.8265 21C42.2508 21 43.5231 21.994 43.8913 23.4118L44.1546 24.5879C44.3677 25.5465 45.1981 26.2248 46.1539 26.2248H50.8515C51.4782 26.2248 52 26.7452 52 27.4073V28.0195C52 28.6656 51.4782 29.2021 50.8515 29.2021H24.1501C23.5218 29.2021 23 28.6656 23 28.0195V27.4073C23 26.7452 23.5218 26.2248 24.1501 26.2248H28.8476C29.8019 26.2248 30.6323 25.5465 30.847 24.5895L31.093 23.4908C31.4753 21.994 32.7335 21 34.1735 21H40.8265Z"
                  fill="#FF3F56"
                />
              </svg>
            </div>
          </Box>
        </ModelForm>

        {/* Add sensor modal */}
        <ModelForm open={open} onClose={handleClose} onSubmit={handleSubmit}>
          <div>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              <Typography>{getStepContent(activeStep)}</Typography>
              <div className="btns">
                {/* {!(isInfoClicked && activeStep === 1) && (
                                    <Button variant="contained" onClick={handleClose} id='backBtn'>
                                        Close
                                    </Button>
                                )} */}
                {isInfoClicked && activeStep === 0 && (
                  <Button type="submit" onClick={handleNext} id="nextBtn">
                    Next
                  </Button>
                )}
                {isInfoClicked && activeStep !== 0 && (
                  <Button
                    variant="contained"
                    onClick={handleBack}
                    // id='backBtn'
                  >
                    Back
                  </Button>
                )}
                {/* {isInfoClicked && activeStep === 1 && (
                                    <Button
                                        type='submit'
                                        onClick={handleClose}
                                        id='nextBtn'
                                    >Close
                                    </Button>
                                )} */}
                {!isInfoClicked && (
                  <Button type="submit" onClick={handleSubmit} id="nextBtn">
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ModelForm>

        <div className="parentContainer">
          <Stack direction="row" className="myStack my-0 mb-0 pt-2">
            {/* search box */}
            <div className="searchContainerDatagrid">
              <OutlinedInput
                className="dataGridSearch"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search sensor..."
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
                  fontSize: "small",
                  color: "#919eab",
                  paddingLeft: "5px",
                }}
              ></i>
            </div>
            {/* Button */}
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickAddSensorButton
                  ? "You do not have permission"
                  : ""
              }
              arrow
            >
              <span>
                <Button
                  variant="contained"
                  disabled={
                    userRole !== "SuperAdmin" && !canClickAddSensorButton
                  }
                  className={
                    userRole !== "SuperAdmin" && !canClickAddSensorButton
                      ? ""
                      : "button_color"
                  }
                  onClick={handleClickOpen}
                  startIcon={<AddCircleIcon />}
                  style={{ marginRight: "16px" }}
                >
                  {" "}
                  Add Sensor
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </div>
        {/* Data grid  */}
        <div
          style={{
            height: "359px",
            width: "100%",
            marginTop: "-9px",
            position: "relative",
          }}
        >
          <DataGrid
            // rows={sensorList}
            rows={sensorList.filter((sensors) =>
              sensors.SensorName.toLowerCase().includes(
                searchTerm.toLowerCase()
              )
            )}
            columns={columns}
            // loading={loading}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            getRowId={(row) => row.SensorTypeName}
            pageSizeOptions={[5, 10]}
            components={{
              NoRowsOverlay: isLoading ? () => false : CustomNoRowsOverlay,
            }}
            rowHeight={50}
            hideFooterSelectedRowCount={true}
            disableColumnSelector={true}
            sx={{
              padding: "0px 15px 0px 15px",
              width: "100%",
              margin: "0 auto",
              border: "none",
              marginBottom: "16px",
              borderRadius: "0px 0px 16px 16px",
              boxShadow:
                "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px", // Add box shadow
              backgroundColor: "#fff",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f4f6f8",
                color: "#777",
              },
              "& .MuiDataGrid-root": {
                borderColor: "#d3d3d3",
              },
              "& .MuiDataGrid-cell": {
                borderColor: "#f4f6f8",
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
      </>
    </>
  );
}
