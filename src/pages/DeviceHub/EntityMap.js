/**EntityMap Component
 * 
 * EntityMap is a React component that displays a list of sensors for a specific project site.
 * It fetches the sensor data from a server using axios and the project site name from the ProjectContext.
 * The sensor list is initially hidden and can be toggled visible/invisible by clicking on the project site name.
*
  Author : Arpana Meshram
  Date : 12-10-2023
  Revision:
         1.0 - 12-10-2023  : Entity map design as per figma .
         2.0 - 22-11-2023  : Work on Entity Map page and Get sensorName from API
         3.0 - 29-02-2024  : Develop RBAC for Entity map page. 
         4.0 - 27-03-2023  : comment added for each function and variable.
         5.0 - 26-09-2024  : UI modification and performance optimation
 */
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import "../../styles/home.css";
import Grid from "@mui/material/Unstable_Grid2";
import SensorsIcon from "@mui/icons-material/Sensors";
import ArticleIcon from "@mui/icons-material/Article";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import Typography from "@mui/material/Typography";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";
import Swal from "sweetalert2";
import { useContext } from "react";
import { ProjectContext } from "../../ProjectContext";
import Card from "react-bootstrap/Card";
import { Spin } from "antd";
import { Stack } from "@mui/material";
import Loader from "../../components/common/LoaderDatagrid";
axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;
// EntityMap is the main component function.
const EntityMap = () => {
  const { projectSiteName } = useContext(ProjectContext);
  const [sensorList, setSensorList] = useState([]);
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  // useEffect hook is used to call the getSensorListDetails function when the component mounts.
  useEffect(() => {
    getSensorListDetails();
  }, []);
  // getSensorListDetails is an async function that fetches the sensor list from the server.
  const getSensorListDetails = async () => {
    try {
      const response = await axios.get(
        `/sites/sensor/sensorsForProjectSite/${projectSiteName}`
      );
      setSensorList(response.data);
     
        setIsLoading(false);
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setSensorList([]);
          setIsLoading(false);
      } else {
        Swal.fire("Error", error.response.data);
      }
    }
  };
  // handleClick is a function that toggles the state of open when it is called.
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <Layout>
        <Card
          style={{
            width: "100%",
            border: "none",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
          }}>
        
            <Card.Body>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className="myTypography">
                Entity Map
              </Typography>
              <div className="parentContainer">
                <Stack direction="row" className="my-0 mb-0 pt-2 d-block">
                  <div className="card-entity">
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={10} smOffset={4}>
                        <div className="mt-4">
                          <span className="entityHeading m-2">
                            <ArticleIcon /> Project
                          </span>
                          <span className="sensorListLi m-2">
                            <SensorsIcon /> Sensor
                          </span>
                        </div>

                        <div className="mt-5 ">
                          <div className="px-5 mt-3">
                            <div>
                              <h6
                                className="entityHeading m-0"
                                onClick={handleClick}>
                                {projectSiteName}
                                {open ? <ExpandMore /> : <ExpandLess />}
                              </h6>
                            </div>

                            <ul className="entityList">
                              <Collapse
                                in={open}
                                timeout="auto"
                                unmountOnExit
                                className="collapseW">
                                <div className="Listdiv">
                                  {sensorList.map((sensorL) => (
                                    <li key={sensorL.id}>
                                      <SensorsIcon /> {sensorL.SensorName}
                                    </li>
                                  ))}
                                </div>
                              </Collapse>
                            </ul>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </Stack>
              </div>
            </Card.Body>
            {isLoading && <Loader />}
        </Card>
      </Layout>
    </>
  );
};

export default EntityMap;
