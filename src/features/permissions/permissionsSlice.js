/**permissionSlice.js
 * 
  * The permissionSlice.js file is a slice of the Redux store that manages the permissions state.
  * The fetchPermissions thunk action is used to fetch the permissions for the current authenticated user.    
  *  
 Author : Arpana Meshram
  Date : 19-01-2024
  Revision:
         1.0 - 19-01-2024  : Create a slice to get the permissions for the current authenticated user.
         2.0 - 27-03-2023  : comment added for each function and variable.

 */
// Importing modules from Redux toolkit,
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Auth } from 'aws-amplify';
// The fetchPermissions fetch the permissions for the current authenticated user.
export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async () => {
     // Get the current authenticated user and their email
    const { attributes } = await Auth.currentAuthenticatedUser();
    const email = attributes.email;
    const response = await axios.get(`/sites/ugr/user/rolePermissionsForUser/${email}`);
    // Extract the access permissions from the response data
    const accessPermissions = response.data.accessPermissions;
    return accessPermissions;
  }
);
// The permissionsSlice is created using the createSlice function from Redux toolkit
export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPermissions.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default permissionsSlice.reducer;