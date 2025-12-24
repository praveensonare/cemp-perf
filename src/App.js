/* This is implementation of App component. The main entry point for a React application, it's typically where you set up routing, context providers, and any other application-wide configurations.
   Revision:
        Author : Shweta Vyas
        25-02-2024 : modified the code base, moved private routes to another component and added the AuthProvider component to check the authentication state of the user.     
*/
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ProjectProvider } from "./ProjectContext";
import setupAxiosInterceptors from './axiosSetup';
import { AuthProvider } from './AuthProvider';
import { NodesProvider } from './NodesContext';
import './App.css';

// Lazy load page components
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Unauthorized = lazy(() => import("./components/common/Unauthorized"));
const ProtectedRoutes = lazy(() => import('./ProtectedRoutes'));

// Loading fallback component
const LoadingFallback = () => (
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
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

// Set up Axios interceptors
setupAxiosInterceptors();

function App() {
  return (
    <div >
         <NodesProvider>
      <ProjectProvider>
        <div className='App'>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes */}
              <Route path="/*" element={
                <AuthProvider>
                  <ProtectedRoutes />
                </AuthProvider>
              } />
            </Routes>
          </Suspense>
        </div>
      </ProjectProvider>
      </NodesProvider>
    </div>
  );
}
export default App;






