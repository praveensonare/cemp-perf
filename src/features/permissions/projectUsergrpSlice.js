/**projectUsergrpSlice.js
 * 
 * The projectUsergrpSlice.js file is a slice of the Redux store that manages the user groups for a project state.
 * The fetchProjectForUserGroup thunk action is used to fetch the user groups for a project based on the current authenticated user.
 
Author : Arpana Meshram
  Date : 19-01-2024
  Revision:
         1.0 - 19-01-2024  : Create a slice to get associated projects based on the current authenticated user.
         2.0 - 27-03-2023  : comment added for each function and variable.
 */
// Importing modules from Redux toolkit,
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Auth } from 'aws-amplify';
//  The fetchProjectForUserGroup fetch the user groups for a project based on the current authenticated user.
export const fetchProjectForUserGroup = createAsyncThunk(
    "userGroups/fetchUserGroups",
    async () => {
        const { attributes } = await Auth.currentAuthenticatedUser();
        const email = attributes.email;
        const response1 = await axios.get(`/sites/ugr/user/rolePermissionsForUser/${email}`);
        const groupMembership = response1.data.groupMembership;
        const response2 = await axios.get(`/sites/ugr/group/userGroups`);
        const groups = response2.data; 
        // Filter the groups based on the groupMembership
        const filteredGroups = groups.filter(group => groupMembership.includes(group.groupName));
        // Map over the filtered groups to extract the projectSites
        const projectSites = filteredGroups.flatMap(group => group.projectSites);
        return projectSites;
    }
);
// The userGroupsForProject is created using the createSlice function from Redux toolkit
export const userGroupsForProject = createSlice({
    name: "userGroupsForProject",
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProjectForUserGroup.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export default userGroupsForProject.reducer;