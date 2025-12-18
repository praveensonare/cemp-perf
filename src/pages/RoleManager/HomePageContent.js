/*RoleManagerHomePage Component
 *
 * This component is responsible for rendering the Role Manager Home Page.
 * It fetches and displays a list of user groups and project sites.
 * It also provides a brief introduction to the Role Manager tool and its features.
 *
  Author : Arpana Meshram
  Date : 14-08-2023
   Revision:
         1.0 - 14-08-2023  : Development of React.JS code for Rolemanager- Home page.
         2.0 - 04-10-2023  : UI Modification Development: Change the Layout for Role Manager Home Page.
         3.0 - 12-12-2023  : API integration for Get UserGrouplist and Get projectlist in Role Manager Home Page.
         4.0 - 08-02-2024  : Add scrollbar in deviceHub Home page card design .
         5.0 - 15-03-2023  : comment added for each function and variable.
         6.0 - 05-04-2024  : Add Scrollbar on entity map card for all browser.
 
*/
import * as React from "react";
import "../../styles/home.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Unstable_Grid2";
import Swal from "sweetalert2";
import ProjectSite_Layout from "../../components/ProjectSite_Layout";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";
import { fetchUserGroups } from "../../features/permissions/usergroupSlice";
//import { fetchAssociatedProjects } from "../../features/permissions/userAssociatedProjectSlice";
import { Spin } from "antd";
import Loader from "../../components/common/LoaderDatagrid";
import CustomNoRowsOverlay from "../../components/common/CustomNoRowsOverlay";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const RoleManagerHomePage = () => {
  const [users, setUsers] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(true);
  //RBAC
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  //console.log("permissions", permissions);
  const userRole = useSelector((state) => state.userRole);
  const userGroupList = useSelector((state) => state.userGroups);
  console.log("userGroupList 74", userGroupList);
  //const AssociatedProject = useSelector((state) => state.AssociatedProject);
  //console.log("AssociatedProject home page", AssociatedProject);

  const canClickOnGuidedTourUnderWelcomeToRoleManagerInHomePage =
    permissions.includes("canClickOnGuidedTourInRoleManagerHomePage");
  const canViewAssociatedUserGroupOnly = permissions.includes(
    "canViewAssociatedUserGroupOnly"
  );

  const canViewProjectSiteForUserGroup = permissions.includes(
    "canViewProjectSiteForUserGroupOnly"
  );
  const columns = [
    {
      field: "groupName",
      headerName: "User Group",
      align: "left",
      headerAlign: "left",
      flex: 1.5,
      headerClassName: "header-project-name",
      renderCell: (params) => (
        <div className="datagridIcon_div" style={{ color: "#6a6a6a" }}>
          <div className="datagridIcon_img" style={{ marginRight: "12px" }}>
            <img src="../people.png" alt="profile" />
          </div>
          {params.value}
        </div>
      ),
    },
    {
      field: "projectSiteAlias",
      headerName: "Project Site Alias",
      align: "left",
      headerAlign: "left",
      flex: 1.5,
      filterable: false, // Ensure the column is filterable
      renderCell: (params) => {
        const projectSites = params.row.projectSites;

        if (!projectSites || projectSites.length === 0) {
          return <span>No project sites available</span>;
        }

        const displayedSites = projectSites
          .slice(0, 2)
          .map((site) => site.projectSiteAlias)
          .join(", ");

        return <span>{displayedSites}</span>;
      },
    },
    {
      field: "memberCount",
      headerName: "Members Count",
      align: "center",
      headerAlign: "center",
      flex: 0.7,
    },
  ];
  // This is an getProjectSites function that fetches project site data from the server.
  // This is an getProjectSites function that fetches project site data from the server.
  const getProjectSites = async () => {
    try {
      await axios.get("/sites/project/projectSites").then((response) => {
        console.log("Form data project data:", response.data);
        setProjectData(response.data);
        setIsLoading1(false);
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: JSON.stringify(error.response.data),
          });
          setProjectData([]);
          setIsLoading1(false);
        } else {
          Swal.fire("Error", error.response.data);
        }
      } else {
        // Handle the case where error.response is undefined
        console.error(error);
      }
    }
  };
  // * This is an getUserGruoups function that fetches user group data from the server
  const getUserGruoups = async () => {
    try {
      await axios.get("/sites/ugr/group/userGroups").then((response) => {
        console.log("Form data usergroup data:", response.data);
        setUsers(response.data);
        setTimeout(() => {
          setIsLoading(false);
        }, (400));
      });
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
  useEffect(() => {
    getUserGruoups();
  }, []);

  useEffect(() => {
    getProjectSites();
  }, []);

  // useEffect(() => {
  //   dispatch(fetchAssociatedProjects());
  // }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);


 

  return (
    <ProjectSite_Layout>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <box>
            <div className="cardbox p-4">
              <h4 className="borderBottom">Welcome to Role Manager</h4>

              <div class="cardHeight">
                <p>
                  Role Manager is a powerful tool that allows you to create user
                  groups, set and customize user roles, and provide access
                  control for different users within the groups.
                </p>
                <div className="List mt-3">
                  <ul>
                    <li><div>
                      <span className="listdesign"></span>User level action control</div></li>
                    <li><div><span className="listdesign"></span>Permission management</div></li>
                    <li><div><span className="listdesign"></span>Project creation & user management</div></li>
                  </ul>
                </div>
              </div>
              <div className="text-white">
                <Tooltip
                  title={
                    userRole !== "SuperAdmin" &&
                    !canClickOnGuidedTourUnderWelcomeToRoleManagerInHomePage
                      ? "You do not have permission to access this page"
                      : ""
                  }
                  arrow
                >
                  <span>
                    <Link to={`/guided-tour`} underline="none">
                      <Button
                        variant="contained"
                        className="w-100"
                        style={{
                          backgroundColor: "rgb(8 100 191 / 89%)",
                          color: "#fff",
                        }}
                        size="sm"
                        disabled={
                          userRole !== "SuperAdmin" &&
                          !canClickOnGuidedTourUnderWelcomeToRoleManagerInHomePage
                        }
                      >
                        Guided Tour
                      </Button>
                    </Link>
                  </span>
                </Tooltip>
              </div>
            </div>
          </box>
        </Grid>
        <Grid xs={12} sm={6}>
          <box>
            <div className="cardbox p-4">
              <h4 className="borderBottom">Projects</h4>

              <div className="cardHeight">
                <ul className="p-0 mb-0">
                  {isLoading1 ? (
                    <div style={{ position: "relative", top: "120px" }}>
                      <Loader />
                    </div>
                  ) : (
                    (userRole === "SuperAdmin"
                      ? projectData
                      : canViewProjectSiteForUserGroup &&
                        userGroupList &&
                        userGroupList.length > 0
                      ? projectData.filter((project) =>
                          userGroupList
                            .flatMap((group) => group.projectSites)
                            .some(
                              (associatedProject) =>
                                associatedProject.projectSiteName ===
                                project.projectSiteName
                            )
                        )
                      : projectData
                    ).map((project) => (
                      <li key={project.id} className="Projectlist">
                        <div className="d-flex">
                          <div>
                            <img
                              src={`data:image/jpeg;base64,${project.siteImage}`}
                              className="Imground"
                            />
                          </div>
                          <div className="Projectlistname">
                            <p className="textname">
                              {project.projectSiteAlias}{" "}
                            </p>
                            <span className="textsmall">
                            <img src="./location.png" height={18} /> {project.projectLocation}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </box>
        </Grid>
        <Grid xs={12} sm={12}>
          <box>
            <div className="cardbox-table p-4">
              <div className="d-flex justify-content-between mb-3">
                <h5>My User Groups</h5>
              </div>

              <div
                style={{ height: "359px", width: "100%", marginTop: "-9px" , position:"relative"}}
              >
                <DataGrid
                  hideFooterSelectedRowCount={true}
                  disableColumnSelector={true}
                  rows={
                    userRole !== "SuperAdmin" || canViewAssociatedUserGroupOnly
                      ? userGroupList
                      : users
                  }
                  // rows={users}
                  columns={columns}
                  components={{
                    NoRowsOverlay: isLoading ? () => null : CustomNoRowsOverlay,
                  }}
                  // loading={loading}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  getRowId={(row) =>row?.groupName? row.groupName :row.projectSiteName  }
                  pageSizeOptions={[5, 10]}
                  className="data-grid"
                  role="grid"
                  rowHeight={50}
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
                    "& .header-project-name .MuiDataGrid-columnHeaderTitle": {
                      marginLeft: "35px", // Add desired margin-left for Project Name header label
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
    </ProjectSite_Layout>
  );
};
export default RoleManagerHomePage;
