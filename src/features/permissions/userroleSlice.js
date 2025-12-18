/**userroleSlice.js
 * 
 * The userroleSlice.js file is a slice of the Redux store that manages the user role state.
 * The fetchrole thunk action is used to fetch the user role based on the current authenticated user.

 Author : Arpana Meshram
  Date : 19-01-2024
  Revision:
         1.0 - 19-01-2024  : Create a slice to get the userRole based on the current authenticated user.
         2.0 - 27-03-2023  : comment added for each function and variable.
 */
// Importing modules from Redux toolkit,
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Auth } from 'aws-amplify';
// The fetchrole fetch the user role based on the current authenticated user.
export const fetchrole = createAsyncThunk(
  'role/fetchRole',
  async () => {
    // Get the current authenticated user and their email
    const { attributes } = await Auth.currentAuthenticatedUser();
    const email = attributes.email;
    const response = await axios.get(`/sites/ugr/user/rolePermissionsForUser/${email}`);
    // Extract the user role from the response data
    const userRole = response.data.userRole;
   return userRole;
  }
);
// The userroleSlice is created using the createSlice function from Redux toolkit
 export const userroleSlice = createSlice({
  name: 'userRole',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchrole.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default userroleSlice.reducer;

