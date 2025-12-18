import { fetchAssociatedProjects, AssociatedProject } from '../../features/permissions/userAssociatedProjectSlice';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

jest.mock('axios');

describe('AssociatedProject slice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        AssociatedProject: AssociatedProject.reducer
      }
    });
  });

  it('should handle initial state', () => {
    const state = store.getState().AssociatedProject;
    expect(state).toEqual([]);
  });

  it('should handle fetchAssociatedProjects.fulfilled', async () => {
    const mockProjects = [
      { projectSites: ['Project1', 'Project2'] },
      { projectSites: ['Project3', 'Project4'] }
    ];
    const expectedProjects = ['Project1', 'Project2', 'Project3', 'Project4'];

    axios.get.mockResolvedValue({ data: mockProjects });

    await store.dispatch(fetchAssociatedProjects());

    const state = store.getState().AssociatedProject;
    expect(state).toEqual(expectedProjects);
  });
});