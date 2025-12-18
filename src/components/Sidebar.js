/* This is implementation of sidebar for the application after entering a project site. It contains the links to the different pages of the application such as device hub, company profile, status and dashboard. It basically has navigation to pages which are project site specific.
  Author : Shweta Vyas    
*/
import * as React from "react";
import { useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
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
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined";
import LanOutlinedIcon from "@mui/icons-material/LanOutlined";

import {
  Users,
  Battery,
  Image,
  Trello,
  Settings,
  Sidebar,
  Headphones,
  LogOut,
} from "react-feather";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

// import awsExports from '../aws-exports'
import { Amplify } from "aws-amplify";
import { Link, NavLink } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { ProjectContext } from "../ProjectContext";
//css
import "../styles/Nav.css";
import "../styles/LayoutStyles.css";

//RBAC
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../features/permissions/permissionsSlice";
import { fetchrole } from "../features/permissions/userroleSlice";

Amplify.configure({
  Auth: {
    region: window.REACT_APP_REGION,
    userPoolId: window.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: window.REACT_APP_USER_POOL_APP_CLIENT_ID,
  },
});

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

export default function SideBar() {
  const { projectSiteName } = useContext(ProjectContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const updateOpen = useAppStore((state) => state.updateOpen);
  const open = useAppStore((state) => state.dopen);
  const getInitialState = (key) =>
    JSON.parse(localStorage.getItem(key)) || false;

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

  //handles state of different collapsible sections.
  // const handleCollapse = () => {
  //   setIsCollapse(!isCollapse);
  //   if (!open) updateOpen(true);
  // }
  // const handleCollapse1 = () => {
  //   setIsCollapse1(!isCollapse1);
  //   if (!open) updateOpen(true);
  // }
  const handleCollapse2 = () => {
    setIsCollapse2(!isCollapse2);
    if(isCollapse3){
      setIsCollapse3(false);
    }
    if (!open) updateOpen(true);
  };
  const handleCollapse3 = () => {
    setIsCollapse3(!isCollapse3);
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

  //RBAC
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userRole = useSelector((state) => state.userRole);
  const canClickonSensorTab = permissions.includes(
    "canClickOnSensorInDeviceHubSidePane"
  );
  const canClickonGatewayTab = permissions.includes(
    "canClickonGatewayInDeviceHubSidePane"
  );
  const canClickonEntityMapTab = permissions.includes(
    "canClickonEntityMapInDeviceHubSidePane"
  );
  const canClickonDashboardTab = permissions.includes(
    "canClickOnDashboardInSidePane"
  );
  const canClickonProjectSchematicInSidePane = permissions.includes(
    "canClickOnProjectSchematicInSidePane"
  );
  const canClickOnDeviceHubInSidePane = permissions.includes(
    "canClickOnDeviceHubInSidePane"
  );

  const canClickOnDeviceETHubInSidePane = permissions.includes(
    "canClickOnDeviceETHubInSidePane"
  );
  const canClickOnAlarmsInSidePane =permissions.includes(
    "canClickOnAlarmsInSidePane"
  );

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleOpen} data-testid="open-button">
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        {/* <Divider style={{ backgroundColor: '#000000', height: 2 }} /> */}

        <List style={{ paddingTop: "20px" }} className="list-container">
          {/* Status */}
          <Tooltip
            title={
              userRole !== "SuperAdmin" && !canClickonProjectSchematicInSidePane
                ? "You do not have permission"
                : ""
            }
            arrow
          >
            <span>
              {userRole === "SuperAdmin" ||
              canClickonProjectSchematicInSidePane ? (
                <ListItem disablePadding sx={{ display: "block" }}>
                  <NavLink
                    to={`/project-sites/${projectSiteName}/schematic-status`}
                    className="nav"
                  >
                    <ListItemButton
                      data-testid="project-schematic-button"
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2,
                      }}
                    >
                      <Tooltip
                        title="Project Schematic"
                        placement="right"
                        disableHoverListener={open}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            ml: open ? "auto" : "auto", // Adjust this value as needed
                            justifyContent: "center",
                          }}
                        >
                          {/* <Battery className="headersIcon" /> */}
                          <LanOutlinedIcon className="headersIcon" />
                        </ListItemIcon>
                      </Tooltip>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: "#637381" }}
                          >
                            Project Schematic
                          </Typography>
                        }
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </NavLink>
                </ListItem>
              ) : (
                <ListItem disablePadding sx={{ display: "block" }}>
                  <NavLink
                    to={`/project-sites/${projectSiteName}/status`}
                    className="nav"
                    style={{ pointerEvents: "none", opacity: "0.4" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2,
                      }}
                    >
                      <Tooltip
                        title="Project Schematic"
                        placement="right"
                        disableHoverListener={open}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            ml: open ? "auto" : "auto", // Adjust this value as needed
                            justifyContent: "center",
                          }}
                        >
                          <Battery className="headersIcon" />
                        </ListItemIcon>
                      </Tooltip>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: "#637381" }}
                          >
                            Project Schematic
                          </Typography>
                        }
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </NavLink>
                </ListItem>
              )}
            </span>
          </Tooltip>

          {/* Device Hub */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={handleCollapse3}
            data-testid="collapse3-button"
          >
            <ListItemButton
              data-testid="device-hub-button"
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2,
              }}
            >
              <Tooltip
                key={open}
                title="Device Hub"
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
                  <Trello />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, color: "#637381" }}
                  >
                    Device Hub
                  </Typography>
                }
                sx={{ opacity: open ? 1 : 0 }}
              />
              {open && (isCollapse3 ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
            </ListItemButton>
          </ListItem>

          {/* sub menus for device hub */}
          <Collapse in={isCollapse3} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* device hub- home page */}
              <Tooltip
                title={
                  userRole !== "SuperAdmin" && !canClickOnDeviceHubInSidePane
                    ? "You do not have permission"
                    : ""
                }
                arrow
              >
                <span>
                  {userRole === "SuperAdmin" ||
                  canClickOnDeviceHubInSidePane ? (
                    <NavLink
                      to={`/project-sites/${projectSiteName}/device-hub`}
                      className="nav"
                    >
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500, color: "#637381" }}
                            >
                              Home
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </NavLink>
                  ) : (
                    <ListItemButton disabled sx={{ pl: 4 }}>
                      <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: "#637381" }}
                          >
                            Home
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  )}
                </span>
              </Tooltip>

              {/* <NavLink to={`/project-sites/${projectSiteName}/device-hub`} className='nav'>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </NavLink> */}
              {/* Sensors */}
              {/* <NavLink to={`/project-sites/${projectSiteName}/sensors`} className='nav'>
                <ListItemButton sx={{ pl: 4 }} onClick={() => { navigate("/sensors") }}>
                  <ListItemIcon>
                  </ListItemIcon>
                  <ListItemText primary="Sensor" />
                </ListItemButton>
              </NavLink> */}
              <Tooltip
                title={
                  userRole !== "SuperAdmin" && !canClickonSensorTab
                    ? "You do not have permission"
                    : ""
                }
                arrow
              >
                <span>
                  {userRole === "SuperAdmin" || canClickonSensorTab ? (
                    <NavLink
                      to={`/project-sites/${projectSiteName}/sensors`}
                      className="nav"
                    >
                      <ListItemButton
                        sx={{ pl: 4 }}
                        onClick={() => {
                          navigate("/sensors");
                        }}
                        data-testid="sensors-button"
                      >
                        <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500, color: "#637381" }}
                            >
                              Sensor
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </NavLink>
                  ) : (
                    <ListItemButton disabled sx={{ pl: 4 }}>
                      <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: "#637381" }}
                          >
                            Sensor
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  )}
                </span>
              </Tooltip>
              {/* entity map */}
              {/* <NavLink to={`/project-sites/${projectSiteName}/entity-map`} className='nav'>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                 
                  </ListItemIcon>
                  <ListItemText primary="Entity Map" />
                </ListItemButton>
              </NavLink> */}

              <Tooltip
                title={
                  userRole !== "SuperAdmin" && !canClickonEntityMapTab
                    ? "You do not have permission"
                    : ""
                }
                arrow
              >
                <span>
                  {userRole === "SuperAdmin" || canClickonEntityMapTab ? (
                    <NavLink
                      to={`/project-sites/${projectSiteName}/entity-map`}
                      className="nav"
                    >
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500, color: "#637381" }}
                            >
                              Entity Map
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </NavLink>
                  ) : (
                    <ListItemButton disabled sx={{ pl: 4 }}>
                      <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: "#637381" }}
                          >
                            Entity Map
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  )}
                </span>
              </Tooltip>

              {/* Gateway */}
              {/* <NavLink to={`/project-sites/${projectSiteName}/gateways`} className='nav'>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    
                  </ListItemIcon>
                  <ListItemText primary="Gateway" />
                </ListItemButton>
              </NavLink> */}

              <Tooltip
                title={
                  userRole !== "SuperAdmin" && !canClickonGatewayTab
                    ? "You do not have permission"
                    : ""
                }
                arrow
              >
                <span>
                  {userRole === "SuperAdmin" || canClickonGatewayTab ? (
                    <NavLink
                      to={`/project-sites/${projectSiteName}/gateways`}
                      className="nav"
                    >
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon></ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500, color: "#637381" }}
                            >
                              Gateway
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </NavLink>
                  ) : (
                    <ListItemButton disabled sx={{ pl: 4 }}>
                      <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: "#637381" }}
                          >
                            Gateway
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  )}
                </span>
              </Tooltip>
            </List>
          </Collapse>

          {/* ET Hub */}
          {userRole === "SuperAdmin" || canClickOnDeviceETHubInSidePane ? (
            <>
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
                    title="ET Hub"
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
                      <EnergySavingsLeafOutlinedIcon />
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: "#637381" }}
                      >
                        ET Hub
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                  {open &&
                    (isCollapse2 ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                </ListItemButton>
              </ListItem>

              {/* sub menus for ET hub */}
              <Collapse in={isCollapse2} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Tooltip
                    title={
                      userRole !== "SuperAdmin" &&
                      !canClickOnDeviceETHubInSidePane
                        ? "You do not have permission"
                        : ""
                    }
                    arrow
                  >
                    <span>
                      {userRole === "SuperAdmin" ||
                      canClickOnDeviceETHubInSidePane ? (
                        <NavLink
                          to={`/project-sites/${projectSiteName}/marketplace`}
                          className="nav"
                        >
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500, color: "#637381" }}
                                >
                                  Marketplace
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </NavLink>
                      ) : (
                        <ListItemButton disabled sx={{ pl: 4 }}>
                          <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, color: "#637381" }}
                              >
                                Marketplace
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      )}
                    </span>
                  </Tooltip>

                  <Tooltip
                    title={
                      userRole !== "SuperAdmin" &&
                      !canClickOnDeviceETHubInSidePane
                        ? "You do not have permission"
                        : ""
                    }
                    arrow
                  >
                    <span>
                      {userRole === "SuperAdmin" ||
                      canClickOnDeviceETHubInSidePane ? (
                        <NavLink
                          to={`/project-sites/${projectSiteName}/wallet`}
                          className="nav"
                        >
                          <ListItemButton
                            sx={{ pl: 4 }}
                            onClick={() => {
                              navigate("/sensors");
                            }}
                            data-testid="sensors-button"
                          >
                            <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500, color: "#637381" }}
                                >
                                  Wallet
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </NavLink>
                      ) : (
                        <ListItemButton disabled sx={{ pl: 4 }}>
                          <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, color: "#637381" }}
                              >
                                Wallet
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      )}
                    </span>
                  </Tooltip>

                  <Tooltip
                    title={
                      userRole !== "SuperAdmin" &&
                      !canClickOnDeviceETHubInSidePane
                        ? "You do not have permission"
                        : ""
                    }
                    arrow
                  >
                    <span>
                      {userRole === "SuperAdmin" ||
                      canClickOnDeviceETHubInSidePane ? (
                        <NavLink
                          to={`/project-sites/${projectSiteName}/my-transactions`}
                          className="nav"
                        >
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500, color: "#637381" }}
                                >
                                  My Transactions
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </NavLink>
                      ) : (
                        <ListItemButton disabled sx={{ pl: 4 }}>
                          <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, color: "#637381" }}
                              >
                                My Transactions
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      )}
                    </span>
                  </Tooltip>

                  <Tooltip
                    title={
                      userRole !== "SuperAdmin" &&
                      !canClickOnDeviceETHubInSidePane
                        ? "You do not have permission"
                        : ""
                    }
                    arrow
                  >
                    <span>
                      {userRole === "SuperAdmin" ||
                      canClickOnDeviceETHubInSidePane ? (
                        <NavLink
                          to={`/project-sites/${projectSiteName}/my-profile`}
                          className="nav"
                        >
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500, color: "#637381" }}
                                >
                                  My Profile
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </NavLink>
                      ) : (
                        <ListItemButton disabled sx={{ pl: 4 }}>
                          <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, color: "#637381" }}
                              >
                                My Profile
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      )}
                    </span>
                  </Tooltip>
                  <Tooltip
                    title={
                      userRole !== "SuperAdmin" &&
                      !canClickOnDeviceETHubInSidePane
                        ? "You do not have permission"
                        : ""
                    }
                    arrow
                  >
                    <span>
                      {userRole === "SuperAdmin" ||
                      canClickOnDeviceETHubInSidePane ? (
                        <NavLink
                          to={`/project-sites/${projectSiteName}/et-hub-menu-1`}
                          className="nav"
                        >
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500, color: "#637381" }}
                                >
                                  ET Hub Menu 1
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </NavLink>
                      ) : (
                        <ListItemButton disabled sx={{ pl: 4 }}>
                          <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, color: "#637381" }}
                              >
                                ET Hub Menu 1
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      )}
                    </span>
                  </Tooltip>
                  <Tooltip
                    title={
                      userRole !== "SuperAdmin" &&
                      !canClickOnDeviceETHubInSidePane
                        ? "You do not have permission"
                        : ""
                    }
                    arrow
                  >
                    <span>
                      {userRole === "SuperAdmin" ||
                      canClickOnDeviceETHubInSidePane ? (
                        <NavLink
                          to={`/project-sites/${projectSiteName}/et-hub-menu-2`}
                          className="nav"
                        >
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500, color: "#637381" }}
                                >
                                  ET Hub Menu 2
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </NavLink>
                      ) : (
                        <ListItemButton disabled sx={{ pl: 4 }}>
                          <ListItemIcon>{/* <ArticleIcon /> */}</ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500, color: "#637381" }}
                              >
                                ET Hub Menu 2
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      )}
                    </span>
                  </Tooltip>
                </List>
              </Collapse>
            </>
          ) : null}

          {/* Dashboard */}
          <ListItem disablePadding sx={{ display: "block" }}>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickonDashboardTab
                  ? "You do not have permission"
                  : ""
              }
              arrow
            >
              <span>
                {userRole === "SuperAdmin" || canClickonDashboardTab ? (
                  <NavLink
                    to={`/project-sites/${projectSiteName}/dashboard`}
                    className="nav"
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2,
                      }}
                    >
                      <Tooltip
                        title="Dashboard"
                        placement="right"
                        disableHoverListener={open}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            ml: open ? "auto" : "auto", // Adjust this value as needed
                            justifyContent: "center",
                          }}
                        >
                          <Sidebar className="headersIcon" />
                        </ListItemIcon>
                      </Tooltip>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: "#637381" }}
                          >
                            Dashboard
                          </Typography>
                        }
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </NavLink>
                ) : (
                  <NavLink
                    to={`/project-sites/${projectSiteName}/dashboard`}
                    className="nav"
                    style={{ pointerEvents: "none", opacity: "0.4" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2,
                      }}
                    >
                      <Tooltip
                        title="Dashboard"
                        placement="right"
                        disableHoverListener={open}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            ml: open ? "auto" : "auto", // Adjust this value as needed
                            justifyContent: "center",
                          }}
                        >
                          <Sidebar className="headersIcon" />
                        </ListItemIcon>
                      </Tooltip>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: "#637381" }}
                          >
                            Dashboard
                          </Typography>
                        }
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </NavLink>
                )}
              </span>
            </Tooltip>
          </ListItem>

          <Tooltip
          title={
            userRole !== "SuperAdmin"  && !canClickOnAlarmsInSidePane ? "You do not have permission" : ""
          }
          arrow
          >
          <span>
            {
              userRole === "SuperAdmin"  || canClickOnAlarmsInSidePane ? (
                <ListItem disablePadding sx={{ display: "block" }}>
            <Tooltip>
              <NavLink
                to={`/project-sites/${projectSiteName}/alarms`}
                className="nav"
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2,
                  }}
                >
                  <Tooltip
                    title="alarms"
                    placement="right"
                    disableHoverListener={open}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        ml: open ? "auto" : "auto", // Adjust this value as needed
                        justifyContent: "center",
                      }}
                    >
                     
                      <NotificationsActiveOutlinedIcon className="headersIcon" size="large" sx={{color:"red"}}/>
                    </ListItemIcon >
                  </Tooltip>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: "#637381" }}
                      >
                        Alarms
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </NavLink>
            </Tooltip>
          </ListItem>
              ) : (<ListItem disablePadding sx={{ display: "block" }}>
                <Tooltip>
                  <NavLink
                    to={`/project-sites/${projectSiteName}/alarms`}
                    className="nav"
                    style={{ pointerEvents: "none", opacity: "0.4" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2,
                      }}
                    >
                      <Tooltip
                        title="Dashboard"
                        placement="right"
                        disableHoverListener={open}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            ml: open ? "auto" : "auto", // Adjust this value as needed
                            justifyContent: "center",
                          }}
                        >
                         
                          <NotificationsActiveOutlinedIcon className="headersIcon" size="large"/>
                        </ListItemIcon >
                      </Tooltip>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, color: "#637381" }}
                          >
                            Alarms
                          </Typography>
                        }
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </NavLink>
                </Tooltip>
              </ListItem>)
            }
          </span>
          </Tooltip>
        </List>
      </Drawer>
    </Box>
  );
}
