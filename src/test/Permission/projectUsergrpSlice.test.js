import { fetchProjectForUserGroup, userGroupsForProject } from '../../features/permissions/projectUsergrpSlice';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { Auth } from 'aws-amplify';

jest.mock('axios');
jest.mock('aws-amplify');

describe('userGroupsForProject', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        userGroupsForProject: userGroupsForProject.reducer
      }
    });
  });

  it('should handle initial state', () => {
    const state = store.getState();
    expect(state.userGroupsForProject).toEqual([]);
  });

  it('should handle fetchProjectForUserGroup.fulfilled', async () => {
    const mockUser = { attributes: { email: 'test@example.com' } };
    const mockResponse1 = { data: { groupMembership: ['group1', 'group2'] } };
    const mockResponse2 = { data: [
      { groupName: 'group1', projectSites: ['site1', 'site2'] },
      { groupName: 'group2', projectSites: ['site3', 'site4'] },
      { groupName: 'group3', projectSites: ['site5', 'site6'] }
    ]};

    Auth.currentAuthenticatedUser.mockResolvedValue(mockUser);
    axios.get.mockResolvedValueOnce(mockResponse1);
    axios.get.mockResolvedValueOnce(mockResponse2);

    await store.dispatch(fetchProjectForUserGroup());

    const state = store.getState();
    expect(state.userGroupsForProject).toEqual(['site1', 'site2', 'site3', 'site4']);
  });

  // Add additional tests here

});