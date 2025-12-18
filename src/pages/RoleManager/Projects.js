/* This is implementation of Login flow in the application.
  Author : Tinku Gupta
  Revision: 1.0 - 13-03-2021 : Comment and 404 handle on data grid .
*/

import * as React from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Card from "react-bootstrap/Card";
import LoaderDatagrid from "../../components/common/LoaderDatagrid";
import axios from "axios";
import CardContent from "@mui/material/CardContent";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Swal from "sweetalert2";
import countrydata from "./../../Data/Countrydata.json";
import imageCompression from "browser-image-compression";
import Loader from "../../Loader";
import { Dialog, DialogContentText, DialogTitle } from "@mui/material";
import { CircularProgress } from "@mui/material";
import ProjectSite_Layout from "../../components/ProjectSite_Layout";
import CustomNoRowsOverlay from "../../components/common/CustomNoRowsOverlay";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
//RBAC
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";
import { fetchAssociatedProjects } from "../../features/permissions/userAssociatedProjectSlice";

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
  Box,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Country, State, City } from "country-state-city";
import ModelForm from "../../components/common/ModelForm";

//css
import "../../styles/Datatable.css";
import "../../styles/Project.css";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const initialFormData = {
  projectSiteName: "",
  projectSiteAlias: "",
  projectLocation: "",
  siteImage: null,
  description: "",
};

export default function DataTable(props) {
  const steps = ["Project Details"];
  const [formData, setFormData] = useState(initialFormData);
  const [selectedProject, setSelectedProject] = useState(null);
  const [open5, setOpen5] = React.useState(false);
  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loader, setLoader] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [editData, setEditData] = useState(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [editedProjectId, setEditedProjectId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [message, setMessage] = useState(null);
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userRole = useSelector((state) => state.userRole);
  const groupProjectSite = useSelector((state) => state.userGroupsForProject);

  const canClickInfoButton = permissions.includes("canClickOnInfoProjectSite");
  const canClickEditButton = permissions.includes("canClickOnEditProjectSite");
  const canClickDeleteButton = permissions.includes(
    "canClickOnDeleteProjectSite"
  );
  const canClickCreateProjectSite = permissions.includes(
    "canClickOnCreateProjectSite"
  );
  const canClickProjectSite = permissions.includes("canClickOnProjectSiteName");
  const canClickViewonlyProject = permissions.includes(
    "canViewUserAssociatedProjectsOnly"
  );

  //Data-grid columns
  const columns = [
    {
      field: "projectSiteName",
      headerName: "Project Name",
      headerClassName: "header-project-name",
      flex: 1.2,
      renderCell: (params) => {
        const projectName = params.row.projectSiteName;
        const siteImage = params.row.siteImage;
        return userRole === "SuperAdmin" || canClickProjectSite ? (
          <Link className="datagridIcon_div" to={`/projects/${projectName}`}>
            <div className="datagridIcon_img" style={{ marginRight: "9px" }}>
              <img src="./location.png" height={32} />
            </div>
            {params.row.projectSiteName}
          </Link>
        ) : (
          <Tooltip title={"You do not have permission"} arrow>
            <span
              style={{
                opacity: 0.4,
              }}
              className="datagridIcon_div"
            >
              <div className="datagridIcon_img" style={{ marginRight: "9px" }}>
                <img src="./location.png" height={32} />
              </div>
              {params.row.projectSiteName}
            </span>
          </Tooltip>
        );
      },
    },
    { field: "projectSiteAlias", headerName: "Project Alias", flex: 1.2 },
    { field: "projectLocation", headerName: "Project Location", flex: 1.2 },
 
    {
      field: "Action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      filterable:false,
      flex: 0.7,
      renderCell: (params) => {
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
                  color="primary"
                  key={params.row.projectSiteName}
                  className="info-button"
                  style={{ marginRight: 4 }}
                  data-testid="info-button-test"
                  disabled={userRole !== "SuperAdmin" && !canClickInfoButton}
                  onClick={() => handleInfo(params.row.projectSiteName)}
                >
                  <InfoIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickEditButton
                  ? "You do not have permission"
                  : "Edit"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  disabled={userRole !== "SuperAdmin" && !canClickEditButton}
                  key={params.row.projectSiteName}
                  className="edit-button"
                  style={{ marginRight: 4 }}
                  data-testid="edit-button-test"
                  onClick={() => handleEdit(params.row.projectSiteName, false)}
                >
                  <EditIcon fontSize="small" />
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
                  disabled={userRole !== "SuperAdmin" && !canClickDeleteButton}
                  onClick={() => handleOpenDelete(params.row.projectSiteName)}
                  key={params.row.projectSiteName}
                  style={{ marginRight: 1 }}
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

  useEffect(() => {
    dispatch(fetchPermissions());
    dispatch(fetchrole());
    dispatch(fetchAssociatedProjects());
  }, [dispatch]);

  // Function to open a form or dialog box for creating a new project
  const handleClickOpen = () => {
    setViewMode(false);
    setOpen(true);
    setEditData(null);
    setEditedProjectId(null);
    setFormData(initialFormData);
    setErrorMessage(null);
  };

  // Function to close the form or dialog box and reset the form
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  // Function to display the details of a selected project
  const handleInfo = (projectSiteName) => {
    setErrorMessage(null);
    const selectedProject = users.find(
      (project) => project.projectSiteName === projectSiteName
    );
    const [city, state, country] = selectedProject.projectLocation.split(",");
    setSelectedCountry(country);
    setSelectedState(state);
    setSelectedCity(city);
    setFormData({
      ...selectedProject,
    });

    // Set successMessage if image is already uploaded
    if (selectedProject.siteImage) {
      setSuccessMessage("Image already uploaded");
    }

    setViewMode(true);
    setOpen(true);
  };

  // Function to open the form for editing a selected project and initialize the form with the project's current details
  const handleEdit = (projectSiteName) => {
    const projectToEdit = users.find(
      (user) => user.projectSiteName === projectSiteName
    );
    setEditData(projectToEdit);
    setEditedProjectId(projectSiteName);
    setErrorMessage(null);
    // Initialize formData with the values from projectToEdit
    setFormData({
      projectSiteName: projectToEdit.projectSiteName || "",
      projectLocation: projectToEdit.projectLocation || "",
      projectSiteAlias: projectToEdit.projectSiteAlias || "",
      siteImage: projectToEdit.siteImage
        ? `data:image/png;base64,${projectToEdit.siteImage}`
        : "",
      description: projectToEdit.description || "",
    });

    const [city, state, country] = projectToEdit.projectLocation.split(",");
    setImage(
      projectToEdit.siteImage
        ? `data:image/png;base64,${projectToEdit.siteImage}`
        : null
    );

    // Set the selectedCountry, selectedState, and selectedCity states
    setSelectedCountry(country);
    setSelectedState(state);
    setSelectedCity(city);

    // Update the states and cities based on the selected country and state
    setStates(State.getStatesOfCountry(country));
    setCities(City.getCitiesOfState(country, state));

    // Set successMessage if image is already uploaded
    if (projectToEdit.siteImage) {
      setSuccessMessage("Image uploaded successfully");
    }

    setViewMode(false);
    setOpen(true);
  };

  // Function to open a dialog box for confirming the deletion of a selected project
  const handleOpenDelete = (projectSiteName) => {
    setSelectedProject(projectSiteName);
    setOpen5(true);
  };

  // Function to close the delete confirmation dialog box
  const handleCloseDelete = () => {
    setOpen5(false);
  };

  // Filter user groups in data-grid based on the search term
  const filteredProject = users.filter(
    (projectname) =>
      projectname.projectSiteName &&
      projectname.projectSiteName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Function to delete a selected project
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `/sites/project/projectSite/${selectedProject}`
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data,
      });
      getprojectSites();
      setOpen5(false);
      setLoading(false);
    } catch (error) {
      console.log("Error", error.response.data);
      Swal.fire("Error", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getprojectSites();
  }, []);

  // Function to fetch the list of all projects
  const getprojectSites = async () => {
    try {
      let response = await axios.get("/sites/project/projectSites");
      console.log("line 83", response);
      setUsers(response.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 400); // 400ms delay
      setLoading(false);
      const projectSiteExists = response.data.some(
        (project) => project.projectSiteName === formData.projectSiteName
      );
      if (projectSiteExists) {
        setErrorMessage("Project site name already exists.");
      } else {
        setErrorMessage(null);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: JSON.stringify(error.response.data),
          });
          setUsers([]);
          setIsLoading(false);
        } else {
          Swal.fire("Error", error.response.data);
        }
      } else {
        Swal.fire("Error", "An unexpected error occurred");
      }
      setIsLoading(false);
      setLoading(false);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Function to reset the form to its initial state
  const resetForm = () => {
    setFormData(initialFormData);
    setActiveStep(0);
    setSelectedCountry("");
    setSelectedState("");
    setSelectedCity("");
    setFilteredStates([]);
    setSuccessMessage("");
    setErrorMessage(null);
    setCountries(Country.getAllCountries());
    setStates([]);
    setCities([]);
    setMessage(null);
  };

  // Function to handle changes in form fields
  const handleChange = async (event) => {
    const { name, value, type, checked, files } = event.target;
    if (name === "projectSiteName") {
      // Check if the value contains special characters
      const regex = /^[a-zA-Z0-9_]*$/;
      if (!regex.test(value)) {
        setErrorMessage(
          "Project site name can only contain letters, numbers, and underscores."
        );

        return;
      }
    }
    if (name === "siteImage" && files && files[0]) {
      setLoader(true);
      try {
        const compressedFile = await compressAndSetImage(files[0]);

        setFormData((prevData) => ({
          ...prevData,
          [name]: compressedFile,
        }));
        setSuccessMessage("Image uploaded successfully");
        setIsLoading(false);
        setLoader(false);
      } catch (error) {
        console.error("Error compressing image:", error);
        setSuccessMessage("Image upload failed. Please try again.");
      }
      setIsLoading(false);
      setLoader(false);
    } else if (name === "countryCode") {
      setSelectedCountry(value);

      // selected country in the countrydata JSON
      const selectedCountryData = countrydata.find(
        (country) => country.sortname === value
      );

      if (selectedCountryData) {
        const states = selectedCountryData.states || [];
        setFilteredStates(states);
      } else {
        setFilteredStates([]); // Reset the state list if the country is not found
      }

      setFormData((prevData) => ({
        ...prevData,
        countryCode: value,
        stateCode: "",
      }));
    } else {
      const newValue = type === "checkbox" ? checked : value;
      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    }
  };

  // Function to compress an uploaded image and set it in the form data
  const compressAndSetImage = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.06, // 60KB (adjust the maximum size as needed)
        maxWidthOrHeight: 800, // Adjust the maximum width/height as needed
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prevData) => ({
          ...prevData,
          siteImage: e.target.result,
        }));
        setLoader(false);
        setSuccessMessage("Image uploaded and compressed successfully");
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image compression error:", error);
      setSuccessMessage("Image upload failed, please try again.");
    }
  };

  // Function to check if all required fields in the form are filled
  const isFormValid = () => {
    // Check if all required fields are filled
    return (
      formData.projectSiteName &&
      formData.projectSiteAlias &&
      formData.description &&
      selectedCity &&
      selectedState &&
      selectedCountry
    );
  };

  // Function to submit the form. If an `editedProjectId` is present, it updates the existing project; otherwise, it creates a new project
  const handleSubmit = async (event) => {
    event.preventDefault();
    const projectLocation = [selectedCity, selectedState, selectedCountry]
      .filter(Boolean)
      .join(",");
    const formDataWithBase64 = {
      projectSiteName: formData.projectSiteName,
      projectSiteAlias: formData.projectSiteAlias,
      siteImage: formData.siteImage ? formData.siteImage.split(",")[1] : null,
      description: formData.description,
      projectLocation,
    };

    try {
      let response;
      if (editedProjectId !== null) {
        response = await axios.put(
          `/sites/project/projectSite/${formData.projectSiteName}`,
          formDataWithBase64
        );
        Swal.fire("Updated successfully", response.data, "success");
        console.log("Form data updated:", response.data);
        handleClose();
      } else {
        const {
          projectSiteName,
          projectSiteAlias,
          siteImage,
          description,
          countryCode,
          stateCode,
        } = formData;
        if (
          !projectSiteName ||
          !projectSiteAlias ||
          !siteImage ||
          !countryCode ||
          !stateCode
        ) {
          setMessage("All fields are required");
          return;
        } else {
          setMessage(null);
        }
        response = await axios.post(
          `/sites/project/projectSite/${formData.projectSiteName}`,
          formDataWithBase64
        );
        console.log("Form data Added successfully:", response.data);
        Swal.fire("Added successfully", response.data, "success");
      }
      getprojectSites();
      setOpen(false);
      handleClose();
    } catch (error) {
      Swal.fire("Error", error.response.data);
      Swal.fire("Error", error.message);
      console.error("Error submitting form data:", error);
      // setOpen(false);
      // handleClose();
    }
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

  // Function to check if a project site name already exists when the user leaves the project site name field
  const handleBlur = async (event) => {
    const { name, value } = event.target;
    if (name === "projectSiteName") {
      let projectSiteName = value;
      try {
        const response = await axios.get(
          `/sites/project/projectSite/isProjectSiteExist/${projectSiteName}`
        );
        console.log(response); // Log the entire response object
        if (response.data && response.data === "True") {
          setErrorMessage(
            "Project site name already exists. Please use another name."
          );
        } else {
          setErrorMessage(null);
        }
        // handleClose()
      } catch (error) {
        console.error("Error checking duplicacy:", error);
        //Swal.fire("Error", error.response.data);
      }
    }
  };

  // stepper logic
  const getStepContent = (step) => {
    // eslint-disable-next-line default-case
    switch (step) {
      case 0:
        return (
          <div className="userdetail">
            <h4 className="Project_Heading">
              {viewMode
                ? "View Project"
                : editData
                ? "Edit Project"
                : "Create New Project"}
            </h4>
            <Stack
              component="form"
              sx={{ width: "100%" }}
              spacing={2.3}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="filled-basic"
                label="Name"
                required
                name="projectSiteName"
                value={
                  formData.projectSiteName ||
                  (editData ? editData.projectSiteName : "")
                }
                onChange={handleChange}
                onBlur={handleBlur}
                variant="filled"
                className=""
                InputProps={{
                  disableUnderline: true,
                  "data-testid": "projectSiteName",
                  // disabled: editData !== null,
                  inputProps: {
                    maxLength: 100,
                  },
                }}
                disabled={viewMode || editData}
              />
              {errorMessage && (
                <div style={{ color: "red" }}>{errorMessage}</div>
              )}
              <TextField
                id="filled-basic"
                label="Alias Name"
                placeholder="Enter Alias Name"
                required
                name="projectSiteAlias"
                value={
                  formData.projectSiteAlias !== undefined
                    ? formData.projectSiteAlias
                    : editData
                    ? editData.projectSiteAlias
                    : ""
                }
                onChange={handleChange}
                variant="filled"
                className=""
                InputProps={{
                  "data-testid": "alias Name",
                  disableUnderline: true,
                }}
                disabled={viewMode}
              />
              {/* <TextField id="filled-basic" label="Country Code" name="countryCode" value={formData.countryCode} onChange={handleChange} variant="filled" className="" InputProps={{ disableUnderline: true }}/> */}
              <FormControl variant="filled">
                <InputLabel required id="country-label">
                  Country
                </InputLabel>

                <Select
                  label="country-label"
                  id="country-select"
                  name="countryCode"
                  value={selectedCountry}
                  onChange={(e) => {
                    // User story 18735 project pop creation for project site
                    const selectedCountryCode = e.target.value;
                    const statesOfSelectedCountry =
                      State.getStatesOfCountry(selectedCountryCode);

                    setSelectedCountry(selectedCountryCode);
                    setStates(statesOfSelectedCountry);
                    setSelectedState(""); // Reset selected state
                    setCities([]);
                    setFormData((prev) => ({
                      ...prev,
                      countryCode: selectedCountryCode,
                    }));

                    if (statesOfSelectedCountry.length === 0) {
                      // Display popup here
                      // message.success("This country does not have any states.");
                      Swal.fire({
                        icon: "info",
                        title:
                          "The Project Site can't be created as the country doesn't have any states",
                      });
                    }
                  }}
                  disabled={viewMode}
                >
                  {countries.map((country) => (
                    <MenuItem value={country.isoCode}>{country.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {states.length > 0 && (
                <FormControl required variant="filled">
                  <InputLabel required id="state-label">
                    State
                  </InputLabel>
                  <Select
                    label="state-label"
                    id="state-select"
                    name="stateCode"
                    value={selectedState}
                    onChange={(e) => {
                      // User story 18735 project pop creation for project site
                      const selectedStateCode = e.target.value;
                      const citiesOfSelectedState = City.getCitiesOfState(
                        selectedCountry,
                        selectedStateCode
                      );
                      setSelectedState(selectedStateCode);
                      setCities(
                        citiesOfSelectedState
                      );
                      setSelectedCity("");
                      setFormData((prev) => ({
                        ...prev,
                        stateCode: e.target.value,
                      }));
                      if (citiesOfSelectedState.length === 0) {
                        // Display popup here
                        // User story 18735 project pop creation for project site
                        // alert("This state does not have any cities. ");
                        Swal.fire({
                          icon: "info",
                          title:
                            "The Project Site can't be created as the state doesn't have any cities",
                        });
                      }
                    }}
                    disabled={viewMode}
                  >
                    {states.map((state) => (
                      <MenuItem value={state.isoCode}>{state.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {cities.length > 0 && (
                <Select
                  id="filled-basic"
                  label="Location"
                  variant="filled"
                  required
                  name="projectLocation"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      projectLocation: e.target.value,
                    }));
                  }}
                  disabled={viewMode}
                >
                  {cities.map((city) => (
                    <MenuItem value={city.name}>{city.name}</MenuItem>
                  ))}
                </Select>
              )}

              {loader ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1em",
                  }}
                >
                  <Loader />
                </Box>
              ) : successMessage ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      // backgroundColor: "#F6F7FB",
                      border: "5px dashed rgba(171, 175, 177, 0.20)",
                      background: "#EFF5EF",
                      borderRadius: "4px rgba(171, 175, 177, 0.20)",
                    }}
                  >
                    <CardContent
                      sx={{
                        flex: "1 0 auto",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.25"
                          width="24"
                          height="24"
                          rx="12"
                          fill="#2E7D32"
                        />
                        <path
                          d="M9.57923 15.2293L6.10423 11.7543L4.9209 12.9293L9.57923 17.5876L19.5792 7.5876L18.4042 6.4126L9.57923 15.2293Z"
                          fill="white"
                        />
                      </svg>
                    </CardContent>
                    <Box
                      sx={{
                        flex: "1 0 auto",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div className="ProjectUploadText">
                        <div
                          style={{
                            paddingLeft: "12px",
                            color: "#2E7D32",
                            paddingBottom: "12px",
                          }}
                        >
                          {successMessage}
                          <div className="ProjectUploadText">
                            <Button
                              variant="text"
                              className="Project_upload"
                              component="label"
                              style={{ fontFamily: "Roboto" }}
                              disabled={viewMode}
                            >
                              Click to Update Image
                              <input
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                name="siteImage"
                                required
                                onChange={handleChange}
                                hidden
                                disabled={viewMode}
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#F6F7FB",
                    border: "5px dashed rgba(171, 175, 177, 0.20)",
                    background: "#F6F7FB",
                    borderRadius: "4px rgba(171, 175, 177, 0.20)",
                  }}
                >
                  <CardContent
                    sx={{
                      flex: "1 0 auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.63948 8.98354H6.70648C4.67148 8.98354 3.02148 10.6335 3.02148 12.6685V17.5435C3.02148 19.5775 4.67148 21.2275 6.70648 21.2275H17.8365C19.8715 21.2275 21.5215 19.5775 21.5215 17.5435V12.6585C21.5215 10.6295 19.8765 8.98354 17.8475 8.98354L16.9045 8.98354"
                        stroke="#111827"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12.2714 2.19044V14.2314"
                        stroke="#111827"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.35626 5.11816L12.2713 2.19016L15.1873 5.11816"
                        stroke="#111827"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </CardContent>
                  <Box
                    sx={{
                      flex: "1 0 auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div className="ProjectUploadText">
                      <Button
                        variant="text"
                        className="Project_upload"
                        component="label"
                        style={{ fontFamily: "Roboto" }}
                      >
                        Click to upload
                        <input
                          type="file"
                          accept=".png, .jpg, .jpeg"
                          name="siteImage"
                          required
                          onChange={handleChange}
                          hidden
                          disabled={viewMode}
                        />
                      </Button>
                      <span>or drag and drop*</span>
                      <div
                        style={{
                          paddingLeft: "12px",
                          color: "#ABAFB1",
                          paddingBottom: "12px",
                        }}
                      >
                        SVG, PNG, JPG or GIF
                      </div>
                    </div>
                  </Box>
                </Box>
              )}

              <TextField
                id="filled-multiline-static"
                label="Description"
                name="description"
                value={
                  formData.description 
                }
                onChange={handleChange}
                multiline
                rows={4}
                variant="filled"
                InputProps={{ disableUnderline: true }}
                disabled={viewMode}
              />
              {message && <div style={{ color: "red" }}>{message}</div>}
            </Stack>

            {viewMode && (
              <p style={{ color: "red" }}>
                You don't have permission to edit in view mode
              </p>
            )}
          </div>
        );

      // default:
      //   return 'Unknown step';
    }
  };

  return (
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
            id="backBtn"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            style={{ backgroundColor: "red", color: "white" }}
            autoFocus
            id="nextBtn"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
            {/* Delete */}
          </Button>
        </DialogActions>
      </Dialog>

      <ModelForm data-testid="modelform" open={open} onClose={handleClose}>
        {activeStep === steps.length ? (
          <div>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            {/* Form content for the final step */}
            {getStepContent(activeStep)}
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

            <div>
              <Typography>{getStepContent(activeStep)}</Typography>
              <Box height={10} />

              <div>
                {!viewMode && (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={viewMode}
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </ModelForm>

      <ProjectSite_Layout>
        <Card
          style={{
            width: "100%",
            border: "none",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Card.Body>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="myTypography"
            >
              Projects
            </Typography>

            <div className="parentContainer">
              <Stack direction="row" className="myStack my-0 mb-0 pt-2">
                {/* search box */}
                <div className="searchContainerDatagrid">
                  <OutlinedInput
                    className="dataGridSearch"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search project.."
                    startAdornment={
                      <InputAdornment
                        className="dataGridSearchinput"
                        position="start"
                      ></InputAdornment>
                    }
                  />
                  <i
                    className="fa fa-search searchIcon"
                    style={{
                      fontSize: "15px",
                      color: "#919eab",
                      paddingLeft: "5px",
                    }}
                  ></i>
                </div>
                <Tooltip
                  title={
                    userRole !== "SuperAdmin" && !canClickCreateProjectSite
                      ? "You do not have permission"
                      : ""
                  }
                  arrow
                >
                  <span>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={handleClickOpen}
                      disabled={
                        userRole !== "SuperAdmin" && !canClickCreateProjectSite
                      }
                      className={
                        userRole !== "SuperAdmin" && !canClickCreateProjectSite
                          ? ""
                          : "button_color"
                      }
                      startIcon={<AddCircleIcon />}
                    >
                      New Project
                    </Button>
                  </span>
                </Tooltip>
              </Stack>

              <div
                style={{
                  height: "359px",
                  width: "100%",
                  marginTop: "-9px",
                  position: "relative",
                }}
              >
                <DataGrid
                  hideFooterSelectedRowCount={true}
                  disableColumnSelector={true}
                  rows={(userRole === "SuperAdmin" || !canClickViewonlyProject
                    ? filteredProject
                    : groupProjectSite
                  ).filter((projectname) =>
                    projectname.projectSiteName
                      ? projectname.projectSiteName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      : false
                  )}
                  columns={columns}
                  components={{
                    NoRowsOverlay: isLoading ? () => null : CustomNoRowsOverlay,
                  }}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  getRowId={(row) =>row.projectSiteName}
                  pageSizeOptions={[5, 10]}
                  className="data-grid"
                  role="grid"
                  rowHeight={50}
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
                    "& .header-project-name .MuiDataGrid-columnHeaderTitle": {
                      marginLeft: "25px", // Add desired margin-left for Project Name header label
                    },
                    "& .MuiTablePagination-selectLabel": {
                      fontSize: "14px", // Change this to your desired font size
                      fontWeight: "400", // Change this to your desired font weight
                    },
                  }}
                />
                {isLoading && <LoaderDatagrid />}
              </div>
            </div>
          </Card.Body>
        </Card>
      </ProjectSite_Layout>
    </>
  );
}
