import React, { useContext, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import { DataGrid, heIL } from "@mui/x-data-grid";
import { useState } from "react";
import { Button } from "@mui/material";
import { ProjectContext } from "../../ProjectContext";
import Loader from "../../components/common/LoaderDatagrid";
import Card from "react-bootstrap/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import CustomNoRowsOverlay from "../../components/common/CustomNoRowsOverlay";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmsFailedOutlinedIcon from "@mui/icons-material/SmsFailedOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DevicesOtherOutlinedIcon from "@mui/icons-material/DevicesOtherOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import "../../styles/Alarms.css";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const Alarms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { projectSiteName } = useContext(ProjectContext);
  const [alarmData, setAlarmData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [alarmID, setAlarmID] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getAllAlarms = async () => {
    try {
      const response = await axios.get(
        `/sites/project/projectSite/getAlarms/${projectSiteName}`
      );
      setAlarmData(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setIsLoading(false);
          Swal.fire({
            title: "Not Found",
            text: `No Alarms Found For ${projectSiteName}`,
          });
        } else {
          setIsLoading(false);
          Swal.fire({
            title: "Error",
            text: "Something Went Wrong",
          });
        }
      }
    }
  };

  useEffect(() => {
    getAllAlarms();
  }, []);

  function handleClickOpen(id) {
    setOpen(true);
    setAlarmID(id);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: "createdTS",
      headerName: "Date & Time",
      flex: 2,
      headerClassName: "header-project-name", // Assign custom class
      filterable: false, // Ensure the column is not filterable

      renderCell: (params) => {
        const timestamp = Number(params.row.createdTS);
        const localDateTime = new Date(timestamp)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
          .toUpperCase();
        return <span>{localDateTime}</span>;
      },
    },
    {
      field: "whatsappMessage",
      headerName: "Whatsapp Message",
      flex: 2.2,
      headerClassName: "header-project-name", // Assign custom class
      renderCell: (params) => {
        const whatsappMsg = params.row.whatsappMessage
          ? params.row.whatsappMessage.length > 25
            ? params.row.whatsappMessage.substring(0, 25) + "..."
            : params.row.whatsappMessage
          : "";
        return <span>{whatsappMsg}</span>;
      },
    },
    {
      field: "smsMessage",
      headerName: "SMS Message",
      flex: 2.2,
      headerClassName: "header-project-name", // Assign custom class
      renderCell: (params) => {
        const smsMsg = params.row.smsMessage
          ? params.row.smsMessage.length > 25
            ? params.row.smsMessage.substring(0, 25) + "..."
            : params.row.smsMessage
          : "";
        return <span>{smsMsg}</span>;
      },
    },

    {
      field: "emailMessage",
      headerName: "Email Message",
      flex: 2,
      headerClassName: "header-project-name", // Assign custom class
      renderCell: (params) => {
        const emailMsg = params.row.emailMessage
          ? params.row.emailMessage.length > 25
            ? params.row.emailMessage.substring(0, 25) + "..."
            : params.row.emailMessage
          : "";
        const emailMsgFiltered = emailMsg.replace(/<\/?p>/g, "");
        return <span>{emailMsgFiltered}</span>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      flex: 0.7,
      filterable: false, // Ensure the column is not filterable

      renderCell: (params) => {
        return (
          <span>
            <Tooltip title={"Info"} arrow>
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  data-testid="info-button"
                  //   key={id}
                  className="info-button"
                  style={{ marginRight: 4 }}
                >
                  <InfoIcon
                    fontSize="small"
                    onClick={() => handleClickOpen(params.row.alarmID)}
                  />
                </Button>
              </span>
            </Tooltip>
          </span>
        );
      },
    },
  ];

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(3),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const alarmDataFiltered = alarmData.filter(
    (item) => item.alarmID === alarmID
  );

  // Function to generate a random string
  function generateRandom() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }


  return (
    <Layout>
      <React.Fragment>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 19,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <Typography gutterBottom>
              {alarmDataFiltered.map((item) => (
                <div key={item.alarmID}>
                  <h6>
                    {" "}
                    <DevicesOtherOutlinedIcon />
                    &nbsp; Gateway Name
                  </h6>
                  <hr />
                  <p style={{ marginLeft: "33px", fontSize: "14px" }}>
                    {item.gatewayName}
                  </p>

                  <h6>
                    {" "}
                    <WhatsAppIcon />
                    &nbsp; Whatsapp Notification
                  </h6>
                  <hr />

                  <p style={{ marginLeft: "0px", fontSize: "14px" }}>
                    {" "}
                    {item.whatsappMessage
                      .replace(/(Product Name: 1)/g, "\n$1")
                      .split("\n")
                      .map((line, index) => (
                        <p key={index} style={{ marginLeft: "33px" }}>
                          {line}
                        </p>
                      ))}
                  </p>
                  <p style={{ marginLeft: "33px", fontSize: "14px" }}>
                    {item.WhatsAppNumbers.map((number, index) => (
                      <span key={index}>
                        WhatsApp Number : {number.replace(/^whatsapp:\s*/, "")}
                        <br />
                      </span>
                    ))}
                  </p>

                  <h6 style={{ marginTop: "25px" }}>
                    <SmsFailedOutlinedIcon />
                    &nbsp; SMS Notification
                  </h6>
                  <hr />

                  <p style={{ marginLeft: "33px", fontSize: "14px" }}>
                    {" "}
                    Alarm : {item.smsMessage}
                  </p>
                  <p style={{ marginLeft: "33px", fontSize: "14px" }}>
                    SMS Number : {item.smsNumbers}
                  </p>

                  <h6 style={{ marginTop: "25px" }}>
                    {" "}
                    <EmailOutlinedIcon /> &nbsp; Email Notification
                  </h6>
                  <hr />

                  <p style={{ marginLeft: "33px", fontSize: "14px" }}>
                    Alarm : {item.emailMessage.replace(/<\/?p>|Alarm:/g, "")}
                  </p>
                  <p style={{ marginLeft: "33px", fontSize: "14px" }}>
                    Email : {item.emailLists}
                  </p>
                  <h6 style={{ marginTop: "25px" }}>
                    <BugReportOutlinedIcon /> &nbsp; Severity Notification
                  </h6>
                  <hr />
                  <p style={{ marginLeft: "33px", fontSize: "14px" }}>
                    Severity Level : {item.severity}
                  </p>
                </div>
              ))}
            </Typography>
          </DialogContent>
        </BootstrapDialog>
      </React.Fragment>
      <Card
        style={{
          width: "100%",
          border: "none",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
        data-testid="card"
      >
        <Card.Body data-testid="cardBody">
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            className="myTypography"
            sx={{ paddingLeft: "20px" }}
          >
            Alarms
          </Typography>

          <div className="parentContainer">
            {/* stack for search box and button */}
            <Stack
              direction="row"
              className="myStack my-0 mb-0 pt-1"
              data-testid="stack"
            >
              {/* search box */}

              <div className="searchContainerDatagrid">
                <OutlinedInput
                  className="dataGridSearch uniqueClass"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search date & time..."
                  // inputProps={{ style: { fontSize: '15px' }}}
                  startAdornment={
                    <InputAdornment
                      className="dataGridSearchinput"
                      position="start"
                      style={{ marginRight: "-2px" }}
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
            </Stack>

            {/* data grid */}
            <div
              style={{
                height: "359px",
                width: "100%",
                marginTop: "-9px",
                position: "relative",
              }}
              // className='p-2'
            >
              <DataGrid
                // rows={gateways}
                rows={
                  searchTerm.length === 0
                    ? alarmData
                    : alarmData.filter((alarm) =>
                        new Date(Number(alarm.createdTS))
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })
                          .includes(searchTerm)
                      )
                }
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                components={{
                  NoRowsOverlay: isLoading ? () => false : CustomNoRowsOverlay,
                }}
                getRowId={(row) =>row.alarmID}
                pageSizeOptions={[5, 10]}
                className="data-grid"
                // checkboxSelection
                rowHeight={50}
                hideFooterSelectedRowCount={true}
                disableColumnSelector={true}
                sx={{
                  padding: "0px 15px 0px 15px",
                  width: "100%", // Set the width to a medium size
                  margin: "0 auto", // Center the DataGrid horizontally
                  border: "none", // Remove the border
                  marginBottom: "16px", // Add some space at the bottom
                  borderRadius: "0px 0px 16px 16px", // Optional: Add rounded corners
                  boxShadow:
                    "rgba(145, 158, 171, 0.08) 0px 0px 2px 0px, rgba(145, 158, 171, 0.08) 0px 12px 24px -4px", // Add box shadow
                  backgroundColor: "#fff", // Change this to your desired background color
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f4f6f8", // Change this to your desired header color
                    color: "#777", // Change this to your desired text color
                  },
                  "& .MuiDataGrid-root": {
                    borderColor: "#d3d3d3", // Change this to your desired border color
                  },
                  "& .MuiDataGrid-cell": {
                    borderColor: "#f4f6f8", // Change this to your desired cell border color
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
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default Alarms;
