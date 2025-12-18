/**SensorType component
 * 
 * This page displays a table of sensor types and allows users to perform actions like editing, deleting, and copying sensor types.
 * Users can also view detailed information about a sensor type and its parameters.
 * 
  Author : Arpana Meshram
  Date : 12-08-2023
  Revision:
         1.0 - 27-09-2023  : Development of React.JS code for Device hub-Sensor type.
         2.0 - 28-11-2023  : API integration for Device hub-Sensor type
         3.0 - 07-12-2023  : UI Changes: Modification in Sensor Type table and corresponding popup screen as per the API
         4.0 - 07-02-2024  : Parameter is not updating in SensorType page 
         5.0 - 29-02-2024  : Develop RBAC for Device Hub- Sensor Type.  
         6.0 - 15-03-2024  : comment added for each function and variable.
         7.0 - 05-04-2024  : Bug fixing in Sensor Type.
         Author : shweta vyas
          Date : 04-12-2024: Stepper form buttons modification
*/

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import { message } from "antd";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { Spin } from "antd";
import Swal from "sweetalert2";
import "../../styles/Sensor.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DialogBox from "../../components/common/DialogBox";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CustomNoRowsOverlay from "../../components/common/CustomNoRowsOverlay";
import Loader from "../../components/common/LoaderDatagrid";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import ModelForm from "../../components/common/ModelForm";
//RBAC
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../../features/permissions/permissionsSlice";
import { fetchrole } from "../../features/permissions/userroleSlice";

const initialFormData = {
  SensorTypeLogicalName: "",
  SensorTypeDescription: "",
  SensorTypeName: "",
  SensorTypeParameters: [
    {
      ParameterUnit: "",
      DataType: "",
      ParameterName: "",
    },
  ],
};
axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;
export default function DataTable() {
  const steps = ["Details", "Parameters"];
  //data grid columns
  const columns = React.useMemo(() => [
    {
      field: "SensorTypeName",
      headerName: "Sensor Type",
      align: "left",
      headerAlign: "left",
      flex: 1.5,
      headerClassName: "header-project-name",
      renderCell: (params) => {
        return (
          <div style={{ marginLeft: "25px" }}> {params.row.SensorTypeName}</div>
        );
      },
    },
    {
      field: "parameterListCount",
      headerName: "Parameters Count",
      flex: 1.5,
      filterable: false, // Ensure the column is not filterable
      renderCell: (params) => {
        const parameters = params.row.SensorTypeParameters.length;
        return <div style={{ marginLeft: "25px" }}> {parameters}</div>;
      },
    },
    {
      field: "Action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      flex: 1,
      filterable: false, // Ensure the column is not filterable
      renderCell: (params) => {
        return (
          <div>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickInfoButton
                  ? "You do not have permission"
                  : "Info"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  className="info-button"
                  style={{
                    marginRight: 5,
                  }}
                  disabled={userRole !== "SuperAdmin" && !canClickInfoButton}
                  onClick={() => handleInfo(params.row.SensorTypeName, true)}
                  key={params.row.SensorTypeName}
                  data-testid="info-button"
                >
                  <InfoIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickEditButton
                  ? "You do not have permission"
                  : "Edit"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  className="edit-button"
                  disabled={userRole !== "SuperAdmin" && !canClickEditButton}
                  style={{ marginRight: 5 }}
                  onClick={() => handleEdit(params.row.SensorTypeName, false)}
                  key={params.row.SensorTypeName}
                  data-testid="edit-button"
                >
                  <EditIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickDeleteButton
                  ? "You do not have permission"
                  : "Delete"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  style={{ marginRight: 5 }}
                  onClick={() => handleOpenDelete(params.row.SensorTypeName)}
                  disabled={userRole !== "SuperAdmin" && !canClickDeleteButton}
                  key={params.row.SensorTypeName}
                  className="delete-button"
                  data-testid="delete-button"
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickCopyButton
                  ? "You do not have permission"
                  : "Copy"
              }
              arrow
            >
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  color="success"
                  className="info-button"
                  onClick={() => handleCopy(params.row.SensorTypeName)}
                  disabled={userRole !== "SuperAdmin" && !canClickCopyButton}
                  key={params.row.SensorTypeName}
                  data-testid="copy-buttontest"
                >
                  <ContentCopyIcon fontSize="small" />
                </Button>
              </span>
            </Tooltip>
          </div>
        );
      },
    },
  ]);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [SensorTypes, setSensorTypes] = useState([]);
  const [editedSensorType, setEditedSensorType] = useState(null);
  const [open5, setOpen5] = React.useState(false);
  const [info, setInfo] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [showCheckIcon, setShowCheckIcon] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageparamter, setErrorparamter] = useState("");
  const [errorMessageBlank, setErrorMessageblank] = useState("");
  const [SensorTypeName, setSensorTypeName] = useState(null);
  const [messageInfo, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [SensorTypeNameError, setSensorTypeNameError] = useState("");
  const [SensorTypeLogicalNameError, setSensorTypeLogicalNameError] =
    useState("");
  const [SensorTypeDescriptionError, setSensorTypeDescriptionError] =
    useState("");
  const [SensorTypeParametersError, setSensorTypeParametersError] =
    useState("");
  const [isInfoClicked, setIsInfoClicked] = useState(false);
  const [formData, setFormData] = useState({
    SensorTypeLogicalName: "",
    SensorTypeDescription: "",
    SensorTypeName: "",
    SensorTypeParameters: [],
  });
  //RBAC
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  // console.log("permissions", permissions);
  const userRole = useSelector((state) => state.userRole);
  const canClickInfoButton = permissions.includes("canClickOnInfoSensorType");
  const canClickDeleteButton = permissions.includes(
    "canClickOnDeleteSensorType"
  );
  const canClickCreateSensorButton = permissions.includes(
    "canClickOnCreateSensorType"
  );
  const canClickEditButton = permissions.includes("canClickOnEditSensorType");
  const canClickCopyButton = permissions.includes("canClickOnCopySensorType");

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  const handleNext = () => {
    if (!formData.SensorTypeName || !formData.SensorTypeName.trim()) {
      setSensorTypeNameError(
        "Sensor Type Name cannot be empty or contain spaces"
      );
      return;
    } else {
      setSensorTypeNameError("");
    }
    if (
      !formData.SensorTypeLogicalName ||
      !formData.SensorTypeLogicalName.trim()
    ) {
      setSensorTypeLogicalNameError("SensorType Logical Name cannot be empty");
      return;
    } else {
      setSensorTypeLogicalNameError("");
    }
    if (
      !formData.SensorTypeDescription ||
      !formData.SensorTypeDescription.trim()
    ) {
      setSensorTypeDescriptionError("SensorType Description cannot be empty");
      return;
    } else {
      setSensorTypeDescriptionError("");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  //back functionality
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //open the model form
  const handleClickOpen = () => {
    reSet();
    setIsDisabled(false);
    setIsViewMode(false);
    setIsInfoClicked(false);
    setOpen(true);
    setEditData(null);
    setEditedSensorType(null);
    setErrorMessage(null);
    setFormData(initialFormData);
    setFormData({
      SensorTypeParameters: [
        { ParameterName: "", DataType: "", ParameterUnit: "" },
      ],
    });
    setShowCheckIcon(false);
  };

  //close the model form
  const handleClose = () => {
    reSet();
    setOpen(false);
  };

  //reset the form
  const reSet = () => {
    setSensorTypeLogicalNameError("");
    setErrorMessageblank("");
    setSensorTypeNameError("");
    setSensorTypeDescriptionError("");
    setSensorTypeParametersError("");
    setFormData(initialFormData);
    setActiveStep(0);
    setMessage(null);
    setErrorparamter(null);
  };

  const addInputField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      SensorTypeParameters: [
        ...prevFormData.SensorTypeParameters,
        {
          ParameterUnit: "",
          DataType: "",
          ParameterName: "",
        },
      ],
    }));
  };

  useEffect(() => {
    getAllsensorTypes();
    //  getsensorTypes();
  }, []);

  // getAllsensorTypes function fetches the sensortype.
  const getAllsensorTypes = async () => {
    try {
      await axios.get(`/sites/sensor/type/sensorTypes`).then((response) => {
        setSensorTypes(response.data);
        setIsLoading(false);
        response.data.forEach((sensorType) => {
          // console.log("data 13", sensorType.SensorTypeParameters);
          const parameterListCount = sensorType.SensorTypeParameters.length;
          // console.log(parameterListCount);
        });
      });
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setSensorTypes([]);
        setIsLoading(false); // Stop the loader
      } else {
        Swal.fire("Error", error.response.data);
      }
    }
    setIsLoading(false);
  };

  const handleChange = (event, index) => {
    const { name, value } = event.target;

    let modifiedValue =
      name === "SensorTypeName"
        ? value.toUpperCase().replace(/\s/g, "_")
        : value; // replace spaces with underscores only for SensorTypeName

    if (
      name === "SensorTypeName" &&
      SensorTypes.some(
        (sensorType) =>
          sensorType.SensorTypeName.toUpperCase().replace(/\s/g, "_") ===
          modifiedValue
      )
    ) {
      setErrorMessage("SensorTypeName already exists");
    } else {
      setErrorMessage("");
    }

    if (
      name === "ParameterName" &&
      formData.SensorTypeParameters.some(
        (parameter) => parameter.ParameterName === value
      )
    ) {
      setErrorparamter("Parameter already exists");
    } else {
      setErrorparamter("");
    }

    setFormData((prevState) => {
      if (
        name === "SensorTypeName" ||
        name === "SensorTypeLogicalName" ||
        name === "SensorTypeDescription"
      ) {
        return {
          ...prevState,
          [name]: modifiedValue,
        };
      } else if (prevState.SensorTypeParameters[index]) {
        const newSensorTypeParameters = [...prevState.SensorTypeParameters];
        newSensorTypeParameters[index][name] = modifiedValue;

        return {
          ...prevState,
          SensorTypeParameters: newSensorTypeParameters,
        };
      }
    });
  };

  // handleSubmit function triggered when the user submits the SesnorType form.
  const handleSubmit = async (event, SensorTypeName) => {
    setShowCheckIcon(true);
    event.preventDefault();
    const formDataWithBase64 = {
      SensorTypeName: formData.SensorTypeName,
      SensorTypeLogicalName: formData.SensorTypeLogicalName,
      SensorTypeDescription: formData.SensorTypeDescription,
      SensorTypeParameters: formData.SensorTypeParameters.map((parameter) => ({
        ParameterName: parameter.ParameterName,
        DataType: parameter.DataType,
        ParameterUnit: parameter.ParameterUnit,
        ID: parameter.ID,
      })),
    };
    if (editedSensorType !== null) {
      await axios
        .put(
          `/sites/sensor/type/sensorTypeLogicalNameAndDescription/${formData.SensorTypeName}`,
          {
            SensorTypeLogicalName: formData.SensorTypeLogicalName,
            SensorTypeDescription: formData.SensorTypeDescription,
          }
        )
        .then((response) => {
          setFormData(initialFormData);
          setActiveStep(0);
          getAllsensorTypes();
          setOpen(false);
          Swal.fire({
            icon: "success",
            title: "Updated successfully",
            text: response.data,
          });
        })
        .catch((error) => {
          Swal.fire("Error", error.response.data);
        });
      setFormData(initialFormData);
      getAllsensorTypes();
      setActiveStep(0);
      setOpen(false);
    } else {
      setShowCheckIcon(false);
      for (let param of formData.SensorTypeParameters) {
        if (!param.ParameterName || !param.ParameterName.trim()) {
          setSensorTypeParametersError("ParameterName cannot be empty");
          return;
        } else if (!param.DataType) {
          setSensorTypeParametersError("DataType cannot be empty");
          return;
        } else if (!param.ParameterUnit || !param.ParameterUnit.trim()) {
          setSensorTypeParametersError("ParameterUnit cannot be empty");
          return;
        } else {
          setSensorTypeParametersError("");
        }
      }
      axios
        .post("/sites/sensor/type", formDataWithBase64)
        .then((response) => {
          console.log("Form data submitted:", response.data);
          setFormData(initialFormData);
          setActiveStep(0);
          getAllsensorTypes();
          setOpen(false);
          Swal.fire({
            icon: "success",
            title: "Added successfully",
            text: JSON.stringify(response.data),
          });
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response);
          Swal.fire("Error", error.response.data);
        });
    }
  };

  //modal form to view the user details when clicked on Info button
  const handleInfo = (SensorTypeName) => {
    setMessage("You don't have permission to edit in view mode");
    setShowCheckIcon(true);
    setIsInfoClicked(true);
    const ViewUser = SensorTypes.find(
      (user) => user.SensorTypeName === SensorTypeName
    );
    if (ViewUser) {
      ViewUser.SensorTypeParameters = ViewUser.SensorTypeParameters || [];
      setInfo(ViewUser);
      setOpen(true);
      setIsDisabled(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        SensorTypeName: ViewUser.SensorTypeName,
        SensorTypeLogicalName: ViewUser.SensorTypeLogicalName,
        SensorTypeDescription: ViewUser.SensorTypeDescription,
        SensorTypeParameters: ViewUser.SensorTypeParameters.map(
          (parameter) => ({
            ParameterUnit: parameter.ParameterUnit,
            DataType: parameter.DataType,
            ParameterName: parameter.ParameterName,
            ID: parameter.ID,
          })
        ),
      }));
    } else {
      console.error(`No user found with email: ${SensorTypeName}`);
    }
    setIsDisabled(true);
  };

  //modal form to Edit the user details when clicked on Edit button
  const handleEdit = (SensorTypeName) => {
    setIsInfoClicked(false);
    setShowCheckIcon(true);
    setIsViewMode(true);
    setEditedSensorType(SensorTypeName);
    const selectedSensorType = SensorTypes.find(
      (user) => user.SensorTypeName === SensorTypeName
    );
    if (selectedSensorType) {
      setOpen(true);
      selectedSensorType.SensorTypeParameters =
        selectedSensorType.SensorTypeParameters || [];
      setFormData((prevFormData) => ({
        ...prevFormData,
        SensorTypeName: selectedSensorType.SensorTypeName,
        SensorTypeLogicalName: selectedSensorType.SensorTypeLogicalName || "",
        SensorTypeDescription: selectedSensorType.SensorTypeDescription || "",
        SensorTypeParameters: selectedSensorType.SensorTypeParameters.map(
          (parameter) => ({
            ParameterUnit: parameter.ParameterUnit,
            DataType: parameter.DataType,
            ParameterName: parameter.ParameterName,
            ID: parameter.ID,
          })
        ),
      }));
      setActiveStep(0);
      console.log(selectedSensorType.SensorTypeParameters);
    }
    setIsDisabled(false);
  };

  // handleCopy function is triggered when a user wants to copy a SensorType.
  const handleCopy = async (SensorTypeName) => {
    setOpen(true);
    setActiveStep(0);
    setIsDisabled(false);
    setIsViewMode(false);
    setShowCheckIcon(false);
    const selectedSensorType = SensorTypes.find(
      (sensorType) => sensorType.SensorTypeName === SensorTypeName
    );
    if (selectedSensorType) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        SensorTypeName: "",
        SensorTypeLogicalName: "",
        SensorTypeDescription: "",
        SensorTypeParameters: selectedSensorType.SensorTypeParameters.map(
          (parameter) => ({
            ParameterUnit: parameter.ParameterUnit,
            DataType: parameter.DataType,
            ParameterName: parameter.ParameterName,
          })
        ),
      }));
      // Make axios call here

      await axios
        .post("/sites/sensor/type", formData)
        .then((response) => {
          console.log("Form data submitted:", response.data);
          // Perform any additional actions here
          setFormData(initialFormData);
          setActiveStep(0);
          getAllsensorTypes();
          setOpen(false);
          Swal.fire("Added successfully", response.data);
        })
        .catch((error) => {
          // Swal.fire("Error", error.response.data);
          // us_18224_sensorCopy issue
        });
    }
  };



  //for sensortype paramter delete
  const removeInputFields = async (ID, index) => {
    try {
      const sensorTypeParameters = formData.SensorTypeParameters;
      const SensorTypeName = formData.SensorTypeName;
      if (sensorTypeParameters.length <= 1) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: `You want to delete the parameter with sensorType ${SensorTypeName} ?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, keep it",
        });

        if (!result.value) {
          return;
        }
      }

      if (ID) {
        try {
          await axios
            .delete(`/sites/sensor/type/parameter/${ID}`)
            .then((response) => {
              getAllsensorTypes();
              setFormData((prevFormData) => {
                const newSensorTypeParameters =
                  prevFormData.SensorTypeParameters.filter(
                    (parameter) => parameter.ID !== ID
                  );
                if (newSensorTypeParameters.length === 0) {
                  setOpen(false); // Reset activeStep to 0 to close the stepper
                }
                return {
                  ...prevFormData,
                  SensorTypeParameters: newSensorTypeParameters,
                };
              }, getAllsensorTypes);
              message.success(response.data);
            });
        } catch (error) {
          Swal.fire("Error", error.response.data);
        }
      } else {
        try {
          setFormData((prevFormData) => {
            const newSensorTypeParameters = [
              ...prevFormData.SensorTypeParameters,
            ];
            newSensorTypeParameters.splice(index, 1);
            return {
              ...prevFormData,
              SensorTypeParameters: newSensorTypeParameters,
            };
          });
          message.success("Row deleted");
        } catch (error) {
          Swal.fire("Error", error.toString());
        }
      }
    } catch (error) {
      Swal.fire("Error", error.response.data);
    }
  };

  //for sensortype paramter update
  const UpdateParameter = async (ID) => {
    const parameterToEdit = formData.SensorTypeParameters.find(
      (parameter) => parameter.ID === ID
    );
    for (let param of formData.SensorTypeParameters) {
      if (!param.ParameterName || !param.ParameterName.trim()) {
        setSensorTypeParametersError("Parameter Name cannot be empty");
        return;
      } else if (!param.DataType) {
        setSensorTypeParametersError("DataType cannot be empty");
        return;
      } else if (!param.ParameterUnit || !param.ParameterUnit.trim()) {
        setSensorTypeParametersError("Parameter Unit cannot be empty");
        return;
      } else {
        setSensorTypeParametersError("");
      }
    }
    if (ID) {
      if (parameterToEdit) {
        try {
          const response = await axios.put(
            `/sites/sensor/type/parameter`,
            parameterToEdit
          );
          getAllsensorTypes();
          message.success(response.data);
        } catch (error) {
          //message.error(error.response.data);
        }
      }
    } else if (!ID) {
      for (const parameterToUpdate of formData.SensorTypeParameters) {
        // Only post the parameter if it's new
        if (parameterToUpdate.ID == null) {
          await axios
            .post(`/sites/sensor/type/parameter/${formData.SensorTypeName}`, {
              DataType: parameterToUpdate.DataType,
              ParameterName: parameterToUpdate.ParameterName,
              ParameterUnit: parameterToUpdate.ParameterUnit,
              SensorTypeDescription: formData.SensorTypeDescription,
              SensorTypeLogicalName: formData.SensorTypeLogicalName,
            })
            .then((response) => {
              console.log("Form data submitted:", response.data);
              getAllsensorTypes();
              message.success(response.data.message);
            })
            .catch((error) => {
              //Swal.fire("Error", error.response.data);
              // message.error(error.response.data);
            });
        }
      }
    }
  };
  //open the model
  const handleOpenDelete = (SensorTypeName) => {
    setSensorTypeName(SensorTypeName);
    setOpen5(true);
  };
  //close the model
  const handleCloseDelete = () => {
    setOpen5(false);
  };
  //delete popup
  const handleDelete = async () => {
    await axios
      .delete(`/sites/sensor/type/sensorType/${SensorTypeName}`)
      .then((response) => {
        setOpen5(false);
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: response.data,
        });
        getAllsensorTypes();
      })
      .catch((error) => {
        setOpen5(false);
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
      });
  };
  //form stepes
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="userdetail mt-4">
            <Stack
              component="form"
              sx={{ width: "100%" }}
              spacing={2.3}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="filled-basic"
                label="Sensor Type Name*"
                name="SensorTypeName"
                value={
                  formData.SensorTypeName ||
                  (editData ? editData.SensorTypeName : "")
                }
                onChange={handleChange}
                variant="filled"
                className=""
                InputProps={{
                  disableUnderline: true,
                  readOnly: isViewMode,
                }}
                disabled={isDisabled}
              />

              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              {SensorTypeNameError && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
                >
                  {SensorTypeNameError}
                </div>
              )}
              <TextField
                id="filled-basic"
                label="Sensor Type Logical Name*"
                name="SensorTypeLogicalName"
                value={
                  formData.SensorTypeLogicalName ||
                  (editData ? editData.SensorTypeLogicalName : "")
                }
                onChange={handleChange}
                disabled={isDisabled}
                variant="filled"
                className=""
                InputProps={{ disableUnderline: true }}
              />
              {SensorTypeLogicalNameError && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
                >
                  {SensorTypeLogicalNameError}
                </div>
              )}
              <TextField
                multiline
                rows={3}
                id="filled-basic"
                label="Sensor Type Description*"
                name="SensorTypeDescription"
                value={
                  formData.SensorTypeDescription ||
                  (editData ? editData.SensorTypeDescription : "")
                }
                onChange={handleChange}
                disabled={isDisabled}
                variant="filled"
                className=""
                InputProps={{ disableUnderline: true }}
              />
              {errorMessageBlank && (
                <p
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
                >
                  {errorMessageBlank}
                </p>
              )}
              {SensorTypeDescriptionError && (
                <div
                  style={{ color: "red", marginTop: "4px", marginLeft: "4px" }}
                >
                  {SensorTypeDescriptionError}
                </div>
              )}
              {messageInfo && <div style={{ color: "red" }}>{messageInfo}</div>}
            </Stack>
          </div>
        );
      case 1:
        return (
          <div className="userdetail mybox mt-4">
            {/* <h3 className='Project_Heading'>Ad User</h3> */}
            <Stack component="form" noValidate autoComplete="off">
              <div className="d-flex">
                <p style={{ width: "145px" }} className="m-0">
                  Parameter Name*
                </p>
                <p style={{ width: "125px" }} className="m-0">
                  DataType*
                </p>
                <p style={{ width: "90px" }} className="m-0">
                  Unit*
                </p>
              </div>
              <div className="paramterDiv">
                {formData.SensorTypeParameters.map((parameter, index, ID) => (
                  <div key={index} className="d-flex">
                    <TextField
                      id="filled-basic"
                      name="ParameterName"
                      onChange={(event) => handleChange(event, index)}
                      variant="filled"
                      disabled={isDisabled}
                      className="m-1"
                      value={parameter.ParameterName}
                      style={{ width: "133px" }}
                    />
                    <FormControl variant="filled">
                      <Select
                        name="DataType"
                        disabled={isDisabled}
                        className="m-1"
                        onChange={(event) => handleChange(event, index)}
                        value={parameter.DataType}
                        style={{ width: "112px" }}
                      >
                        <MenuItem value="Float">Float</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      id="filled-basic"
                      name="ParameterUnit"
                      onChange={(event) => handleChange(event, index)}
                      variant="filled"
                      disabled={isDisabled}
                      className="m-1"
                      value={parameter.ParameterUnit}
                      style={{ width: "90px" }}
                    />

                    <div style={{ width: "5px" }}>
                      <IconButton
                        aria-label="update"
                        size="small"
                        className="p-0"
                        onClick={() => UpdateParameter(parameter.ID)}
                        disabled={isDisabled}
                      >
                        {showCheckIcon && (
                          <span>
                            <Tooltip title="Update" arrow placement="left">
                              <CheckIcon
                                fontSize="small"
                                style={{
                                  backgroundColor: isDisabled
                                    ? "grey"
                                    : "green",
                                  color: "white",
                                  borderRadius: "2px",
                                  fontSize: 15,
                                }}
                              />
                            </Tooltip>
                          </span>
                        )}
                      </IconButton>

                      <IconButton
                        aria-label="delete"
                        size="small"
                        className="p-0"
                        onClick={() => removeInputFields(parameter.ID, index)}
                        disabled={isDisabled}
                      >
                        <span>
                          <Tooltip title="Delete" arrow placement="left">
                            <DeleteIcon
                              fontSize="small"
                              style={{
                                backgroundColor: isDisabled ? "grey" : "red",
                                color: "white",
                                borderRadius: "2px",
                                fontSize: 15,
                                marginTop: -9,
                              }}
                            />
                          </Tooltip>
                        </span>
                      </IconButton>
                    </div>
                  </div>
                ))}
                <div>
                  {SensorTypeParametersError && (
                    <div
                      style={{
                        color: "red",
                        marginTop: "4px",
                        marginLeft: "4px",
                      }}
                    >
                      {SensorTypeParametersError}
                    </div>
                  )}
                </div>
                <div>
                  {errorMessageBlank && (
                    <p
                      style={{
                        color: "red",
                        marginTop: "4px",
                        marginLeft: "4px",
                      }}
                    >
                      {errorMessageBlank}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addInputField}
                  disabled={isDisabled}
                  className="btn btn-primary btn-sm w-100"
                >
                  Add More
                </button>
                <div>
                  {errorMessageparamter && (
                    <div style={{ color: "red" }}>{errorMessageparamter}</div>
                  )}
                </div>
                <div>
                  {messageInfo && (
                    <div style={{ color: "red" }}>{messageInfo}</div>
                  )}
                </div>
              </div>
            </Stack>
          </div>
        );

      default:
      //return 'Unknown step';
    }
  };
 

  return (
    <>
      {/* <Layout> */}
      <>
        <DialogBox
          open={open5}
          onClose={handleCloseDelete}
          onDelete={handleDelete}
        />
        <ModelForm open={open} onClose={handleClose}>
          {activeStep === steps.length ? (
            <div></div>
          ) : (
            <div>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div>
                <React.Fragment>
                  <div></div>
                </React.Fragment>

                <Typography>{getStepContent(activeStep)}</Typography>
                <div className="mt-4">
                  {activeStep !== 0 && (
                    <Button onClick={handleBack}>Back</Button>
                  )}
                  {/* <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button> */}
                  {activeStep === 0 ? (
                    <Button onClick={handleNext}>Next</Button>
                  ) : (
                    !isInfoClicked && (
                      <Button onClick={handleSubmit} disabled={isDisabled}>
                        Submit
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </ModelForm>

        <div className="parentContainer" data-testid="parentContainer">
          <Stack
            direction="row"
            className="myStack my-0 mb-0 pt-2"
            data-testid="stack"
          >
            {/* search box */}
            <div className="searchContainerDatagrid">
              <OutlinedInput
                className="dataGridSearch"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search sensor type..."
                data-testid="dataGridSearch"
                startAdornment={
                  <InputAdornment
                    className="dataGridSearchinput"
                    position="start"
                    style={{ marginRight: "-2px" }}
                    data-testid="dataGridSearchinput"
                  ></InputAdornment>
                }
              />
              <i
                className="fa fa-search searchIcon"
                style={{
                  fontSize: "small",
                  color: "#919eab",
                  paddingLeft: "5px",
                }}
              ></i>
            </div>

            {/* Button */}
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickCreateSensorButton
                  ? "You do not have permission"
                  : ""
              }
              arrow
            >
              <span>
                <Button
                  variant="contained"
                  onClick={handleClickOpen}
                  disabled={
                    userRole !== "SuperAdmin" && !canClickCreateSensorButton
                  }
                  className={
                    userRole !== "SuperAdmin" && !canClickCreateSensorButton
                      ? ""
                      : "button_color"
                  }
                  startIcon={<AddCircleIcon />}
                  style={{ marginRight: "16px" }}
                  data-testid="sensorButton"
                >
                  Create Sensor type
                </Button>
              </span>
            </Tooltip>
          </Stack>
          {/* Data grid */}
          <div
            style={{
              height: "359px",
              width: "100%",
              marginTop: "-9px",
              position: "relative",
            }}
            data-testid="dataGriddiv"
          >
            <DataGrid
              // rows={SensorTypes}
              rows={SensorTypes.filter((sensorType) =>
                sensorType.SensorTypeName.toLowerCase().includes(
                  searchTerm.toLowerCase()
                )
              )}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              // checkboxSelection
              getRowId={(row) =>row.SensorTypeLogicalName }
              components={{
                NoRowsOverlay: isLoading ? () => false : CustomNoRowsOverlay,
              }}
              data-testid="dataGrid"
              rowHeight={50}
              hideFooterSelectedRowCount={true}
              disableColumnSelector={true}
              sx={{
                padding: "0px 15px 0px 15px",
                width: "100%",
                margin: "0 auto",
                border: "none",
                marginBottom: "16px",
                borderRadius: "0px 0px 16px 16px",
                boxShadow:
                  "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px", // Add box shadow
                backgroundColor: "#fff",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f4f6f8",
                  color: "#777",
                },
                "& .MuiDataGrid-root": {
                  borderColor: "#d3d3d3",
                },
                "& .MuiDataGrid-cell": {
                  borderColor: "#f4f6f8",
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none", // Remove the outline when a cell is focused
                },
                "& .MuiDataGrid-cell--withRenderer:focus-within": {
                  outline: "none", // Remove the outline for cells with renderers
                },
                "& .MuiDataGrid-cell--editing": {
                  outline: "none", // Remove the outline for cells in editing mode
                },
                "& .MuiDataGrid-columnHeaders:focus": {
                  outline: "none", // Remove the outline when a cell is focused
                },
                "& .MuiDataGrid-columnHeader:focus-within": {
                  outline: "none", // Remove the outline when a column header is focused within
                },
                "& .header-project-name .MuiDataGrid-columnHeaderTitle": {
                  marginLeft: "25px", // Add desired margin-left for Project Name header label
                },
                "& .MuiTablePagination-selectLabel": {
                  fontSize: "14px", // Change this to your desired font size
                  fontWeight: "400", // Change this to your desired font weight
                },
              }}
            />
            {isLoading && <Loader />}
          </div>
        </div>
      </>
      {/* </Layout> */}
    </>
  );
}
