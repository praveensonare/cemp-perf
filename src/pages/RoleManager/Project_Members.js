/* This is implementation of Project Members page, where the user can see the list of members associated to the project site. so, first it fetchs the projectGroups Associated to projectSiteName and then fetch the members for respective Project groups.
  Author : Shweta Vyas    
    Revision:  
     1.0 - 13-03-2024  : Add template for role based permissions (profile) 
               Author  : Arpana Meshram
     7/29/24 - 1.1 : Add the functionality to filter rows based on the search term.  
    Author  : Shweta Vyas
    7/6/24: Updated API logic to fetch project members based on params        
 */

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import "../../styles/Project.css";
import Tooltip from "@mui/material/Tooltip";
import ModelForm from "../../components/common/ModelForm";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CustomNoRowsOverlay from "../../components/common/CustomNoRowsOverlay";
import LoaderDatagrid from "../../components/common/LoaderDatagrid";
import Swal from "sweetalert2";
import ProjectSite_Layout from "../../components/ProjectSite_Layout";
import BreadCrumbs from "../../components/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";

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
} from "@mui/material";

//css
import "../../styles/Datatable.css";
import "../../styles/Project.css";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const initialFormData = {
  userEmail: "",
  userRole: "",
  projectGroups: "",
  ProjectMember: "",
  Role: "",
  groupName: "",
};

export default function DataTable() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [info, setInfo] = useState(null);
  const [accessPermissions, setPermission] = useState([]);
  const [message, setMessage] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [editData, setEditData] = useState(null);
  const { projectSiteName } = useParams();
  const [openSections, setOpenSections] = useState({});
  const [groupNames, setGroupNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const steps = ["User Details", "Permissions"];

  //data grid columns
  const columns = [
    {
      field: "userEmail",
      headerName: "Email",
      align: "left",
      headerClassName: "header-project-name",
      flex: 1,
      renderCell: (params) => (
        <div className="datagridIcon_div" style={{ color: "#6a6a6a" }}>
          <div className="datagridIcon_img" style={{ marginRight: "9px" }}>
            <img src="../user.png" alt="profile" />
          </div>
          {params.value}
        </div>
      ),
    },
    {
      field: "userRole",
      headerName: "Role",
      align: "center",
      headerAlign: "center",
      flex: 0.8,
      renderCell: (params) => {
        let color, backgroundColor;
        switch (params.value) {
          case "Admin":
            color = "green";
            backgroundColor = "#DBF6E5";
            break;
          case "Member":
            color = "#C07F1C";
            backgroundColor = "#FFF1D6";
            break;
          case "Operator":
            color = "#0484bd";
            backgroundColor = "#D6F4F9";
            break;
          case "Engineer":
            color = "#5923BB";
            backgroundColor = "#EDDEFF";
            break;
          default:
            color = "black";
            backgroundColor = "#f0f0f0";
        }
        return (
          <span
            style={{
              color: color,
              backgroundColor: backgroundColor,
              padding: "3px 10px",
              borderRadius: "5px",
              fontWeight: "600",
              fontSize: "0.75rem",
            }}
            className={params.value.toLowerCase()}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "groupName",
      headerName: "Project Group",
      align: "center",
      headerAlign: "center",
      flex: 0.8,
    },
    {
      field: "Action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      flex: 0.5,
      filterable: false,
      renderCell: (params) => {
        const id = params.row.id;
        return (
          <div>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickInfoButton
                  ? "You do not have permission to View a project member details"
                  : "Info"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  className="info-button"
                  disabled={userRole !== "SuperAdmin" && !canClickInfoButton}
                  onClick={() => handleInfo(params.row.userEmail, true)}
                  key={params.row.userEmail}
                  name="Info"
                >
                  <InfoIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const [formData, setFormData] = useState({
    userEmail: "",
    userRole: "",
    groupName: "",
    accessPermissions: [],
  });

  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userRole = useSelector((state) => state.userRole);
  const canClickInfoButton = permissions.includes(
    "canClickOnViewProjectMemberDetails"
  );

  useEffect(() => {
    dispatch(fetchPermissions());
    dispatch(fetchrole());
  }, [dispatch]);

  // fetch project groups based on params projectSiteName and then fetch user group
  useEffect(() => {
    const fetchProjectGroupsAndMembers = async () => {
      try {
        // Fetch the project site data
        const response = await axios.get(
          `/sites/project/projectSites?projectSiteName=${projectSiteName}`
        );
        const projectGroups = response.data.projectGroups;
        console.log(
          `project groups for the site ${projectSiteName}`,
          projectGroups
        );
        // If there are no project groups, stop here
        if (!projectGroups || projectGroups.length === 0) {
          setIsLoading(false);
          Swal.fire({
            icon: "info",
            title: "No Members Available",
            text: `There are no members available for ${projectSiteName}.`,
          });
          return;
        }

        let foundUsers = false; // Flag variable to track if at least one member is found

        // For each project group, fetch the project members
        for (const projectGroup of projectGroups) {
          try {
            const response = await axios.get(
              `/sites/ugr/user/usersFromGroup/${projectGroup}`
            );
            const projectMembers = response.data;

            if (projectMembers.length > 0) {
              foundUsers = true; // Set the flag to true if at least one member is found

              console.log(
                `project members for the groups ${projectGroups}`,
                projectMembers
              );

              // Create an array of row objects
              const newRows = projectMembers.map((member) => ({
                id: generateRandom(),
                userEmail: member.userEmail,
                userRole: member.userRole,
                groupName: projectGroup,
              }));

              // Add the new rows to the existing rows
              setUsers((prevRows) => [...prevRows, ...newRows]);
              setIsLoading(false);
            }
          } catch (error) {
            console.error(
              `Error fetching project members for group ${projectGroup}:`,
              error
            );
          }
        }
        if (!foundUsers) {
          setIsLoading(false);
          // If no members were found in any of the project groups, display a message to the user
          Swal.fire({
            icon: "info",
            title: "No Members Available",
            text: "There are no members available for this Project Site.",
          });
        }
      } catch (error) {
        console.error("Error fetching project site data:", error);
      }
      setIsLoading(false);
    };

    fetchProjectGroupsAndMembers();
  }, []);

  const handleCheck = (event) => {
    const { name, checked } = event.target;
    setFormData((prevFormData) => {
      // If the checkbox is checked, add the permission to accessPermissions
      if (checked) {
        return {
          ...prevFormData,
          accessPermissions: [...prevFormData.accessPermissions, name],
        };
      } else {
        // If the checkbox is not checked, remove the permission from accessPermissions
        return {
          ...prevFormData,
          accessPermissions: prevFormData.accessPermissions.filter(
            (permission) => permission !== name
          ),
        };
      }
    });
  };

  //generates a unique ID for each row in the table or list
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

  //next functionality
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // handleClose();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  //back button functionality
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //close the model form
  const handleClose = () => {
    reSet();
    setOpen(false);
  };

  //reset the form
  const reSet = () => {
    setFormData(initialFormData);
    setActiveStep(0);
    setMessage(null);
  };

  useEffect(() => {
    rolePermissionsForUser();
    getRolesAndPermissions();
  }, []);

  //fetch all the RBAC role and permissions
  const getRolesAndPermissions = async () => {
    await axios
      .get(`/sites/rbac/rolesAndPermissions`)
      .then((response) => {
        setPermission(response.data);
        // console.log("data 13", response.data);
      })
      .catch((error) => {
        Swal.fire("Error", error.response.data);
      });
  };

  //fetch the role permissions for user based on userEmail
  const rolePermissionsForUser = async (userEmail) => {
    try {
      await axios
        .get(`/sites/ugr/user/rolePermissionsForUser/${userEmail}`)
        .then((response) => {
          console.log("data info", response.data);
          setFormData((prevFormData) => ({
            ...prevFormData,
            userRole: response.data.userRole || "",
            accessPermissions: response.data.accessPermissions || [],
          }));
        });
    } catch (error) {
      if (error.response.status === 404) {
        // Swal.fire({
        //   icon: "info",
        //   title: "Info",
        //   text: JSON.stringify(error.response.data),
        // });
        // setPermission([]);
      } else {
        Swal.fire("Error", error.response.data);
      }
    }
  };

  //modal form to view the user details when clicked on Info button
  const handleInfo = (userEmail) => {
    setMessage("You don't have permission to edit");
    const ViewUser = users.find((user) => user.userEmail === userEmail);
    if (ViewUser) {
      ViewUser.accessPermissions = ViewUser.accessPermissions || [];
      setInfo(ViewUser);
      setOpen(true);
      setIsDisabled(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        userEmail: ViewUser.userEmail,
        userRole: ViewUser.userRole,
        groupName: ViewUser.groupName,
        accessPermissions: ViewUser.accessPermissions,
      }));
      // Call the rolePermissionsForUser function to get the role permissions for the user
      rolePermissionsForUser(ViewUser.userEmail);
    } else {
      console.error(`No user found with email: ${userEmail}`);
    }
    setIsDisabled(true);
  };

  const handleClickopen = (key) => {
    setOpenSections(!openSections);
    setOpenSections((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  //getStepContent is a helper function to get the content of the stepper
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="userdetail">
            <h3 className="Project_Heading mt-4">{/* userdetail */}</h3>
            <Stack
              component="form"
              sx={{ width: "100%" }}
              spacing={2.3}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="filled-basic"
                label="User Email"
                required
                name="userEmail"
                value={formData.userEmail}
                variant="filled"
                className=""
                InputProps={{
                  disableUnderline: true,
                  readOnly: isViewMode,
                }}
                disabled={isDisabled}
              />

              <FormControl variant="filled">
                <InputLabel id="demo-simple-select-filled-label">
                  Role*
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  name="userRole"
                  value={
                    formData.userRole || (editData ? editData.userRole : "")
                  }
                  InputProps={{
                    disableUnderline: true,
                  }}
                  disabled={isDisabled}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Engineer">Engineer</MenuItem>
                  <MenuItem value="Operator">Operator</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="filled-basic"
                label="Group Name"
                name="groupName"
                value={formData.groupName}
                variant="filled"
                className=""
                InputProps={{
                  disableUnderline: true,
                  readOnly: isViewMode,
                }}
                disabled={isDisabled}
              />
            </Stack>
            {message && <div style={{ color: "red" }}>{message}</div>}
          </div>
        );
      case 1:
        return (
          <div className="userdetail mt-4">
            {accessPermissions.map((item, index) => {
              return Object.keys(item).map((key, i) => {
                if (Array.isArray(item[key])) {
                  return (
                    <p onClick={() => handleClickopen(key)}>
                      <h5 onClick={() => handleClickopen(key)}>
                        {openSections[key] ? <ExpandLess /> : <ExpandMore />}
                        {key}
                      </h5>
                      <Collapse
                        in={openSections[key]}
                        timeout="auto"
                        unmountOnExit
                        className="collapseW"
                      >
                        {item[key].map((subItem, j) => {
                          return Object.keys(subItem).map((subKey, k) => {
                            return (
                              <div key={k}>
                                <p
                                  style={{
                                    marginBottom: "3px",
                                    paddingLeft: "25px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {subKey}
                                </p>
                                <div style={{ marginBottom: "3px" }}>
                                  {subItem[subKey].map((permissionItem, l) => {
                                    return (
                                      <span key={l}>
                                        <div style={{ paddingLeft: "37px" }}>
                                          <label style={{ fontSize: "14px" }}>
                                            <Checkbox
                                              size="small"
                                              type="checkbox"
                                              checked={
                                                Array.isArray(
                                                  formData.accessPermissions
                                                ) &&
                                                formData.accessPermissions.includes(
                                                  permissionItem.Permission
                                                )
                                              }
                                              onChange={handleCheck}
                                              name={permissionItem.Permission}
                                              value={permissionItem.Permission}
                                              disabled={isDisabled}
                                              data-testid="checkbox"
                                            />
                                            {permissionItem.label}
                                          </label>
                                        </div>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          });
                        })}
                      </Collapse>
                    </p>
                  );
                }
                return null;
              });
            })}
            {message && <div style={{ color: "red" }}>{message}</div>}
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <ProjectSite_Layout>
      <BreadCrumbs />
      <>
        <ModelForm open={open} onClose={handleClose}>
          <div>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              <React.Fragment></React.Fragment>
              <Typography>{getStepContent(activeStep)}</Typography>
              <div className="mt-4">
                {/* no back button on 1st step */}
                {activeStep !== 0 && <Button onClick={handleBack}>Back</Button>}

                {activeStep !== steps.length - 1 && (
                  <Button onClick={handleNext}>next</Button>
                )}
              </div>
            </div>
          </div>
        </ModelForm>

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
              {projectSiteName}
            </Typography>
            <div className="parentContainer">
              <Stack direction="row" className="myStack my-0 mb-0 pt-2">
                {/* search box */}
                <div className="searchContainerDatagrid">
                  <OutlinedInput
                    className="dataGridSearch"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search member..."
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
              </Stack>

              <div
                style={{
                  height: "359px",
                  width: "100%",
                  marginTop: "-9px",
                   position:"relative"
                }}
              >
                <DataGrid
                  hideFooterSelectedRowCount={true}
                  disableColumnSelector={true}
                  // rows={rows}
                  rows={users.filter((useremailid) =>
                    useremailid.userEmail
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )}
                  columns={columns}
                  groupNames={groupNames}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  components={{
                    NoRowsOverlay: isLoading ? () => null : CustomNoRowsOverlay,
                  }}
                  getRowId={(row) =>row.userEmail}
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
                      marginLeft: "95px", // Add desired margin-left for Project Name header label
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
      </>
    </ProjectSite_Layout>
  );
}
