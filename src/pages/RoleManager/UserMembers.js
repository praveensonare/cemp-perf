/* This is implementation of UserGroup Members page, 
   where the user can see the list of members associated to the userGroup.

  Author : Arpana Meshram
  Date : 28-08-2023
  Revision:
         1.0 - 28-08-2023  : Development of React.JS code for UserMember page.
         2.0 - 18-10-2023  : API integration for UserMember page.
         3.0 - 18-01-2024  : Select AccessPermissions in group manner and show edit mode in user stepper form.
         4.0 - 01-03-2024  : Instead of permission name it should show the label of the permission. 
         5.0 - 13-03-2024  : Create template for role based permissions (profile).
         6.0 - 15-03-2023  : comment added for each function and variable.
        Author : Shweta Vyas
        Date : 15-03-2024 : Modified the close , back and submit buttons according to the stepper.


*/
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Card from "react-bootstrap/Card";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import ProjectSite_Layout from "../../components/ProjectSite_Layout";
import axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Loader from "../../components/common/LoaderDatagrid";

//css
import "../../styles/Datatable.css";
import {
  Stepper,
  Button,
  Step,
  StepLabel,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import ModelForm from "../../components/common/ModelForm";
import DialogBox from "../../components/common/DialogBox";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Swal from "sweetalert2";
import BreadCrumbs from "../../components/BreadCrumbs";
import { Spin } from "antd";
import CustomNoRowsOverlay from "../../components/common/CustomNoRowsOverlay";

//RBAC
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const initialFormData = {
  userEmail: "",
  userRole: "",
  accessPermissions: [],
};

export default function DataTable() {
  const steps = ["User Details", "Permissions"];

  //data grid columns
  const columns = [
    {
      field: "userEmail",
      headerName: "Email",
      headerAlign: "center",
      flex: 0.5,
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
      flex: 0.9,
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
      field: "Action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      flex: 0.5,
      filterable: false,
      renderCell: (params) => {
        return (
          <div>
            <Tooltip
              title={
                userRoles !== "SuperAdmin" && !canClickOnInfoUserGroupMember
                  ? "You do not have permission to access"
                  : "Info"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  className="info-button"
                  data-testid="info-button-members"
                  // disabled={userRole == 'SuperAdmin' && canClickOnInfoUserGroupMember}
                  disabled={
                    userRoles !== "SuperAdmin" && !canClickOnInfoUserGroupMember
                  }
                  style={{
                    marginRight: 5,
                  }}
                  onClick={() => handleInfo(params.row.userEmail, true)}
                  key={params.row.userEmail}
                >
                  <InfoIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>

            {/* example */}

            <Tooltip
              title={
                userRoles !== "SuperAdmin" && !canClickOnEditUserGroupMember
                  ? "You do not have permission to access"
                  : "Edit"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  className="edit-button"
                  style={{ marginRight: 5 }}
                  disabled={
                    userRoles !== "SuperAdmin" && !canClickOnEditUserGroupMember
                  }
                  onClick={() => handleEdit(params.row.userEmail, false)}
                  key={params.row.userEmail}
                >
                  <EditIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>

            <Tooltip
              title={
                userRoles !== "SuperAdmin" && !canClickOnDeleteUserGroupMember
                  ? "You do not have permission to access"
                  : "Delete"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  //onClick={handleClickOpenDelete}
                  disabled={
                    userRoles !== "SuperAdmin" &&
                    !canClickOnDeleteUserGroupMember
                  }
                  onClick={() => handleOpenDelete(params.row.userEmail)}
                  key={params.row.userEmail}
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

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [accessPermissions, setPermission] = useState([]);
  const { groupName } = useParams();
  const [openSections, setOpenSections] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [info,setInfo] = useState(null);
  const [isInfoMode, setIsInfoMode] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    userEmail: "",
    userRole: "",
    accessPermissions: [],
  });

  const [isViewMode, setIsViewMode] = useState(false);
  const [edituserMember, setEdituserMember] = useState(null);
  const [useremail, setUseremail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [accesspermissions, setAccesspermissions] = useState("");

  //RBAC
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userRoles = useSelector((state) => state.userRole);

  const canClickOnInfoUserGroupMember = permissions.includes(
    "canClickOnInfoUserGroupMember"
  );
  const canClickOnEditUserGroupMember = permissions.includes(
    "canClickOnEditUserGroupMember"
  );
  const canClickOnDeleteUserGroupMember = permissions.includes(
    "canClickOnDeleteUserGroupMember"
  );
  const canClickOnAddMembersInOwnUserGroup = permissions.includes(
    "canClickOnAddMembersInUserGroup"
  );


  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  //next functionality
  const handleNext = () => {
    setCheckedItems(initialFormData);
    if (!formData.userEmail) {
      setUseremail("User Email cannot be empty");
      return;
    } else {
      setUseremail("");
    }
    if (!formData.userRole) {
      setUserRole("User Role cannot be empty");
      return;
    } else {
      setUserRole("");
    }

    // Iterate over the formData.accessPermissions and check each checkbox
    formData.accessPermissions.forEach((permission) => {
      const checkbox = document.querySelector(`input[name="${permission}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  //back functionality
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //open the model form
  const handleClickOpen = () => {
    setIsDisabled(false);
    setIsViewMode(false);
    setIsInfoMode(false);
    setOpen(true);
    setEditData(null);
    setEdituserMember(null);
    setFormData(initialFormData);
    setCheckedItems(initialFormData);
  };

  //close the model form
  const handleClose = () => {
    reSet();
    setOpen(false);
  };

  // reSet is a helper function to reset the form and state variables to their initial state.
  const reSet = () => {
    setAccesspermissions("");
    setUseremail("");
    setUserRole("");
    setFormData(initialFormData);
    setActiveStep(0);
    setMessage(null);
  };

  useEffect(() => {
    getUserFromGroup();
    getRolesAndPermissions();
    rolePermissionsForUser();
  }, []);

  // getUserFromGroup function fetches the users from a group.
  const getUserFromGroup = async () => {
    try {
      await axios
        .get(`/sites/ugr/user/usersFromGroup/${groupName}`)
        .then((response) => {
          setUsers(response.data);
          console.log("data 13", response.data);
          setTimeout(() => {
            setIsLoading(false);
          }, 400); // 400ms delay
        });
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setUsers([]);
        setIsLoading(false); // Stop the loader
      } else {
        Swal.fire("Error", error.response.data);
      }
    }
    setIsLoading(false);
  };

  // Filter user groups in data-grid based on the search term
  const filteredUserGroups = users.filter(
    (userGroup) =>
      userGroup.groupName &&
      userGroup.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // getRolesAndPermissions function fetches the roles and permissions
  const getRolesAndPermissions = async () => {
    await axios
      .get(`/sites/rbac/rolesAndPermissions`)
      .then((response) => {
        setPermission(response.data);
        console.log("data 13", response.data);
      })
      .catch((error) => {
        Swal.fire("Error", error.response.data);
      });
  };

  // rolePermissionsForUser function fetches the roles and permissions for a user
  const rolePermissionsForUser = async (userEmail) => {
    await axios
      .get(`/sites/ugr/user/rolePermissionsForUser/${userEmail}`)
      .then((response) => {
        console.log("data info", response.data);
        // setUserRolePermissions(response.data);
        setFormData((prevFormData) => ({
          ...prevFormData,
          userRole: response.data.userRole || "",
          accessPermissions: response.data.accessPermissions || [],
        }));
      })
      .catch((err) => console.log(err));
  };

  //modal form to view the user details when clicked on Info button
  const handleInfo = (userEmail) => {
    setIsInfoMode(true);
    setMessage("You don't have permission to edit");
    const ViewUser = users.find((user) => user.userEmail === userEmail);
    if (ViewUser) {
      ViewUser.accessPermissions = ViewUser.accessPermissions || [];
      setInfo(ViewUser);
      setOpen(true);
      // setIsDisabled(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        userEmail: ViewUser.userEmail,
        userRole: ViewUser.userRole || "",
        accessPermissions: ViewUser.accessPermissions,
      }));
      // Call the rolePermissionsForUser function to get the role permissions for the user
      rolePermissionsForUser(ViewUser.userEmail);
    } else {
      console.error(`No user found with email: ${userEmail}`);
    }
    setIsDisabled(true);
  };

  //modal form to edit the user details when clicked on Edit button
  const handleEdit = (userEmail) => {
    setIsViewMode(true);
    setIsInfoMode(false);
    const editedUser = users.find((user) => user.userEmail === userEmail);
    setEdituserMember(userEmail);
    if (editedUser) {
      editedUser.accessPermissions = editedUser.accessPermissions || [];
      setEditData(editedUser);
      setOpen(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        userEmail: editedUser.userEmail,
        userRole: editedUser.userRole || "",
        accessPermissions: editedUser.accessPermissions,
      }));
      // Call the rolePermissionsForUser function to get the role permissions for the user
      rolePermissionsForUser(editedUser.userEmail);
    } else {
      console.error(`No user found with email: ${userEmail}`);
    }
    setIsDisabled(false);
  };

  const handleChange = async (event) => {
    const { name, value, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (name === "userEmail") {
      //email validation
      const emailRegex =
        /^[a-zA-Z0-9.!$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
    if (name === "userRole") {
      // Make an API call to get permissions for the selected role
      const response = await axios.get(
        `/sites/rbac/rolesAndPermissions?role_name=${value}`
      );
      const data = response.data;
      const permissions = data;
      //console.log("permissions",permissions)
      setFormData((prev) => ({ ...prev, accessPermissions: permissions }));
    }
  };

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

  // handleSubmit is triggered when the user submits the form.
  const handleSubmit = (event) => {
    setIsInfoMode(false);
    event.preventDefault();
    const formDataWithBase64 = {
      userEmail: formData.userEmail,
      userRole: formData.userRole,
      accessPermissions: formData.accessPermissions.filter(Boolean),
    };
    // Check if formData.accessPermissions is empty
    if (formDataWithBase64.accessPermissions.length === 0) {
      setAccesspermissions("Permissions cannot be empty");
      return; // Stop the function if there's an error
    } else {
      setAccesspermissions("");
    }
    if (edituserMember !== null) {
      axios
        .put(`sites/ugr/user/rolePermissionsForUser/${formData.userEmail}`, {
          userRole: formData.userRole,
          accessPermissions: formDataWithBase64.accessPermissions,
        })
        .then((response) => {
          console.log("Form data updated:", response.data);
          setFormData((prevFormData) => ({
            ...initialFormData,
            accessPermissions: formDataWithBase64.accessPermissions,
          }));
          setActiveStep(0);
          getUserFromGroup();
          setOpen(false);
          Swal.fire({
            icon: "success",
            title: "Updated successfully",
            text: response.data,
          });
        })
        .catch((error) => {
          setOpen(false);
          Swal.fire("Error", error.response.data);
        });
    } else {
      axios
        .put(`/sites/ugr/user/userToGroup/${groupName}`, formDataWithBase64)
        .then((response) => {
          console.log("Form data submitted:", response.data);
          setFormData(initialFormData);
          setActiveStep(0);
          getUserFromGroup();
          setOpen(false);
          Swal.fire({
            icon: "success",
            title: "Added successfully",
            text: response.data,
          });
        })
        .catch((error) => {
          setActiveStep(0);
          setOpen(false);
          Swal.fire("Error", error.response.data);
        });
    }
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

  //handleClickopen is a helper function to open and close the collapse
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
                onChange={handleChange}
                variant="filled"
                className=""
                InputProps={{
                  disableUnderline: true,
                  readOnly: isViewMode,
                }}
                disabled={isDisabled}
                error={!!emailError}
                helperText={emailError}
              />
              {useremail && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
                >
                  {useremail}
                </div>
              )}

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
                  onChange={handleChange}
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
              {userRole && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
                >
                  {userRole}
                </div>
              )}
              {message && <div style={{ color: "red" }}>{message}</div>}
            </Stack>
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
                                              checked={formData.accessPermissions.includes(
                                                permissionItem.Permission
                                              )}
                                              onChange={handleCheck}
                                              name={permissionItem.Permission}
                                              value={permissionItem.Permission}
                                              disabled={isDisabled}
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

            {accesspermissions && (
              <div
                style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
              >
                {accesspermissions}
              </div>
            )}
            {message && <div style={{ color: "red" }}>{message}</div>}
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  const handleOpenDelete = (userEmail) => {
    setUserEmail(userEmail);
    setOpen5(true);
  };

  const handleCloseDelete = () => {
    setOpen5(false);
  };

  const handleDelete = async () => {
    await axios
      .delete(`/sites/ugr/user/userFromGroup/${groupName}/${userEmail}`)
      .then((response) => {
        setOpen5(false);
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: response.data,
        });
        getUserFromGroup();
      })
      .catch((error) => {
        Swal.fire("Error", error.response.data);
      });
  };

  return (
    <ProjectSite_Layout>
      <BreadCrumbs />
      <>

        <DialogBox
          open={open5}
          onClose={handleCloseDelete}
          onDelete={handleDelete}
        />
        <ModelForm open={open} onClose={handleClose}>
          {activeStep === steps.length ? (
            <div></div>
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
                <React.Fragment></React.Fragment>
                <Typography>{getStepContent(activeStep)}</Typography>

                {/* <div className="mt-4">
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                  {activeStep === 0 ? (
                    <Button onClick={handleNext}>Next</Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isDisabled}>
                      Submit
                    </Button>
                  )}
                </div> */}
                <div className="mt-4">
                  {/* <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button> */}
                  {activeStep !== 0 && (
                    <Button onClick={handleBack}>Back</Button>
                  )}
                  {activeStep === 0 ? (
                    <Button onClick={handleNext}>Next</Button>
                  ) : (
                    !isInfoMode && (
                      <Button onClick={handleSubmit}>Submit</Button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
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
              {groupName}
            </Typography>

            <div className="parentContainer">
              <Stack direction="row" className="myStack my-0 mb-0 pt-2">
                {/* search box */}
                <div className="searchContainerDatagrid">
                  <OutlinedInput
                    className="dataGridSearch"
                    // value={searchTerm} // Assuming searchTerm is your state variable
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="search member..."
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
                <Tooltip
                  title={
                    userRoles !== "SuperAdmin" &&
                      !canClickOnAddMembersInOwnUserGroup
                      ? "You do not have permission "
                      : ""
                  }
                  arrow
                >
                  <span>
                    <Button
                      variant="contained"
                      onClick={handleClickOpen}
                      disabled={
                        userRoles !== "SuperAdmin" &&
                        !canClickOnAddMembersInOwnUserGroup
                      }
                      className={
                        userRoles !== "SuperAdmin" &&
                          !canClickOnAddMembersInOwnUserGroup
                          ? ""
                          : "button_color"
                      }
                      startIcon={<AddCircleIcon />}
                    >
                      New User
                    </Button>
                  </span>
                </Tooltip>
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
                  //rows={users}
                  hideFooterSelectedRowCount={true}
                  disableColumnSelector={true}
                  rows={users.filter((useremailid) =>
                    useremailid.userEmail
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )}
                  columns={columns}
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
                    width: "100%", // Set the width to a medium size
                    margin: "0 auto", // Center the DataGrid horizontally
                    border: "none", // Remove the border
                    //marginBottom: "16px", // Add some space at the bottom
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
      </>
    </ProjectSite_Layout>
  );
}
