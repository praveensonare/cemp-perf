/**userAssiciatedProjectSlice.js
 * 
  * The userAssiciatedProjectSlice.js file is a slice of the Redux store that manages the associated projects for a user state.
  * The fetchAssociatedProjects thunk action is used to fetch the associated projects based on the current authenticated user.
 
Author : Arpana Meshram
  Date : 06-03-2024
  Revision:
         1.0 - 06-03-2024  : Create a slice to get associated projects based on the current authenticated user page.
         2.0 - 27-03-2023  : comment added for each function and variable.
 */
// Importing modules from Redux toolkit,
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// The fetchAssociatedProjects fetch the associated projects based on the current authenticated user.
export const fetchAssociatedProjects = createAsyncThunk(
    "userGroups/fetchUserGroups",
    async () => {
        const response2 = await axios.get(`/sites/ugr/user/groupForUser`);
        // Map over the groups to extract the projectSites
        const projectSites = response2.data.flatMap(group => group.projectSites);
        console.log('line 17',  projectSites);
        return projectSites;
    }
);
// The AssociatedProject is created using the createSlice function from Redux toolkit
export const AssociatedProject = createSlice({
    name: "AssociatedProject",
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAssociatedProjects.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export default AssociatedProject.reducer;