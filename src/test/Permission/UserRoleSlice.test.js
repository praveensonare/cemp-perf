import { fetchrole, userroleSlice } from '../../features/permissions/userroleSlice';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { Auth } from 'aws-amplify';

jest.mock('axios');
jest.mock('aws-amplify');

describe('userroleSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        userRole: userroleSlice.reducer
      }
    });
  });

  it('should handle initial state', () => {
    expect(store.getState().userRole).toEqual([]);
  });

  it('should handle fetchrole.fulfilled', async () => {
    const mockUserRole = 'admin';
    const mockEmail = 'test@example.com';
    Auth.currentAuthenticatedUser.mockResolvedValue({
      attributes: {
        email: mockEmail
      }
    });
    axios.get.mockResolvedValue({ data: { userRole: mockUserRole } });

    await store.dispatch(fetchrole());

    expect(store.getState().userRole).toEqual(mockUserRole);
  });
});