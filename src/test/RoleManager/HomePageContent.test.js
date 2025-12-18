/* This is implementation of test cases for HomePage for role manager component. 
  Author : Arpana Meshram   
*/
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import HomePageContent from '../../pages/RoleManager/HomePageContent';
import { ProjectContext, ProjectProvider } from '../../ProjectContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';


// "test": "set DEBUG_PRINT_LIMIT=100000 && react-scripts test",

// Mock the Axios library with Jest
// jest.mock('axios');
jest.mock('sweetalert2');

// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios);
const mockDispatch = jest.fn();

// Mock the useDispatch and useSelector hooks from react-redux
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

//mock the useNavigate and useLocation hooks from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn().mockName('navigate'),
    useLocation: () => ({
        pathname: '/role-manager',
    }),
}));

describe('home page', () => {
  let wrapper;
  let mockDispatch;
  let mockPermissions;
  let mockUserRole;

  beforeEach(async () => {
      mockDispatch = jest.fn();
      mockPermissions = ["canClickOnGuidedTourUnderWelcomeToRoleManagerInHomePage"];
      mockUserRole = 'SuperAdmin';

      useDispatch.mockReturnValue(mockDispatch);
      useSelector.mockImplementation((selector) => {
          if (selector.toString().includes('permissions')) return mockPermissions;
          if (selector.toString().includes('canClickOnGuidedTourUnderWelcomeToRoleManagerInHomePage')) return true;
          if (selector.toString().includes('userRole')) return mockUserRole;
      });
         // Check if the button is disabled for non-SuperAdmin users without the necessary permission
 
      let mockDataUserGroups;
      let mockDataProjectSites;

      mockDataUserGroups = [
          {
              groupName: 'Infy3UG',
              id: 3,
              memberCount: 2,
              projectSites: [
                  { projectSiteName: 'JTC2', projectSiteAlias: 'JTC2' },
                  { projectSiteName: 'INFOSYS', projectSiteAlias: 'Infosys MG Site' },
                  { projectSiteName: 'Test2_infy', projectSiteAlias: 'Infosys Test2 project site' },
              ],
          },
      ];

      mockDataProjectSites = [
          {
              description: "INFOSYS",
              projectGroups: ["INFOSYS_Grp", "test_demo", "Test", "Infy3UG", "JTC2"],
              projectLocation: "Rohini,DL,IN",
              projectSiteAlias: "Infosys MG Site",
              projectSiteName: "INFOSYS"
          },
          // Add more project sites here if needed
      ];

      // Mock the axios get requests
      mock.onGet('/sites/project/projectSites').reply(200, mockDataProjectSites);
      mock.onGet('/sites/ugr/group/userGroups').reply(200, mockDataUserGroups);
      await act(async () => {
          wrapper = render(
              <Router>
                  <ProjectProvider>
                      <HomePageContent />
                  </ProjectProvider>
              </Router>
          );
      });
  })

    it('should render the Welcome to Role Manager heading', async () => {
        await waitFor(() => {
            expect(wrapper.getByText('Welcome to Role Manager')).toBeInTheDocument();
        });
    });

    it('renders without crashing', () => {
        render(<Router>
            <ProjectProvider>
                <HomePageContent />
            </ProjectProvider>
        </Router>);
    });

    it('renders the My User Groups heading', () => {
        expect(wrapper.getByText('My User Groups')).toBeInTheDocument();
    });

    it('renders the My User Groups heading', () => {
        expect(wrapper.getByText('Projects')).toBeInTheDocument();
    });

    it('should render the project data correctly', async () => {
        await waitFor(() => {
            expect(wrapper.getByText('Infosys MG Site')).toBeInTheDocument();
            expect(wrapper.getByText('Rohini,DL,IN')).toBeInTheDocument();
        });
    });

    it('should render the user group data correctly', async () => {
        await waitFor(() => {
            expect(wrapper.getByText('Infy3UG')).toBeInTheDocument();
            expect(wrapper.getByText('2')).toBeInTheDocument();
        });
    });

    it('renders the list with label User level action control', () => {
      expect(wrapper.getByText('User level action control')).toBeInTheDocument();
   });

   it('renders the list with label Permission management', () => {
    expect(wrapper.getByText('Permission management')).toBeInTheDocument();
 });
 it('renders the list with label Project creation & user management', () => {
  expect(wrapper.getByText('Project creation & user management')).toBeInTheDocument();
});
    it('renders the Guided Tour button with not-disabled state for those who have permission', async () => {
     
        // Re-render the component
        await act(async () => {
            wrapper.rerender(
                <Router>
                    <ProjectProvider>
                        <HomePageContent />
                    </ProjectProvider>
                </Router>
            );
        });
    
        const button = wrapper.getByText('Guided Tour').closest('button');
        expect(button).toBeInTheDocument();
    });
    it("renders the Table Rows per page:", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Rows per page:")).toBeInTheDocument();
      });
      // Assert
      const table = wrapper.getByRole("grid");
      expect(table).toBeInTheDocument();
    });
  
    it("renders the table filter 5 text :", async () => {
      // Arrange
      await waitFor(() => {
        expect(wrapper.getByText("5")).toBeInTheDocument();
      });
      // Assert
      const table = wrapper.getByRole("grid");
      expect(table).toBeInTheDocument();
    });
  
    it("should render the 'User Group' label and a data grid table in the document", async () => {
      // Arrange
      await waitFor(() => {
        expect(wrapper.getByText("User Group")).toBeInTheDocument();
      });
      // Assert
      const table = wrapper.getByRole("grid");
      expect(table).toBeInTheDocument();
    });
    it("should render the 'Project Site Alias' label and a data grid table in the document", async () => {
      // Arrange
      await waitFor(() => {
        expect(wrapper.getByText("Project Site Alias")).toBeInTheDocument();
      });
      // Assert
      const table = wrapper.getByRole("grid");
      expect(table).toBeInTheDocument();
    });
    it("should render the 'Members Count' label and a data grid table in the document", async () => {
      // Arrange
      await waitFor(() => {
        expect(wrapper.getByText("Members Count")).toBeInTheDocument();
      });
      // Assert
      const table = wrapper.getByRole("grid");
      expect(table).toBeInTheDocument();
    });
   

     it('should fetch all the user groups', async () => {
      const response = await axios.get('/sites/ugr/group/userGroups');
      expect(response.status).toBe(200);
      expect(response.data).toEqual([{
          groupName: 'Infy3UG',
          id: 3,
          memberCount: 2,
          projectSites: [
              { projectSiteName: 'JTC2', projectSiteAlias: 'JTC2' },
              { projectSiteName: 'INFOSYS', projectSiteAlias: 'Infosys MG Site' },
              { projectSiteName: 'Test2_infy', projectSiteAlias: 'Infosys Test2 project site' },
          ],
      }]);
  });

  it("should fetch ProjectData", async () => {
    const response = await axios.get("/sites/project/projectSites");
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      {
        description: "INFOSYS",
        projectGroups: ["INFOSYS_Grp", "test_demo", "Test", "Infy3UG", "JTC2"],
        projectLocation: "Rohini,DL,IN",
        projectSiteAlias: "Infosys MG Site",
        projectSiteName: "INFOSYS"
    },
    ]);
  });
  it('renders the Guided Tour button with not-disabled state for those who have permission', async () => {
 

    // Re-render the component
    await act(async () => {
        wrapper.rerender(
            <Router>
                <ProjectProvider>
                    <HomePageContent />
                </ProjectProvider>
            </Router>
        );
    });

    const button = wrapper.getByText('Guided Tour').closest('button');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
});

});



