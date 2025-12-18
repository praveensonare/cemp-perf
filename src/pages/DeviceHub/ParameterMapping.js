import React from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import Grid from "@mui/material/Unstable_Grid2";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
//Project name dropdown
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
// import Button from '@material-ui/core/Button';
import { TextField } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import ModelForm from "../../components/common/ModelForm";
import { ProjectContext } from "../../ProjectContext";
import { useContext } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { Spin } from "antd";
import Loader from "../../components/common/LoaderDatagrid";
axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const DraggableParameter = ({ parameterName, id }) => {
  // Using the useDraggable hook to make the component draggable
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${id}_${parameterName}`,
  });
  // Styles for the draggable component
  const style = {
    position: "absolute",
    zIndex: 1000,
    ...transform,
  };
  // Returning the draggable component
  return (
    <h6
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={
        transform
          ? {
            ...style,
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
          }
          : style
      }
      // style={style}
      draggable="true"
      onDragStart={(event) =>
        event.dataTransfer.setData("text/plain", parameterName)
      }
    >
      {parameterName}
    </h6>
  );
};

const DroppableDetails = ({ children, id, onDrop, setDroppedId }) => {

  // Logging the props for debugging
  useEffect(() => {
    // Updating the droppedId state when the id prop changes
    if (setDroppedId) {
      setDroppedId(id);
    }
  }, [id, setDroppedId]);
  // Using the useDroppable hook to make the component droppable
  const { setNodeRef, isOver } = useDroppable({
    id,
    onDrop: (data) => onDrop(data),
  });
  // Styles for the droppable component
  const style = {
    backgroundColor: isOver ? "#ECECEc" : "#fff",
  };
  // Returning the droppable component
  return (
    <AccordionDetails ref={setNodeRef} style={style}>
      {children}
    </AccordionDetails>
  );
};

const ParameterMapping = () => {
  const [sensorData, setSensorData] = useState([]);
  const [sensorTypeData, setSensorTypeData] = useState([]);
  const [newAccordions, setNewAccordions] = useState([]);
  const [droppedId, setDroppedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const { projectSiteName } = useContext(ProjectContext);
  const [isLoading, setIsLoading] = useState(true);
  const { gatewayName } = useParams();
  const [keyNameError, setKeyNameError] = useState("");

  // Handles the event when the 'open' state changes
  const handleClose = () => {
    setOpen(false);
  };

  // Handles the event when an item is dropped
  const handleDrop = (data) => {
    const draggableId = data.active.id;
    let ActualParameter = draggableId.replace("draggable-", "");
    const droppedId = data.over ? data.over.id : null;
    setNewAccordions((prev) => {
      const isParameterAlreadyPresent = prev.some(
        (accordion) => accordion.ActualParameter === ActualParameter
      );

      if (isParameterAlreadyPresent) {
        message.error("This parameter is already present");
        return prev;
      } else {
        return prev.map((accordion) => {
          if (accordion.id === droppedId) {
            return { ...accordion, ActualParameter: ActualParameter };
          } else {
            return accordion;
          }
        });
      }
    });
  };

  // Fetches sensor and sensor type data when the component mounts
  useEffect(() => {
    try {
      axios
        .get(`/sites/sensor/sensorsForProjectSite/${projectSiteName}`)
        .then((response) => {
          setSensorData(response.data);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: JSON.stringify(error.response.data),
            });
            setIsLoading(false);

          }
          else {
            Swal.fire("Error", error.response.data);
          }
        });

      axios
        .get("/sites/sensor/type/sensorTypes")
        .then((response) => {
          setSensorTypeData(response.data);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: JSON.stringify(error.response.data),
            });
            setIsLoading(false);
          }
          else {
            Swal.fire("Error", error.response.data);
          }
        });
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setIsLoading(false);
      }
      else {
        Swal.fire("Error", error.response.data);
      }
    }
  }, []);

  // Fetches parameters when the 'open' state changes
  useEffect(() => {
    try {
      if (open) {
        axios
          .get(`/sites/gateway/parameters/${projectSiteName}`)
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              Swal.fire({
                icon: "info",
                title: "Info",
                text: JSON.stringify(error.response.data),
              });
              setIsLoading(false);
            }
            else {
              Swal.fire("Error", error.response.data);
            }
          });
      }
    } catch (error) {
      console.error("Unexpected error", error);
    }
  }, [open]);

  // Adds a new accordion to the list
  const handleAddClick = () => {
    setNewAccordions((prev) => [
      { Key: "", id: Math.random().toString() },
      ...prev,
    ]);
  };

  // Handles the change of input fields
  const handleInputChange = (event, index) => {
    const { value } = event.target;

    setNewAccordions((prev) => {
      const copy = [...prev];
      copy[index].Key = value; // use newValue instead of value
      return copy;
    });

    // Check if key name already exists
    const keyNameExists = newAccordions.some(
      (accordion, accordionIndex) => accordion.Key === value && accordionIndex !== index
    );

    if (keyNameExists) {
      message.error("This key name is already present");
    } else {
      setKeyNameError("");
    }
  };

  // Returns the parameters of a given sensor type
  const getSensorTypeParameters = (sensorTypeName) => {
    const sensorType = sensorTypeData.find(
      (item) => item.SensorTypeName === sensorTypeName
    );
    return sensorType ? sensorType.SensorTypeParameters : [];
  };

  // Handles the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const isAnyFieldEmpty = newAccordions.some(
      (accordion) => !accordion.Key || !accordion.ActualParameter
    );

    if (isAnyFieldEmpty) {
      message.error("Both Key Name and Actual Parameter are required");
      return;
    }

    // Check if any key name is duplicated
    const keyNames = newAccordions.map((accordion) => accordion.Key);
    const hasDuplicateKeyNames = keyNames.some(
      (key, index) => keyNames.indexOf(key) !== index
    );

    if (hasDuplicateKeyNames) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'A key name is duplicated',
      });
      return;
    }

    const data = newAccordions.map((accordion) => ({
      ActualParameter: accordion.ActualParameter,
      Key: accordion.Key,
    }));

    try {
      const response = await axios.post(
        `/sites/gateway/parameters/${gatewayName}`,
        data
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data,
      });
      console.log(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setIsLoading(false); // Stop the loader
      } else {
        Swal.fire("Error", error.response.data);
      }
    }
  };
  // Deletes an accordion from the list
  const handleDeleteClick = (event, index) => {
    event.stopPropagation(); // Prevent the accordion from expanding
    setNewAccordions((prev) => prev.filter((accordion, i) => i !== index)); // Remove the accordion at the given index
  };
  
  // Fetches parameters when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `sites/gateway/parameters/${gatewayName}`
        );
        var data = response.data;
        data = data.map((item, index) => ({
          ...item,
          id: `item-${index}`,
        }));

        setNewAccordions(data);
        setIsLoading(false);
      }

      catch (error) {
        if (error.response.status === 404) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: JSON.stringify(error.response.data),
          });
          setNewAccordions([]);
          setIsLoading(false);// Stop the loader
        } else {
          Swal.fire("Error", error.response.data);
        }
      }
    }

    fetchData();
  }, []);



  return (
    <>
      <ModelForm open={open} onClose={handleClose}>
        <div>
          <h3>JSON Mapping</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Actual Parameter</th>
                <th>Key</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.Key}>
                  <td>{item.ActualParameter}</td>
                  <td>{item.Key}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ModelForm>
      <Layout>
        <>
          {/* <Card style={{ width: "100%", border: "none" }}> */}
          <Card.Body data-testid="cardBody">
            <Grid container spacing={2} data-testid="grid-body">
              <DndContext onDragEnd={handleDrop}>
                <Grid xs={12} sm={4}>
                  <box>
                    {/* <div className="cardbox p-4"> */}
                    <div
                      id="main"
                      style={{
                        display: "flex",
                        marginBottom: "10px",
                        justifyContent: "space-between",
                        backgroundColor: "#fff",
                        padding: "10px",
                      }}
                    >
                      <h2 class="card-title" style={{ marginTop: "10px" }}>
                        Project Tree
                      </h2>

                    </div>
                    <div style={{ maxHeight: "450px", overflowY: "auto", overflowX: "hidden" }}>
                      {sensorData.map((sensor, index) => (
                        <Accordion key={index} defaultExpanded={true}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <h6>{sensor.SensorName}</h6>
                          </AccordionSummary>
                          <DroppableDetails
                            droppableId={`${sensor.SensorName}-${index}`}
                          >
                            <AccordionDetails>
                              {getSensorTypeParameters(
                                sensor.SensorTypeName
                              ).map((param, paramIndex) => (
                                <div
                                  key={sensor.SensorName}
                                  style={{
                                    //  borderBottom: "1px solid #D8D8D8",
                                    padding: "20px 0",
                                  }}
                                >
                                  <DraggableParameter
                                    parameterName={param.ParameterName}
                                    id={sensor.SensorName}
                                  />
                                </div>
                              ))}
                            </AccordionDetails>
                          </DroppableDetails>
                        </Accordion>
                      ))}
                    </div>
                  </box>
                </Grid>

                {/* ... */}
                <Grid xs={12} sm={8}>
                  {/* <h4 className="borderBottom">Mapping Section</h4> */}
                  <div
                    id="main"
                    style={{
                      display: "flex",
                      marginBottom: "10px",
                      justifyContent: "space-between",
                      backgroundColor: "#fff",
                      padding: "10px",
                    }}
                  >
                    <h2 class="card-title" style={{ marginTop: "10px" }}>
                      Mapping Section
                    </h2>

                  </div>
                  <div
                    id="main"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor: "#fff",
                      padding: "10px",
                    }}
                  >
                    <h5 class="card-title mt-3 ml-5">Parameters Count : {newAccordions.length <= 0 ? 0 : newAccordions.length}</h5>

                    <Button
                      variant="contained"
                      className="button_color"
                      onClick={handleAddClick}
                      startIcon={<AddCircleIcon />}
                      style={{ marginRight: "16px" }}
                      data-testid="create-mapping-button"
                    >
                      Create Mapping
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* post data  */}
                    <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                      {newAccordions.map((accordion, index) => (
                        <Accordion
                          key={`accordion-${index}`}
                          defaultExpanded={true}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            style={{
                              backgroundColor: "rgba(33, 150, 243, 0.10)",
                            }}
                          >
                            <TextField
                              id="filled-basic"
                              variant="filled"
                              size="small"
                              label="Key Name"
                              value={accordion.Key}
                              onChange={(event) => handleInputChange(event, index)}
                              onClick={(event) => event.stopPropagation()}
                              onKeyPress={(event) => {
                                if (event.key === " ") {
                                  event.preventDefault();
                                }
                              }}
                              InputProps={{
                                disableUnderline: true,
                                sx: { borderRadius: 1 },
                              }}
                            />

                            <svg
                              style={{
                                marginTop: "0.8rem",
                                marginLeft: "1rem",
                              }}
                              onClick={(event) =>
                                handleDeleteClick(event, index)
                              }
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="20"
                              viewBox="0 0 18 20"
                              fill="none"
                            >
                              <path
                                d="M15.9391 6.69713C16.1384 6.69713 16.3193 6.78413 16.4623 6.93113C16.5955 7.08813 16.6626 7.28313 16.6432 7.48913C16.6432 7.55712 16.1102 14.2971 15.8058 17.134C15.6152 18.875 14.4929 19.932 12.8094 19.961C11.5149 19.99 10.2496 20 9.00379 20C7.68112 20 6.38763 19.99 5.13206 19.961C3.50498 19.922 2.38168 18.846 2.20079 17.134C1.88763 14.2871 1.36439 7.55712 1.35467 7.48913C1.34494 7.28313 1.41108 7.08813 1.54529 6.93113C1.67756 6.78413 1.86818 6.69713 2.06852 6.69713H15.9391ZM11.0647 0C11.9488 0 12.7385 0.616994 12.967 1.49699L13.1304 2.22698C13.2627 2.82197 13.7781 3.24297 14.3714 3.24297H17.2871C17.6761 3.24297 18 3.56596 18 3.97696V4.35696C18 4.75795 17.6761 5.09095 17.2871 5.09095H0.713853C0.32386 5.09095 0 4.75795 0 4.35696V3.97696C0 3.56596 0.32386 3.24297 0.713853 3.24297H3.62957C4.22185 3.24297 4.7373 2.82197 4.87054 2.22798L5.02323 1.54598C5.26054 0.616994 6.0415 0 6.93527 0H11.0647Z"
                                fill="#FF5555"
                              />
                            </svg>
                          </AccordionSummary>

                          {console.log("indexxxxxxxxx dropanle", index)}
                          <DroppableDetails
                            id={accordion.id}
                            onDrop={handleDrop}
                            setDroppedId={setDroppedId}
                            data-testid="droppable-details"
                          >
                            <h6 style={{ padding: "13px" }}>
                              {accordion.ActualParameter}
                            </h6>
                          </DroppableDetails>
                        </Accordion>
                      ))}
                    </div>
                    <Button
                      variant="contained"
                      type="submit"
                      style={{ marginTop: "20px" }}
                    >
                      Save
                    </Button>
                  </form>
                </Grid>
              </DndContext>
            </Grid>
            {isLoading && <Loader />}
          </Card.Body>

        </>
      </Layout>
    </>
  );
};

export default ParameterMapping;
