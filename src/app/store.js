/**store.js
 * 
 * The store.js file is fundamental to the application's state management.
 * It sets up the Redux store, which enables different components in the application to interact with the state by dispatching actions and subscribing to state changes.
*
  Author : Arpana Meshram
  Date : 19-01-2024
  Revision:
         1.0 - 19-01-2024  : Create a store.js 
 */
// Importing necessary modules and reducers from Redux toolkit 
import { configureStore } from '@reduxjs/toolkit';
import permissionsReducer from '../features/permissions/permissionsSlice';
import userGroupsReducer from '../features/permissions/usergroupSlice';
import userroleReducer from '../features/permissions/userroleSlice';
import userGroupsForProjectReducer from '../features/permissions/projectUsergrpSlice';
import userAssociatedProjectReducer from '../features/permissions/userAssociatedProjectSlice'; 
// Configuring and creating the Redux store with the imported reducers
// Each reducer is responsible for handling actions related to a specific part of the state
// The store is exported to be used in the application .
// The store is the central place where the application state is stored and managed
export default configureStore({
  reducer: {
    permissions: permissionsReducer,
    userGroups: userGroupsReducer,
    userRole: userroleReducer,
    userGroupsForProject: userGroupsForProjectReducer,
    AssociatedProject:userAssociatedProjectReducer,
  },
});