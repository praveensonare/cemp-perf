/* This is implementation of Protected Routes which should only be accessible for the authenticated users that exist in cognito pool.
  Author : Shweta Vyas
  revision:
  Author: Shweta Vyas
  Date: 04/16/2024: Added RBAC permission checks for the routes.
*/

// ProtectedRoutes.js
import React from 'react';
import { useEffect, useState } from 'react';
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import UserMembers from './pages/RoleManager/UserMembers';
import Project_Members from './pages/RoleManager/Project_Members';
import HomePageContent from './pages/RoleManager/HomePageContent'
import GuidedTourRoleManager from './pages/RoleManager/GuidedTourRoleManager'
import Projects from './pages/RoleManager/Projects'
import Dashboard from './pages/Dashboard/Dashboard'
import Settings from "./pages/Settings";
import RoleManagers from "./pages/RoleManager/RoleManagers"
import DeviceHub from './pages/DeviceHub/HomePage_DeviceH'
import Entitymap from "./pages/DeviceHub/EntityMap"
import Gateways from '../src/pages/DeviceHub/Gateways'
import GatewaysDetails from "./pages/DeviceHub/GatewaysDetails";
import ParameterMapping from "./pages/DeviceHub/ParameterMapping";
import CompanyProfile from "./pages/ProjectSchematic/CompanyProfile";
import Status from "./pages/ProjectSchematic/Status";
import ProjectSchematicStatus from "./pages/ProjectSchematic/ProjectSchematicStatus";
import Sensors from "./pages/DeviceHub/Sensors";
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
//RBAC
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "./features/permissions/permissionsSlice";
import { fetchrole } from "./features/permissions/userroleSlice";
import { Spin } from 'antd';
import ProjectSchematicSetting from './pages/Setting/ProjectSchematicSetting';
import DeviceController from './pages/DeviceController';
import AdminDashboard from './pages/EnergyTrading/AdminDashboard';
import TradingView from './pages/EnergyTrading/TradingView'
import ProfileManager from './pages/EnergyTrading/ProfileManager';
import ETMenu1 from './pages/EnergyTrading/ETMenu1';
import ETMenu2 from './pages/EnergyTrading/ETMenu2';
import ETHubMenu1 from './pages/ETHub/ETHubMenu1';
import ETHubMenu2 from './pages/ETHub/ETHubMenu2';
import Marketplace from './pages/ETHub/Marketplace';
import MyProfile from './pages/ETHub/MyProfile';
import Wallet from './pages/ETHub/Wallet';
import MyTransactions from './pages/ETHub/MyTransactions';
import Alarms from './pages/Alarms/Alarms';

function ProtectedRoutes() {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    //RBAC
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const dispatch = useDispatch();
    const permissions = useSelector(state => state.permissions);
    const userRole = useSelector(state => state.userRole);
    //RBAC Permissions
    const canClickonSensorTab = permissions.includes("canClickOnSensorInDeviceHubSidePane");
    const canClickonGatewayTab = permissions.includes("canClickonGatewayInDeviceHubSidePane");
    const canClickonEntityMapTab = permissions.includes("canClickonEntityMapInDeviceHubSidePane")
    const canClickonDashboardTab = permissions.includes("canClickOnDashboardInSidePane");
    const canClickonProjectSchematicInSidePane = permissions.includes("canClickOnProjectSchematicInSidePane");
    const canClickOnDeviceHubInSidePane = permissions.includes("canClickOnDeviceHubInSidePane");
    const canClickOnUserGroupsTabUnderRoleManager = permissions.includes("canClickOnUserGroupsInRoleManagerSidePane");
    const canClickonProjectsTab = permissions.includes("canClickonProjectsInRoleManagerSidePane");
    const canClickOnSettingsInSidePane = permissions.includes("canClickOnSettingsInSidePane");
    const canClickOnInfoEdgeDevice = permissions.includes("canClickOnInfoEdgeDevice");
    const canClickOnMappingUnderEdgeDevice = permissions.includes("canClickOnMappingInEdgeDevice");
    const canClickProjectSite = permissions.includes("canClickOnProjectSiteName");
    const canClickOnUserGroupName = permissions.includes("canClickOnUserGroupName");
    const canClickonMoreButton = permissions.includes("canClickOnMoreInProjectSite");
    const canClickOnEnergyTradingInSidePane = permissions.includes("canClickOnEnergyTradingInSidePane");
    const canClickOnDeviceETHubInSidePane= permissions.includes("canClickOnDeviceETHubInSidePane");
    const canClickOnDeviceControllerInSidePane= permissions.includes("canClickOnDeviceControllerInSidePane");

    //loading permissions and role
    useEffect(() => {
        dispatch(fetchPermissions()).then(() => setIsLoadingPermissions(false));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchrole()).then(() => setIsLoadingRole(false));
    }, [dispatch]);


    return (
        isLoadingPermissions || isLoadingRole ? (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    zIndex: 9999,
                }}
            >
                <Spin size="large" />
            </div>
        ) : (
            //These are the routes that are protected and can only be accessed by the authenticated users.
            <Routes>
                <Route path="/project-sites" element={isLoading ? null : isAuthenticated ? <HomePage /> : <Navigate to="/" />} />

                <Route path="/dashboard-configurations" element={isLoading ? null : isAuthenticated ? (canClickOnSettingsInSidePane || userRole === 'SuperAdmin') ? <Settings /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/project-schematic-configurations" element={isLoading ? null : isAuthenticated ? (canClickOnSettingsInSidePane || userRole === 'SuperAdmin') ? <ProjectSchematicSetting /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />
                  

                 {/* Energy tradin and device controller routes  */}
                <Route path="/admin-dashboard" element={isLoading ? null : isAuthenticated ? (canClickOnEnergyTradingInSidePane  || userRole === 'SuperAdmin') ? <AdminDashboard /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path='/trading-view' element={isLoading?null:isAuthenticated?(canClickOnEnergyTradingInSidePane || userRole==='SuperAdmin') ? <TradingView /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />}/>

                <Route path='/profile-manager' element={isLoading?null:isAuthenticated?(canClickOnEnergyTradingInSidePane || userRole==='SuperAdmin') ? <ProfileManager /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />}/>

                <Route path='/et-menu-1' element={isLoading?null:isAuthenticated?(canClickOnEnergyTradingInSidePane || userRole==='SuperAdmin') ? <ETMenu1 /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />}/>

                <Route path='/et-menu-2' element={isLoading?null:isAuthenticated?(canClickOnEnergyTradingInSidePane || userRole==='SuperAdmin') ? <ETMenu2 /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />}/>

                <Route path="/project-sites/:projectSiteName/marketplace" element={isLoading ? null : isAuthenticated ? (canClickOnDeviceETHubInSidePane || userRole === 'SuperAdmin') ? <Marketplace /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/project-sites/:projectSiteName/my-transactions" element={isLoading ? null : isAuthenticated ? (canClickOnDeviceETHubInSidePane || userRole === 'SuperAdmin') ? <MyTransactions /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/project-sites/:projectSiteName/wallet" element={isLoading ? null : isAuthenticated ? (canClickOnDeviceETHubInSidePane || userRole === 'SuperAdmin') ? <Wallet /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/project-sites/:projectSiteName/my-profile" element={isLoading ? null : isAuthenticated ? (canClickOnDeviceETHubInSidePane || userRole === 'SuperAdmin') ? <MyProfile /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path='/project-sites/:projectSiteName/et-hub-menu-1' element={isLoading?null:isAuthenticated?(canClickOnDeviceETHubInSidePane || userRole==='SuperAdmin') ? <ETHubMenu1 /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />}/>
                
                <Route path='/project-sites/:projectSiteName/et-hub-menu-2' element={isLoading?null:isAuthenticated?(canClickOnDeviceETHubInSidePane || userRole==='SuperAdmin') ? <ETHubMenu2 /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />}/>

                <Route path="/device-controller" element={isLoading ? null : isAuthenticated ? (canClickOnDeviceControllerInSidePane || userRole==='SuperAdmin')? <DeviceController/>:<Navigate to="/unauthorized"/>:<Navigate to="/"/>} />

                <Route path="/role-manager" element={isLoading ? null : isAuthenticated ? <HomePageContent /> : <Navigate to="/" />} />

                <Route path='/user-groups/:groupName' element={isLoading ? null : isAuthenticated ? (canClickOnUserGroupName || userRole === 'SuperAdmin') ? <UserMembers /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/projects" element={isLoading ? null : isAuthenticated ? <Projects /> : <Navigate to="/" />} />

                <Route path="/projects/:projectSiteName" element={isLoading ? null : isAuthenticated ? (canClickProjectSite || userRole === 'SuperAdmin') ? <Project_Members /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/guided-tour" element={isLoading ? null : isAuthenticated ? <GuidedTourRoleManager /> : <Navigate to="/" />} />

                <Route path="/project-sites/:projectSiteName/device-hub" element={isLoading ? null : isAuthenticated ? (canClickOnDeviceHubInSidePane || userRole === 'SuperAdmin') ? <DeviceHub /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path='/project-sites/:projectSiteName/alarms' element={isLoading ? null : isAuthenticated ?<Alarms/>:<Navigate to="unauthorized"/>}/>

                <Route
                    path="/project-sites/:projectSiteName/sensors"
                    element={isLoading ? null : isAuthenticated ? (canClickonSensorTab || userRole === 'SuperAdmin') ? <Sensors /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />}
                />
                <Route
                    path="/project-sites/:projectSiteName/entity-map"
                    element={isLoading ? null : isAuthenticated ? (canClickonEntityMapTab || userRole === 'SuperAdmin') ? <Entitymap /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route
                    path="/project-sites/:projectSiteName/gateways"
                    element={isLoading ? null : isAuthenticated ? (canClickonGatewayTab || userRole === 'SuperAdmin') ? <Gateways /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />
                    }
                />

                <Route path="/project-sites/:projectSiteName/gateways/:gatewayName/gateways-details" element={isLoading ? null : isAuthenticated ? (canClickOnInfoEdgeDevice || userRole === 'SuperAdmin') ? <GatewaysDetails /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/project-sites/:projectSiteName/Dashboard" element={isLoading ? null : isAuthenticated ? (canClickonDashboardTab || userRole === 'SuperAdmin') ? <Dashboard /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/user-groups" element={isLoading ? null : isAuthenticated ? <RoleManagers /> : <Navigate to="/" />} />

                <Route path="/project-sites/:projectSiteName/gateways/:gatewayName/parameter-mapping" element={isLoading ? null : isAuthenticated ? (canClickOnMappingUnderEdgeDevice || userRole === 'SuperAdmin') ? <ParameterMapping /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/project-sites/:projectSiteName/company-profile" element={isLoading ? null : isAuthenticated ? (canClickonMoreButton || userRole === 'SuperAdmin') ? <CompanyProfile /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/project-sites/:projectSiteName/status" element={isLoading ? null : isAuthenticated ? (canClickonProjectSchematicInSidePane || userRole === 'SuperAdmin') ? <Status /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/project-sites/:projectSiteName/schematic-status" element={isLoading ? null : isAuthenticated ? (canClickonProjectSchematicInSidePane || userRole === 'SuperAdmin') ? <ProjectSchematicStatus /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />

                <Route path="/project-sites/:projectSiteName/PSsetting" element={isLoading ? null : isAuthenticated ? (canClickonProjectSchematicInSidePane || userRole === 'SuperAdmin') ? <ProjectSchematicSetting /> : <Navigate to="/unauthorized" /> : <Navigate to="/" />} />
            </Routes>
        )
    );
}
export default ProtectedRoutes;