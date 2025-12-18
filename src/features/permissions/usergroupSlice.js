/**usergroupSlice.js
 * 
 * The usergroupSlice.js file is a slice of the Redux store that manages the user groups state.
 * The fetchUserGroups thunk action is used to fetch the user groups based on the current authenticated user.

 Author : Arpana Meshram
  Date : 31-01-2024
  Revision:
         1.0 - 31-01-2024  : Create a slice to get the user groups based on the current authenticated user .
         2.0 - 27-03-2023  : comment added for each function and variable.
 */
// Importing modules from Redux toolkit,
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
 // The fetchUserGroups fetch the user groups based on the current authenticated user.
export const fetchUserGroups = createAsyncThunk(
  'userGroups/fetchUserGroups',
  async () => {
    const response = await axios.get('/sites/ugr/user/groupForUser');
    // Extract the user group data from the response
    const userGroupData = response.data
    return userGroupData
  }
);
 // The userGroupsSlice is created using the createSlice function from Redux toolkit
 export const userGroupsSlice = createSlice({
  name: 'userGroups',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserGroups.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});
 
export default userGroupsSlice.reducer;