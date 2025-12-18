/* This is implementation of React context in my application. It's a way to pass data as projectSiteName through the component tree without having to pass props down manually at every level. In other words, it's a form of global state management in the application.
  Author : Shweta Vyas      
*/

import axios from 'axios';
import { Amplify } from 'aws-amplify';
import { createContext, useState, useEffect } from 'react';

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

// Amplify cognito configuration
Amplify.configure({
  Auth: {
    region: window.REACT_APP_REGION,
    userPoolId: window.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: window.REACT_APP_USER_POOL_APP_CLIENT_ID,
  }
})

// Create a context
export const ProjectContext = createContext();
// Create a provider component
export const ProjectProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [permissionData, setPermissionData] = useState(null);
  const [projectSiteName, setProjectSiteName] = useState(() => {
    // Get the initial value from localStorage
    const storedValue = localStorage.getItem('projectSiteName');
    return storedValue ? JSON.parse(storedValue) : null;
  });


  // Update localStorage whenever projectSiteName changes
  useEffect(() => {
    localStorage.setItem('projectSiteName', JSON.stringify(projectSiteName));
  }, [projectSiteName]);

  return (
    <ProjectContext.Provider value={{ projectSiteName, setProjectSiteName, userData, permissionData }}>
      {children}
    </ProjectContext.Provider>
  );
};