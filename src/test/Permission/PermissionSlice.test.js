import { fetchPermissions } from '../../features/permissions/permissionsSlice';
import { permissionsSlice } from '../../features/permissions/permissionsSlice';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import { configureStore } from '@reduxjs/toolkit';
jest.mock('axios');
jest.mock('aws-amplify');
//Test Suite 
describe('permissionsSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        permissions: permissionsSlice.reducer
      }
    });
  });
  it('should handle initial state', () => {
    const state = store.getState();
    expect(state.permissions).toEqual([]);
  });

  it('should handle fetchPermissions.fulfilled with different permissions', async () => {
    const mockUser = { attributes: { email: 'test@example.com' } };
    const mockResponse = { data: { accessPermissions: ['delete', 'update'] } };

    Auth.currentAuthenticatedUser.mockResolvedValue(mockUser);
    axios.get.mockResolvedValue(mockResponse);

    await store.dispatch(fetchPermissions());

    const state = store.getState();
    expect(state.permissions).toEqual(mockResponse.data.accessPermissions);
  });
  it('should handle fetchPermissions', async () => {
    const mockUser = { attributes: { email: 'test@example.com' } };
    const mockResponse = { data: { accessPermissions: ['read', 'write'] } };

    Auth.currentAuthenticatedUser.mockResolvedValue(mockUser);
    axios.get.mockResolvedValue(mockResponse);

    await store.dispatch(fetchPermissions());

    const state = store.getState();
    expect(state.permissions).toEqual(mockResponse.data.accessPermissions);
  });

  it('should handle fetchPermissions.fulfilled action', () => {
    const initialState = [];
    const action = {
      type: fetchPermissions.fulfilled.type,
      payload: ['canClickOnInfoUserGroup', 'canClickOnDeleteSensor'],
    };
 
    const nextState = permissionsSlice.reducer(initialState, action);
 
    expect(nextState).toEqual(['canClickOnInfoUserGroup', 'canClickOnDeleteSensor']);
  });
});
