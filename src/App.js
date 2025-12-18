/* This is implementation of App component. The main entry point for a React application, it's typically where you set up routing, context providers, and any other application-wide configurations.
   Revision:
        Author : Shweta Vyas
        25-02-2024 : modified the code base, moved private routes to another component and added the AuthProvider component to check the authentication state of the user.     
*/
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Unauthorized from "./components/common/Unauthorized";
import { ProjectProvider } from "./ProjectContext";
import setupAxiosInterceptors from './axiosSetup';
import { AuthProvider } from './AuthProvider';
import ProtectedRoutes from './ProtectedRoutes';
import { NodesProvider } from './NodesContext';
import './App.css';

// Set up Axios interceptors
setupAxiosInterceptors();

function App() {
  return (
    <div >
         <NodesProvider>
      <ProjectProvider>
        <div className='App'>
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
        </div>
      </ProjectProvider>
      </NodesProvider>
    </div>
  );
}
export default App;






