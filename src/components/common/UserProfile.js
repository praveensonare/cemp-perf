/* This is implementation of user profile component.
   The UserProfile component is responsible for displaying and managing user profile information. It has user information of logged-In user such as email, user group and associated project sites, user role, it shows date and time as well. Also, it has a sign out button which signs out the user from all the tabs in same browser. 
   It also displays the current Backend version and app version.
  Author : Shweta Vyas    
   Revision: 1.0 - 17-07-2021 : UI Creation.
*/

import React, { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { Amplify } from 'aws-amplify';
import axios from 'axios';
import { Divider, message } from "antd";
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Paper from '@mui/material/Paper';
import user from '../../assets/Icons/member.png';
import ProfileUser from '../../assets/Icons/user.png';
import people from '../../assets/Icons/people.png';
import location from '../../assets/Icons/location.png';
import Loader from "../common/LoaderDatagrid";
//RBAC
import { useDispatch } from "react-redux";
import { fetchrole } from "../../features/permissions/userroleSlice";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

Amplify.configure({
  Auth: {
    region: window.REACT_APP_REGION,
    userPoolId: window.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: window.REACT_APP_USER_POOL_APP_CLIENT_ID,
  }
})

function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [attributes, setAttributes] = useState(null);
  const [groupData, setGroupData] = useState('');
  const [ProjectSitesForUser, setProjectSitesForUser] = useState('');
  const [userRolePermissions, setUserRolePermissions] = useState([]);
  const [superAdminInfo, setSuperAdminInfo] = useState(null);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [loading, setLoading] = useState(true);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  //set different colors for different roles inside role-chip
  const getRoleColors = (role) => {
    switch (role) {
      case "Admin":
        return { color: "green", backgroundColor: "#DBF6E5" };
      case "Member":
        return { color: "#C07F1C", backgroundColor: "#FFF1D6" };
      case "Operator":
        return { color: "#0484bd", backgroundColor: "#D6F4F9" };
      case "Engineer":
        return { color: "#5923BB", backgroundColor: "#EDDEFF" };
      case "SuperAdmin":
        return {
          color: "#0f4f8f",
          background: "linear-gradient(to right, #89aacb, #a2d9ce)",
          fontWeight: 600
        };
      default:
        return { color: "black", backgroundColor: "white" }; // default colors
    }
  };

  const roleColors = getRoleColors(userRolePermissions);

  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user attributes
        let storedAttributes = localStorage.getItem('userAttributes');
        let userAttributes;
        if (storedAttributes) {
          userAttributes = JSON.parse(storedAttributes);
        } else {
          const user = await Auth.currentAuthenticatedUser();
          userAttributes = user.attributes;
          localStorage.setItem('userAttributes', JSON.stringify(userAttributes));
        }
        setAttributes(userAttributes);

        // Fetch user role permissions
        let storedUserRole = localStorage.getItem('userRolePermissions');
        let userRole;
        if (storedUserRole) {
          userRole = storedUserRole;
        } else {
          const response = await axios.get(`/sites/ugr/user/rolePermissionsForUser/${userAttributes.email}`);
          userRole = response.data.userRole;
          localStorage.setItem('userRolePermissions', userRole);
        }
        setUserRolePermissions(userRole);

        // Fetch data based on user role
        if (userRole === 'SuperAdmin') {
          const superAdminResponse = await axios.get(`/sites/ugr/user/superAdminInfo`);
          setSuperAdminInfo(superAdminResponse.data);
        }
        //non-superadmin users
        else {
          const storedGroupData = localStorage.getItem('groupData');
          const storedProjectSites = localStorage.getItem('projectSitesForUser');

          if (storedGroupData && storedProjectSites) {
            setGroupData(storedGroupData);
            setProjectSitesForUser(JSON.parse(storedProjectSites));
          } else {
            const groupResponse = await axios.get(`/sites/ugr/user/groupForUser?email=${userAttributes.email}`);
            if (groupResponse.data && groupResponse.data.length > 0) {
              const data = groupResponse.data[0];
              const groupName = data.groupName;
              let projectSiteNames = [];
              if (Array.isArray(data.projectSites)) {
                projectSiteNames = data.projectSites.map(site => site.projectSiteName);
              }
              setGroupData(groupName);
              setProjectSitesForUser(projectSiteNames);
              localStorage.setItem('groupData', groupName);
              localStorage.setItem('projectSitesForUser', JSON.stringify(projectSiteNames));
            } else {
              setGroupData('');
              setProjectSitesForUser([]);
              localStorage.setItem('groupData', '');
              localStorage.setItem('projectSitesForUser', JSON.stringify([]));
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //Sign-out function
  async function signOut() {
    try {
      await Auth.signOut({ global: true });
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        console.log('Access Token has been revoked, proceeding with sign-out.');
      } else {
        console.log('error signing out: ', error);
        return; // Exit the function if it's a different error
      }
    } finally {
      localStorage.removeItem('userAttributes');
      localStorage.removeItem('userRolePermissions');
      localStorage.removeItem('groupData');
      localStorage.removeItem('projectSitesForUser');
      setAttributes(null);
      setUserRolePermissions(null); // Clear user role on sign out
      setGroupData(null); // Clear group data on sign out
      setProjectSitesForUser([]);
      navigate("/");
      message.success("Logged Out successfully");
    }
  }

  //toggle the state
  const handleButtonClick = () => {
    setState({ ...state, right: !state.right });
  }

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>

          <Button onClick={handleButtonClick}>
            <div>
              <img src={ProfileUser} alt="Profile" width="45" height="45" />
            </div>
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            style={{ maxHeight: '100vh', overflowY: 'auto' }}
          >

            <Paper style={{ width: '18vw', height: '90vh' }}>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '78px', marginBottom: '10px' }}>
                  <Avatar
                    data-testid="avatar"
                    sx={{
                      width: theme => theme.spacing(8),
                      height: theme => theme.spacing(8),
                      backgroundColor: '#616161',
                      fontSize: '1.8em'
                    }}
                  >
                    {attributes?.email.substring(0, 1)?.toUpperCase() ?? ''}
                  </Avatar>

                  {/* email and role display */}
                  <div style={{ marginTop: '6px', fontSize: '16px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <div style={{ paddingBottom: '4px' }}>{attributes?.email ?? ''}</div>
                    <Chip
                      label={userRolePermissions}
                      style={roleColors} />
                  </div>
                </div>

                {loading && <Loader />}

                <Divider />

                {/* Project sites Info */}
                <div className='chipInfo'>
                  <div className="user-group-container">
                    <img src={location} height={22} alt='project' />
                    <h6>Project Sites</h6>
                  </div>
                  {userRolePermissions === 'SuperAdmin' ? (
                    <Chip label={superAdminInfo?.total_project_sites} className='CountChips' />
                  ) : (
                    ProjectSitesForUser && ProjectSitesForUser.map((site, index) => (
                      <Chip key={index} label={site} className='chips' />
                    ))
                  )}
                </div>

                <Divider />

                {/* User groups Info */}
                <div className='chipInfo'>
                  <div className="user-group-container">
                    <img src={people} alt='user-group' style={{ filter: 'brightness(0.6)' }} />
                    <h6>User Groups</h6>
                  </div>
                  {userRolePermissions === 'SuperAdmin' ? (
                    <Chip label={superAdminInfo?.total_groups} className='CountChips' />
                  ) : (
                    <Chip label={groupData} className='chips' />
                  )}
                </div>

                {/* Total Members */}
                {userRolePermissions === 'SuperAdmin' && (
                  <div className='chipInfo'>
                    <Divider />
                    <div className="user-group-container">
                      <img src={user} alt="user" style={{ filter: 'brightness(0.6)' }} />
                      <h6>Total Members</h6>
                    </div>
                    <Chip label={superAdminInfo?.
                      total_users} className='CountChips' />
                  </div>
                )}

                {/* Sign-out button */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<LogoutIcon style={{ color: 'white', fontWeight: 'bold' }} />}
                    onClick={signOut}
                    sx={{
                      fontWeight: 'bold',
                      margin: '8px 6px',
                      backgroundColor: '#ef4040',
                      color: 'white',
                      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                      '&:active': {
                        backgroundColor: 'red',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
                      },
                      '&:hover': {
                        backgroundColor: 'red',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.7)',
                      },
                    }}
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </Paper>

          </Drawer>
        </React.Fragment>
      ))}
    </div>

  )
}

export default UserProfile
