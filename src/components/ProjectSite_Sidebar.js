import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from '@mui/material/Typography';
import sunEnergy from '../assets/Icons/sun-energy.png';
import {
  Users,
  Settings,
} from "react-feather";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Link, NavLink } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider } from "@mui/material/styles";

//css
import '../styles/Nav.css'
import '../styles/LayoutStyles.css'

//RBAC
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../features/permissions/permissionsSlice";
import { fetchrole } from "../features/permissions/userroleSlice";

const drawerWidth = 256;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));


export default function ProjectSite_Sidebar() {
  const theme = useTheme();
  const updateOpen = useAppStore((state) => state.updateOpen);
  const open = useAppStore((state) => state.dopen);

  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userRole = useSelector((state) => state.userRole);

  const getInitialState = (key) =>
    JSON.parse(localStorage.getItem(key)) || false;

  const canClickOnUserGroupsTabUnderRoleManager = permissions.includes(
    "canClickOnUserGroupsInRoleManagerSidePane"
  );

  const canClickonProjectsTab = permissions.includes(
    "canClickonProjectsInRoleManagerSidePane"
  );

  const canClickOnSettingsInSidePane = permissions.includes("canClickOnSettingsInSidePane");

  const canClickOnEnergyTradingInSidePane = permissions.includes("canClickOnEnergyTradingInSidePane");

  const canClickOnDeviceControllerInSidePane = permissions.includes("canClickOnDeviceControllerInSidePane");

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  const [isCollapse, setIsCollapse] = React.useState(
    getInitialState("isCollapse")
  );
  const [isCollapse1, setIsCollapse1] = React.useState(
    getInitialState("isCollapse1")
  );
  const [isCollapse2, setIsCollapse2] = React.useState(
    getInitialState("isCollapse2")
  );
  const [isCollapse3, setIsCollapse3] = React.useState(
    getInitialState("isCollapse3")
  );

  React.useEffect(() => {
    localStorage.setItem("isCollapse", JSON.stringify(isCollapse));
    localStorage.setItem("isCollapse1", JSON.stringify(isCollapse1));
    localStorage.setItem("isCollapse2", JSON.stringify(isCollapse2));
    localStorage.setItem("isCollapse3", JSON.stringify(isCollapse3));
  }, [isCollapse, isCollapse1, isCollapse2, isCollapse3]);

  
  const handleCollapse1 = () => {
    setIsCollapse1(!isCollapse1);
    if(isCollapse2){
      setIsCollapse2(false)
    }
    if(isCollapse3){
      setIsCollapse3(false)
    }
    if (!open) updateOpen(true);
  };

  const handleCollapse2 = () => {
    setIsCollapse2(!isCollapse2);
    if(isCollapse1){
      setIsCollapse1(false)
    }
    if(isCollapse3){
      setIsCollapse3(false)
    }
    if (!open) updateOpen(true);
  };
  
  const handleCollapse3 = () => {
    setIsCollapse3(!isCollapse3);
    if(isCollapse1){
      setIsCollapse1(false)
    }
    if(isCollapse2){
      setIsCollapse2(false)
    }
    if (!open) updateOpen(true);
  };

  React.useEffect(() => {
    if (!open) {
      setIsCollapse(false);
      setIsCollapse1(false);
      setIsCollapse2(false);
      setIsCollapse3(false);
    }
  }, [open]);

  const handleOpen = () => {
    updateOpen(!open);
    if (!open) {
      setIsCollapse(false);
      setIsCollapse1(false);
      setIsCollapse2(false);
      setIsCollapse3(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }} >
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleOpen}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>


        <List style={{ paddingTop: '20px' }} className="list-container">

          {/* Project Sites */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
          >
            <NavLink to="/project-sites" className="nav">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2,
                }}
              >
                <ThemeProvider theme={theme}>
                  <Tooltip
                    title="Project Sites"
                    placement="right"
                    disableHoverListener={open}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        ml: open ? "auto" : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {/* <Image /> */}
                      <ImageOutlinedIcon className="headersIcon" />
                      {/* <img src={location} alt="location" width="25" height="25"style={{filter: 'brightness(50) invert(.45)'}}  /> */}
                    </ListItemIcon>
                  </Tooltip>
                </ThemeProvider>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, }}>
                      Project Sites
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 0, fontWeight: 500 }}
                  className="Headers"
                />
              </ListItemButton>
            </NavLink>
          </ListItem>



          {/* ROLE MANAGER */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapse1}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2,
              }}
            >
              <Tooltip
                key={open}
                title="Role Manager"
                placement="right"
                disableHoverListener={open}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    ml: open ? "auto" : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Users className="headersIcon" />
                  {/* <img src={roleManger} alt="Role-manager" width="25" height="25"style={{filter: 'brightness(60) invert(.45) '}}   /> */}

                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#637381' }}>
                    Role Manager
                  </Typography>
                }
                sx={{ opacity: open ? 1 : 0 }}
              />
              {open && (isCollapse1 ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
            </ListItemButton>
          </ListItem>

          <Collapse in={isCollapse1} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NavLink to="/role-manager" className="nav">
                <ListItemButton sx={{ pl: 2 }}>
                  <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Home
                      </Typography>
                    } />
                </ListItemButton>
              </NavLink>

              {/*Users group */}
              <Tooltip
                title={
                  userRole !== "SuperAdmin" && !canClickOnUserGroupsTabUnderRoleManager
                    ? "You do not have permission "
                    : ""
                }
                arrow
              >
                <span>
                  {userRole === "SuperAdmin" || canClickOnUserGroupsTabUnderRoleManager ? (
                    <NavLink
                      to={`/user-groups`}
                      className="nav"
                    >
                      <ListItemButton sx={{ pl: 2 }}>
                        <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              User Groups
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </NavLink>
                  ) : (
                    <ListItemButton disabled sx={{ pl: 2 }}>
                      <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                      <ListItemText primary="User Groups" />
                    </ListItemButton>
                  )}
                </span>
              </Tooltip>

              {/* Projects */}
              <Tooltip
                title={
                  userRole !== "SuperAdmin" && !canClickonProjectsTab
                    ? "You do not have permission "
                    : ""
                }
                arrow
              >
                <span>
                  {userRole === "SuperAdmin" || canClickonProjectsTab ? (
                    <NavLink to={`/projects`} className='nav'>
                      <ListItemButton sx={{ pl: 2 }}>
                        <ListItemIcon>
                          {/* <ArticleIcon /> */}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              Projects
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </NavLink>
                  ) : (
                    <ListItemButton disabled sx={{ pl: 3 }}>
                      <ListItemIcon>
                        {/* <ArticleIcon /> */}
                      </ListItemIcon>
                      <ListItemText primary="Projects" />
                    </ListItemButton>
                  )}
                </span>
              </Tooltip>
            </List>
          </Collapse>



          {/*Energy Trading*/}
          {
            userRole === "SuperAdmin" || canClickOnEnergyTradingInSidePane ? (
              <>
                <ListItem
                  disablePadding
                  sx={{ display: "block" }}
                  onClick={handleCollapse3}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2,
                    }}
                  >
                    <Tooltip
                      key={open}
                      title="Energy Trading"
                      placement="right"
                      disableHoverListener={open}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          ml: open ? "auto" : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {/* <solarEnergy className="headersIcon" /> */}
                        <img src={sunEnergy} alt="Energy Trading" width="25" height="25" style={{ filter: 'brightness(50) invert(.45)' }} />

                      </ListItemIcon>
                    </Tooltip>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#637381' }}>
                          Energy Trading
                        </Typography>
                      }
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                    {open && (isCollapse3 ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                  </ListItemButton>
                </ListItem>



                <Collapse in={isCollapse3} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>

                    {/*Admin dashboard */}
                    <Tooltip
                      title={
                        userRole !== "SuperAdmin" && !canClickOnEnergyTradingInSidePane
                          ? "You do not have permission "
                          : ""
                      }
                      arrow
                    >
                      <span>
                        {userRole === "SuperAdmin" || canClickOnEnergyTradingInSidePane ? (
                          <NavLink
                            to={`/admin-dashboard`}
                            className="nav"
                          >
                            <ListItemButton sx={{ pl: 2 }}>
                              <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    Admin Dashboard
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </NavLink>
                        ) : (
                          <ListItemButton disabled sx={{ pl: 2 }}>
                            <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                            <ListItemText primary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Admin Dashboard
                              </Typography>
                            } />
                          </ListItemButton>
                        )}
                      </span>
                    </Tooltip>

                    {/* Projects */}
                    <Tooltip
                      title={
                        userRole !== "SuperAdmin" && !canClickOnEnergyTradingInSidePane
                          ? "You do not have permission "
                          : ""
                      }
                      arrow
                    >
                      <span>
                        {userRole === "SuperAdmin" || canClickOnEnergyTradingInSidePane ? (
                          <NavLink to={`/trading-view`} className='nav'>
                            <ListItemButton sx={{ pl: 2 }}>
                              <ListItemIcon>
                                {/* <ArticleIcon /> */}
                              </ListItemIcon>
                              <ListItemText primary={
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  Trading View
                                </Typography>
                              } />
                            </ListItemButton>
                          </NavLink>
                        ) : (
                          <ListItemButton disabled sx={{ pl: 2 }}>
                            <ListItemIcon>
                              {/* <ArticleIcon /> */}
                            </ListItemIcon>
                            <ListItemText primary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Trading View
                              </Typography>
                            } />
                          </ListItemButton>
                        )}
                      </span>
                    </Tooltip>

                    <Tooltip
                      title={
                        userRole !== "SuperAdmin" && !canClickOnEnergyTradingInSidePane
                          ? "You do not have permission "
                          : ""
                      }
                      arrow
                    >
                      <span>
                        {userRole === "SuperAdmin" || canClickOnEnergyTradingInSidePane ? (
                          <NavLink
                            to={`/profile-manager`}
                            className="nav"
                          >
                            <ListItemButton sx={{ pl: 2 }}>
                              <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                              <ListItemText primary={
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  Profile Manager
                                </Typography>
                              } />
                            </ListItemButton>
                          </NavLink>
                        ) : (
                          <ListItemButton disabled sx={{ pl: 2 }}>
                            <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                            <ListItemText primary="Profile Manager" />
                          </ListItemButton>
                        )}
                      </span>
                    </Tooltip>

                    <Tooltip
                      title={
                        userRole !== "SuperAdmin" && !canClickOnEnergyTradingInSidePane
                          ? "You do not have permission "
                          : ""
                      }
                      arrow
                    >
                      <span>
                        {userRole === "SuperAdmin" || canClickOnEnergyTradingInSidePane ? (
                          <NavLink
                            to={`/et-menu-1`}
                            className="nav"
                          >
                            <ListItemButton sx={{ pl: 2 }}>
                              <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                              <ListItemText primary={
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  ET Menu 1
                                </Typography>
                              } />
                            </ListItemButton>
                          </NavLink>
                        ) : (
                          <ListItemButton disabled sx={{ pl: 2 }}>
                            <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                            <ListItemText primary="ET Menu 1" />
                          </ListItemButton>
                        )}
                      </span>
                    </Tooltip>

                    <Tooltip
                      title={
                        userRole !== "SuperAdmin" && !canClickOnEnergyTradingInSidePane
                          ? "You do not have permission "
                          : ""
                      }
                      arrow
                    >
                      <span>
                        {userRole === "SuperAdmin" || canClickOnEnergyTradingInSidePane ? (
                          <NavLink
                            to={`/et-menu-2`}
                            className="nav"
                          >
                            <ListItemButton sx={{ pl: 2 }}>
                              <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                              <ListItemText primary={
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  ET Menu 2
                                </Typography>
                              } />
                            </ListItemButton>
                          </NavLink>
                        ) : (
                          <ListItemButton disabled sx={{ pl: 2 }}>
                            <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                            <ListItemText primary="ET Menu 2" />
                          </ListItemButton>
                        )}
                      </span>
                    </Tooltip>

                  </List>
                </Collapse>
              </>
            ) : (null)
          }

          {/* Settings */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapse2}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2,
              }}
            >
              <Tooltip
                key={open}
                title="Settings"
                placement="right"
                disableHoverListener={open}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    ml: open ? "auto" : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Settings className="headersIcon" />
                </ListItemIcon>
              </Tooltip>

              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#637381' }}>
                    Settings
                  </Typography>
                }
                sx={{ opacity: open ? 1 : 0 }}
              />
              {open && (isCollapse2 ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
            </ListItemButton>
          </ListItem>

          <Collapse in={isCollapse2} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/*Dashboard configurations */}
              <Tooltip
                title={
                  userRole !== "SuperAdmin" && !canClickOnSettingsInSidePane
                    ? "You do not have permission "
                    : ""
                }
                arrow
              >
                <span>
                  {userRole === "SuperAdmin" || canClickOnSettingsInSidePane ? (
                    <NavLink
                      to={`/dashboard-configurations`}
                      className="nav"
                    >
                      <ListItemButton sx={{ pl: 2 }}>
                        <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              Dashboard
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </NavLink>
                  ) : (
                    <ListItemButton disabled sx={{ pl: 2 }}>
                      <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                  )}
                </span>
              </Tooltip>

              {/*Project schematic configurations */}
              <Tooltip
                title={
                  userRole !== "SuperAdmin" && !canClickOnSettingsInSidePane
                    ? "You do not have permission "
                    : ""
                }
                arrow
              >
                <span>
                  {userRole === "SuperAdmin" || canClickOnSettingsInSidePane ? (
                    <NavLink
                      to={`/project-schematic-configurations`}
                      className="nav"
                    >
                      <ListItemButton sx={{ pl: 2 }}>
                        <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              Project Schematic
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </NavLink>
                  ) : (
                    <ListItemButton disabled sx={{ pl: 2 }}>
                      <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                      <ListItemText primary="Project Schematic" />
                    </ListItemButton>
                  )}
                </span>
              </Tooltip>

              {/*Device controller configurations */}
              {
                userRole === "SuperAdmin" || canClickOnDeviceControllerInSidePane ? (<>
                  <Tooltip
                    title={userRole !== "SuperAdmin" && !canClickOnDeviceControllerInSidePane ? "You do not have permission " : ""}
                    arrow
                  >
                    <span>
                      {userRole === "SuperAdmin" || canClickOnDeviceControllerInSidePane ? (
                        <NavLink
                          to={`/device-controller`}
                          className="nav"
                        >
                          <ListItemButton sx={{ pl: 2 }}>
                            <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  Device Controller
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </NavLink>
                      ) : (
                        <ListItemButton disabled sx={{ pl: 2 }}>
                          <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                          <ListItemText primary="Device Controller" />
                        </ListItemButton>
                      )}
                    </span>

                  </Tooltip>
                </>) : (null)
              }

            </List>
          </Collapse>

        </List>
      </Drawer>
    </Box>
  );
}
