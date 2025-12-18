

import { fetchUserGroups, userGroupsSlice } from '../../features/permissions/usergroupSlice';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

jest.mock('axios');

describe('userGroupsSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        userGroups: userGroupsSlice.reducer
      }
    });
  });

  it('should handle initial state', () => {
    expect(store.getState().userGroups).toEqual([]);
  });

  it('should handle fetchUserGroups.fulfilled', async () => {
    const mockUserGroups = [
      { id: 1, name: 'Group 1' },
      { id: 2, name: 'Group 2' }
    ];

    axios.get.mockResolvedValue({ data: mockUserGroups });

    await store.dispatch(fetchUserGroups());

    expect(store.getState().userGroups).toEqual(mockUserGroups);
  });
});