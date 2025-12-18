/**HomePage.js
  *  @desc: This file is used for project schematic setting page where user can select the project site and configure the schematic configuration.
 Author : Shweta vyas & Arpana meshram
  Date : 05/20/2024
   Revision:

 */
import React, { useContext, useState, useEffect, useRef } from "react";
import { Button, FormControl } from "@mui/material";
import ProjectSite_Layout from "../../components/ProjectSite_Layout";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "react-bootstrap/Card";
import TextField from "@mui/material/TextField";
import "../../styles/Projectschematic.css";
import axios from "axios";
import { NodesContext } from "../../NodesContext";
import Autocomplete from "@mui/material/Autocomplete";
import { ProjectContext } from "../../ProjectContext";
import Swal from "sweetalert2";
import { fetchAssociatedProjects } from "../../features/permissions/userAssociatedProjectSlice";
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from "react-redux";


const initialFormData = {
  projectSiteName: "",
  schematicConfig: [],
};

const ProjectSchematicSetting = () => {
  const nodes = useContext(NodesContext);
  const { projectSiteName } = useContext(ProjectContext);
  const projectSiteNameRef = useRef();
  const [checkedNodes, setCheckedNodes] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const [projectSites, setProjectSites] = useState([]);
  const [selectedProjectSite, setSelectedProjectSite] = useState([]);
  const [users, setUsers] = useState([]);
  const [ProjectSiteName, setProjectSiteName] = React.useState("");
  const AssociatedProject = useSelector((state) => state.AssociatedProject);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.userRole);
  


  useEffect(() => {
    projectSitesApi();
  }, []);

  useEffect(() => {
    dispatch(fetchAssociatedProjects());
  }, [dispatch]);

  // Function to get the list of project sites name for the dropdown
  const projectSitesApi = async () => {
    try {
      let response = await axios.get("/sites/project/projectSitesList");
      setProjectSites(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(error.response.data);
      } else {
        console.log(error.response.data);
      }
    }
  };

  // Array of project sites available for configuration
  const availableProjectSites = projectSites.filter(
    (projectSite) => !users.some((user) => user.projectSiteName === projectSite)
  );

  // Function to save the configuration of nodes for the project site
  const handleSubmit = async () => {
    // Array of all checkbox groups
    const allCheckboxGroups = [checkboxGroup1, checkboxGroup2, checkboxGroup3, checkboxGroup4, checkboxGroup5, checkboxGroup6, checkboxGroup7, checkboxGroup8];

    // Check if at least one checkbox from any group is checked
    const anyChecked = allCheckboxGroups.some(group => {
      return group.some(name => {
        const foundNode = flattenedNodes.find(n => n.data && n.data.name && n.data.name.trim() === name);
        return foundNode && checkedNodes[foundNode.id];
      });
    });

    if (!anyChecked) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select at least one node',
      });
      return; // Exit the function
    }

    const modifiedNodes = flattenedNodes.map(node => ({
      ...node,
      isChecked: !!checkedNodes[node.id],
    }));
    const data = {
      projectSiteName: projectSiteNameRef.current,
      schematicConfig: modifiedNodes,
    };
    try {
      const response = await axios.put(`/sites/project/projectSite/projectSchematic/${projectSiteNameRef.current}`, data);
      console.log("Form data updated:", response.data);
      Swal.fire({
        icon: 'success',
        title: 'Added Successfully',
        // text: 'Updated Successfully',
      });
      setFormData(initialFormData);
      setCheckedNodes({}); // Reset the checked nodes
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data,
      });
      console.error("Error updating form data:", error);
    }
  };

  // Function to flatten the nodes data
  // const flattenedNodes = nodes.reduce((acc, curr) => {
  //   const nodeType = Object.keys(curr)[0];
  //   return [...acc, ...curr[nodeType]];
  // }, []);
 
  const flattenedNodes = nodes ? nodes.reduce((acc, curr) => {
    const nodeType = Object.keys(curr)[0];
    return [...acc, ...curr[nodeType]];
  }, []) : [];

  console.log("flattenedNodes", flattenedNodes);

  // Array of nodes grouped by their name
  const checkboxGroup1 = ["solar PV Node", "solar up arrow", "Solar PV"];
  const checkboxGroup2 = ["DGset down arrow", "DGset Node", "DG set"];
  const checkboxGroup3 = ["grid Arrow", "grid Node", "Grid"];
  const checkboxGroup4 = ["Electric Charging Node", "EV charger up arrow", "EV Charger"];
  const checkboxGroup5 = ["Battery Node", "Battery", "Battery down arrow"];
  const checkboxGroup6 = ["Fuel cell up arrow", "Fuel Node", "H2 Fuel"];
  const checkboxGroup7 = ["Wind plant down arrow", "Node Wind", "Wind"];
  const checkboxGroup8 = ["Node Eload up arrow", "Node Eload", "Electric load"];

  // Function to handle the checkbox change
   const handleCheckboxChange = (node, event) => {
    let group;
    if (node.data && node.data.name) {
      if (checkboxGroup1.includes(node.data.name.trim())) {
        group = checkboxGroup1;
      } else if (checkboxGroup2.includes(node.data.name.trim())) {
        group = checkboxGroup2;
      }
      else if (checkboxGroup3.includes(node.data.name.trim())) {
        group = checkboxGroup3;
      }
      else if (checkboxGroup4.includes(node.data.name.trim())) {
        group = checkboxGroup4;
      }
      else if (checkboxGroup5.includes(node.data.name.trim())) {
        group = checkboxGroup5;
      }
      else if (checkboxGroup6.includes(node.data.name.trim())) {
        group = checkboxGroup6;
      }
      else if (checkboxGroup7.includes(node.data.name.trim())) {
        group = checkboxGroup7;
      }
      else if (checkboxGroup8.includes(node.data.name.trim())) {
        group = checkboxGroup8;
      }
    }

    // If a group is found, check all nodes in the group, also retain the checked state configuration for the project site
    if (group) {
      const updatedCheckedNodes = { ...checkedNodes };
      group.forEach((name) => {
        const foundNode = flattenedNodes.find((n) => n.data && n.data.name && n.data.name.trim() === name);
        if (foundNode) {
          updatedCheckedNodes[foundNode.id] = event.target.checked;
        }
      });
      setCheckedNodes(updatedCheckedNodes);
    } else if (node.id) {
      setCheckedNodes(prevState => ({
        ...prevState,
        [node.id]: event.target.checked,
      }));
    }
  };
  console.log("checkedNodes", checkedNodes);

  return (
    <ProjectSite_Layout>
      <Card
        style={{   width: "100%",
        border: "none",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden", }}
        data-testid="card"
        //className="d-flex flex-wrap justify-content-start"
        >
        <Card.Body  data-testid="cardBody">
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            className="myTypography" data-testid="myTypography"
          >
            Project Schematic Configuration
          </Typography>
          <div className="parentContainer">
          <Stack component="form" spacing={2.3}  noValidate autoComplete="off" data-testid="stack"
                  className="py-5 px-3 d-flex flex-wrap justify-content-start bg-white rounded-lg" sx={{  borderRadius: "16px",
                    boxShadow: "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px,rgba(145, 158, 171, 0.08) 0px 12px 24px -4px"}}>
            <Autocomplete
              id="project-sites"
              variant="filled"
              name="Projectsite"
              placeholder="Select Project Site"
              className="w-25"
              options={userRole==="SuperAdmin" ? projectSites : AssociatedProject.map((option) => option.projectSiteName) }
              getOptionLabel={(option) => option || ""}
              onChange={async (event, newValue) => {
                projectSiteNameRef.current = newValue;
                setSelectedProjectSite(newValue);
                setProjectSiteName(newValue);
                try {
                  const response = await axios.get(`sites/project/projectSite/projectSchematic/${newValue}`);
                  const nodesData = response.data.schematicConfig.map(node => ({
                    ...node,
                  })).filter(node => node.isChecked);

                  const newCheckedNodes = {};
                  nodesData.forEach(node => {
                    newCheckedNodes[node.id] = node.isChecked;
                  });
                  setCheckedNodes(newCheckedNodes);
                } catch (error) {
                  // If a project site has not been configured yet, check all checkboxes by default.
                  const newCheckedNodes = {};
                  flattenedNodes.forEach(node => {
                    newCheckedNodes[node.id] = true;
                  });
                  setCheckedNodes(newCheckedNodes);
                }
              }}
              value={selectedProjectSite}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Project Site"
                  varient="filled"
                />
              )}
              // PaperComponent={({ children }) => (
              //   <Paper style={{ maxHeight: '160px', overflow: 'auto' }}>
              //     {children}
              //   </Paper>
              // )}
              style={{ paddingLeft: '10px' }}
            />

            <Stack spacing={2} className="my-3 mb-1 mx-2">
              <div className="cardcontainer">
                {flattenedNodes
                  .filter(node => node && node.type !== 'line'
                    && node.type !== 'Solar_arrow'
                    && node.type !== 'lineDotBottom' && node.type !== 'lineDotTop' && node.type !== 'Solarnode' && node.type !== 'ArrowNode' && node.type !== 'Dggsetnode' && node.type !== 'EVchargernode' && node.type !== 'Batterynode' && node.type !== 'Fuelcellnode' && node.type !== 'Windplantnode' && node.type !== 'Loadnode'
                  )
                  .map((node) => {
                    return (
                      <div key={node.id} className="m-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                        <div className="card-img" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <div className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              data-testid="checkboxcheck"
                              name={node.data.name}
                              title={node.data.name}
                              onChange={(event) => handleCheckboxChange(node, event)}
                              checked={checkedNodes[node.id] || false}
                            />
                          </div>
                          <p style={{ padding: '2px' }}>{node.data.name}</p>
                          <img src={node.data.src} height="60px" style={{ padding: '2px' }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Stack>

            <Button
              variant="contained"
              onClick={handleSubmit}
              size="small" className="w-25" style={{ marginLeft: '12px' }} data-testid="button">
              Submit
            </Button>

          </Stack>
          </div>
        </Card.Body>
      </Card>
    </ProjectSite_Layout>
  );
};

export default ProjectSchematicSetting;
