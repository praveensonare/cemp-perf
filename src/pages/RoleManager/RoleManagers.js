import React from "react";
import ProjectSite_Layout from "../../components/ProjectSite_Layout";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";
import Swal from "sweetalert2";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { DialogContentText, DialogActions } from "@mui/material";
import { CircularProgress } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";
import { fetchUserGroups } from "../../features/permissions/usergroupSlice";
import CustomNoRowsOverlay from "../../components/common/CustomNoRowsOverlay";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Loader from "../../components/common/LoaderDatagrid";

//css
import "../../styles/Datatable.css";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const RoleManagerss = () => {
  const [existingGroupNames, setExistingGroupNames] = useState([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [open5, setOpen5] = React.useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projectSites, setProjectSites] = useState([]);
  const [selectedProjectSite, setSelectedProjectSite] = useState(null);
  const [selectedProjectSites, setSelectedProjectSites] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [creatingMode, setCreatingMode] = useState(false);
  const [groupNameError, setGroupNameError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);

  //RBAC
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userGroupList = useSelector((state) => state.userGroups);
  const userRole = useSelector((state) => state.userRole);

  const canClickOnInfoUserGroup = permissions.includes(
    "canClickOnInfoUserGroup"
  );
  const canClickOnEditUserGroup = permissions.includes(
    "canClickOnEditUserGroup"
  );
  const canClickOnDeleteUserGroup = permissions.includes(
    "canClickOnDeleteUserGroup"
  );
  const canClickOnCreateUserGroup = permissions.includes(
    "canClickOnCreateUserGroup"
  );
  const canClickOnUserGroupName = permissions.includes(
    "canClickOnUserGroupName"
  );
  const canViewAssociatedUserGroupOnly = permissions.includes(
    "canViewAssociatedUserGroupOnly"
  );

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);


  const columns = [
    {
      field: "groupName",
      headerName: "User Group",
      headerClassName: 'header-project-name', // Assign custom class
      flex: 1,
      renderCell: (params) => {
        const UserGName = params.row.groupName;
        return userRole === "SuperAdmin" || canClickOnUserGroupName ? (
          <Link to={`/user-groups/${UserGName}`} className="datagridIcon_div">
            <div className="datagridIcon_img" style={{ marginRight: "9px" }}>
              <img src="./people.png" />
            </div>

            {params.row.groupName}
          </Link>
        ) : (
          <Tooltip title={"You do not have permission"} arrow>
            <span style={{ opacity: 0.4 }} className="datagridIcon_div">
              <div className="datagridIcon_img" style={{ marginRight: "9px" }}>
                <img src="./people.png" />
              </div>
              {params.row.groupName}
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "projectSites",
      headerName: "Project Sites",
      // headerAlign: 'center',
      // align: 'center',
      filterable: false,
      flex: 0.8,
      renderCell: (params) => {
        const projectSites = params.row.projectSites;

        if (!projectSites || projectSites.length === 0) {
          return <span>No project sites available</span>;
        }

        let displayedSites = projectSites
          .map((site) => {
            let alias = site.projectSiteAlias;
            // Limit each alias to 15 characters
            alias = alias.length > 15 ? alias.substring(0, 15) + "...." : alias;
            return alias;
          })
          .join(",  ");

        // Add "..." at the end if the combined length of the project site names exceeds 30 characters
        displayedSites =
          displayedSites.length > 30
            ? displayedSites.substring(0, 30) + "...."
            : displayedSites;

        return (
          <span>
            <Link
              onClick={() => handleEdit(params.row.groupName, true)}
              style={{ color: "#667085", textDecoration: "none" }}
            >
              {displayedSites}
            </Link>
          </span>
        );
      },
    },
    {
      field: "memberCount",
      headerName: "Members Count",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      filterable:false,
      flex: 0.7,
      renderCell: (params) => {
        // const groupName = params.rows.groupName;
        let groupName1 = params.row.groupName;
        return (
          <div style={{ textAlign: "right" }}>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickOnInfoUserGroup
                  ? "You do not have permission"
                  : "Info"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  key={groupName1}
                  className="info-button"
                  disabled={
                    userRole !== "SuperAdmin" && !canClickOnInfoUserGroup
                  }
                  onClick={() => handleEdit(params.row.groupName, true)}
                  role="info-button"
                >
                  <InfoIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>

            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickOnEditUserGroup
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
                  onClick={() => handleEdit(params.row.groupName, false)}
                  disabled={
                    userRole !== "SuperAdmin" && !canClickOnEditUserGroup
                  }
                  key={params.row.groupName}
                  className="edit-button"
                  style={{ marginRight: 4 }}
                  role="edit-button"
                >
                  <EditIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>

            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickOnDeleteUserGroup
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
                  disabled={
                    userRole !== "SuperAdmin" && !canClickOnDeleteUserGroup
                  }
                  className="delete-button"
                  onClick={() => handleOpenDelete(params.row.groupName)}
                  key={params.row.groupName}
                  data-testid="delete-button"
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


  const getUserGroup = async () => {
    try {
      let response = await axios.get("/sites/ugr/group/userGroups");
      const existingGroupNames = response.data.map((group) => group.groupName);
      setExistingGroupNames(existingGroupNames);
      for (let i = 0; i < response.data.length; i++) {
        response.data[i]["id"] = i;
      }
      // console.log("line 44", response.data);
      setUsers(response.data.reverse());
      // Use setTimeout to introduce a delay before setting isLoading to false
      setTimeout(() => {
        setIsLoading(false);
      }, 400); // 400ms delay
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
        // Handle the case where error.response is undefined
        console.error(error);
      }
    }
  };

  // Filter user groups in data-grid based on the search term
  const filteredUserGroups = users.filter(
    (userGroup) =>
      userGroup.groupName &&
      userGroup.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDelete = (groupName) => {
    setSelectedProject(groupName);
    setOpen5(true);
  };

  const handleCloseDelete = () => {
    setOpen5(false);
  };

  const projectSitesApi = async () => {
    let response = await axios.get("/sites/project/projectSites");
    // setProjectSite(response.data)
    setProjectSites(response.data);
    // setUsers(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getUserGroup();
  }, []);

  useEffect(() => {
    projectSitesApi();
  }, []);

  const handleGroupNameChange = (e) => {
    const groupNameValue = e.target.value;
    setGroupName(groupNameValue);

    // Clear the error message when the user starts typing
    if (groupNameValue !== "") {
      setGroupNameError("");
    }

    // Check for special characters
    const specialCharRegex = /[^a-zA-Z0-9_]/g; // Regex to match any character that is not a letter, number, or underscore
    if (specialCharRegex.test(groupNameValue)) {
      setValidationMessage(
        "Group name can only contain letters, numbers, and underscores."
      );
      return;
    }

    if (existingGroupNames.includes(groupNameValue)) {
      setValidationMessage(
        "Group name already exists, please choose a different name"
      );
    } else {
      setValidationMessage("");
    }
  };

  const handleProjectSiteChange = (event, newValue) => {
    setSelectedProjectSites(newValue);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios
        .delete(`/sites/ugr/group/${selectedProject}`)
        .then((response) => {
          // Swal.fire("success", response.data);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: response.data,
          });
          getUserGroup();
          setOpen5(false);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error) {
            Swal.fire("Error", error.response.data);
          } else {
            console.error("Error deleting user group:", error);
          }
        });
    } catch (error) {
      console.error("Error", error);
      Swal.fire("Error", error.response.data);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleEdit = async (groupName, viewMode) => {
    const groupToEdit = users.find((user) => user.groupName === groupName);
    if (groupToEdit) {
      setEditMode(!viewMode);
      setViewMode(viewMode);
      setCreatingMode(false);
      setEditingGroup(groupToEdit);
      // Populate the form fields with the data being edited
      setGroupName(groupToEdit.groupName);
      setSelectedProjectSites(groupToEdit.projectSites);
    }
    handleClickOpen();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGroupName(event.target.value);
    // Check if groupName is empty
    if (groupName === "") {
      setGroupNameError("User Group name is required");
      return; // Stop the function here
    }
    if (event.target.value !== "") {
      setGroupNameError("");
    }
    // Clear the error message
    if (viewMode) {
      handleClose();
    } else if (editMode) {
      try {
        const data = {
          projectSites: selectedProjectSites.map((site) => ({
            projectSiteName: site.projectSiteName,
            projectSiteAlias: site.projectSiteAlias,
          })),
        };

        const response = await axios.put(
          `/sites/ugr/group/${editingGroup.groupName}`,
          data
        );
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.groupName === editingGroup.groupName ? response.data : user
          )
        );
        Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text: response.data,
        });
        console.log("Form data updated:", response.data);
        getUserGroup();
        setGroupName("");
        setSelectedProjectSites([]);
        handleClose();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", error.response.data);
      }
    } else {
      // Handle the create scenario
      if (existingGroupNames.includes(groupName)) {
        setValidationMessage(
          "Group name already exists, please choose a different name"
        );
      } else {
        setValidationMessage("");

        try {
          const data = {
            projectSites: selectedProjectSites.map((site) => ({
              projectSiteName: site.projectSiteName,
              projectSiteAlias: site.projectSiteAlias,
            })),
          };

          const response = await axios.post(
            `/sites/ugr/group/${groupName}`,
            data
          );
          setUsers((prevUsers) => [...prevUsers, response.data]);

          Swal.fire({
            icon: "success",
            title: "Added successfully",
            text: response.data,
          });

          console.log("Form data submitted:", response.data);

          getUserGroup();
          setGroupName("");
          setSelectedProjectSites([]);
          handleClose();
        } catch (error) {
          console.error(error);
          setOpen(false);
          Swal.fire("Error", error.response.data);
          Swal.fire("Error", error.message);
        }
      }
    }
  };

  const handleClose = () => {
    if (editMode) {
      const hasChanges =
        groupName !== editingGroup.groupName ||
        !arraysEqual(selectedProjectSites, editingGroup.projectSites);

      if (hasChanges) {
        setCreatingMode(false);
        setEditMode(false);
        setEditingGroup(null);
      }
      handleReset();
    } else {
      setGroupName("");
      setSelectedProjectSites([]);
      setCreatingMode(false);
    }

    // Reset the viewMode and editMode states
    setViewMode(false);
    setGroupNameError("");
    setEditMode(false);
    setValidationMessage("");
    setOpen(false);
  };

  function arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

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

  const handleReset = () => {
    // Reset the form fields
    setGroupName("");
    setGroupNameError("");
    setSelectedProjectSites([]);
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

  return (
    <ProjectSite_Layout>
      <>
        {/* Delete popup */}
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

        {/* modal form */}
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
              ? "View User Group"
              : editMode
                ? "Update User Group"
                : "Create User Group"}
          </DialogTitle>
          <DialogContent>
            <Box
              component="form"
              sx={{ width: "384px" }}
              noValidate
              autoComplete="off"
            // onSubmit={e => onSubmit(e)}
            >
              <div className="userdetail">
                <p>Group Details</p>
                <Stack
                  component="form"
                  sx={{ width: "100%" }}
                  spacing={2.3}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    variant="filled"
                    id="outlined-basic"
                    label="User Group name"
                    className=""
                    InputProps={{
                      disableUnderline: true,
                      // disabled: editData !== null,
                      inputProps: {
                        maxLength: 100,
                      },
                    }}
                    name="UserGroup"
                    value={groupName}
                    onChange={handleGroupNameChange}
                    disabled={viewMode || (editMode && !creatingMode)}
                    required
                  />
                  {groupNameError && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {groupNameError}
                    </div>
                  )}
                  {validationMessage && (
                    <div style={{ color: "red" }}>{validationMessage}</div>
                  )}

                  <Autocomplete
                    multiple
                    id="project-sites"
                    variant="filled"
                    name="Projectsite"
                    options={projectSites.filter(
                      (option) =>
                        !selectedProjectSites.find(
                          (value) =>
                            value.projectSiteName === option.projectSiteName
                        )
                    )}
                    getOptionLabel={(option) => option.projectSiteName || ""}
                    onChange={handleProjectSiteChange}
                    value={selectedProjectSites}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project Sites"
                        varient="filled"
                        required
                        disabled={viewMode}
                      />
                    )}
                    disabled={viewMode}
                  />

                  {!viewMode && (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={handleSubmit}
                    >
                      {/* {editMode ? 'Submit' : 'Submit'} */}
                      submit
                    </button>
                  )}
                </Stack>
              </div>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Card for data grid */}
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
              My User Groups
            </Typography>
            <div className="parentContainer">
              {/* stack for search box and button */}
              <Stack direction="row" className="myStack my-0 mb-0 pt-2">
                {/* search box */}
                <div className="searchContainerDatagrid">
                  <OutlinedInput
                    className="dataGridSearch"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="search user group..."
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

                {/* button */}
                <Tooltip
                  title={
                    userRole !== "SuperAdmin" && !canClickOnCreateUserGroup
                      ? "You do not have permission to access"
                      : ""
                  }
                  arrow
                >
                  <span>
                    <Button
                      variant="contained"
                      onClick={handleClickOpen}
                      disabled={
                        userRole !== "SuperAdmin" &&
                        !canClickOnCreateUserGroup
                      }
                      sx={{ padding: "8px 15px", textTransform: "none" }}
                      className={
                        userRole !== "SuperAdmin" &&
                          !canClickOnCreateUserGroup
                          ? ""
                          : "button_color"
                      }
                      startIcon={<AddCircleIcon />}
                    >
                      Create User Group
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
                  position: "relative",
                }}
              >
                <DataGrid
                  rows={(userRole === "SuperAdmin" ||
                    !canViewAssociatedUserGroupOnly
                    ? filteredUserGroups
                    : userGroupList
                  ).filter((userGroup) =>
                    userGroup.groupName
                      ? userGroup.groupName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                      : false
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
                  getRowId={(row) =>row.groupName}
                  pageSizeOptions={[5, 10]}
                  className="data-grid"
                  disabled={editMode}
                  disableColumnSelector={true}
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
                    "& .MuiTablePagination-selectLabel": {
                      fontSize: "14px", // Change this to your desired font size
                      fontWeight: "400", // Change this to your desired font weight
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

export default RoleManagerss;
