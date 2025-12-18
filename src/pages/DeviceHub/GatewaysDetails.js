/* This is implementation of gateways page where the user can see the details of the gateways and download the private key and certificate.
  Author : Shweta Vyas    
*/

import React from "react";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Unstable_Grid2";
import FileCopyOutlined from "@mui/icons-material/FileCopyOutlined";
import Typography from "@mui/material/Typography";
import DownloadingRoundedIcon from '@mui/icons-material/DownloadingRounded';
import { message } from "antd";
import Card from "react-bootstrap/Card";
import Chip from "@mui/material/Chip";
import { useContext } from "react";
import { ProjectContext } from "../../ProjectContext";
import Stack from "@mui/material/Stack";
import Loader from "../../components/common/LoaderDatagrid";
axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

export default function GatewatsDetails() {
  const { projectSiteName } = useContext(ProjectContext);
  // const navigate = useNavigate();

  const [edgeDevice, setEdgeDevice] = useState(null);
  const { gatewayName } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const getEdgeDevice = async () => {
    try {
      const response = await axios.get(
        `/sites/gateway/edgeDevice/${gatewayName}`
      );
      setEdgeDevice(response.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 400); // 400ms delay
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(error);
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getEdgeDevice();
  }, []);


  return (
    <Layout>
      <>
        <Card style={{ width: "100%", border: "none" }}>
       
          <Card.Body>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="myTypography"
              style={{ padding: "10px", borderRadius: "5px" }}
            >
              Credentials
            </Typography>
            <div className="parentContainer">
               {
                isLoading ? (<div style={{position:"relative",top:"210px",right:"35px"}}><Loader/></div>):(
              <Stack direction="row" className="myStack my-0 mb-0 p-3">
                <Grid container className="p-2 ml-3" style={{ width: "100%",marginLeft:"10px" }}>
                  <Grid xs={12} sm={12}>
                    <div className="credsValues">
                      <h6 >
                        <Chip
                          label="Gateway "
                          style={{ marginRight: "60px" }}
                        />
                        <span >
                          {edgeDevice?.IOTThingName}
                        </span>
                      </h6>
                      <h6 >
                        <Chip
                          label="Topic Name"
                          style={{ marginRight: "40px"  }}
                        />
                        <span >
                          {edgeDevice?.IOTTopicName}
                        </span>{" "}
                      </h6>
                      {/* private key */}
                      <h6>
                        <Chip
                          label="Private Key"
                          style={{ marginRight: "45px"  }}
                        />
                        <a href={edgeDevice?.IOTPrivateKeyS3Location} download
                        style={{textDecoration: "none"}}>
                          <span >
                            {edgeDevice?.IOTPrivateKeyS3Location}
                          </span>
                        </a>
                        <DownloadingRoundedIcon
                        className="download-icon"
                          onClick={() =>
                            (window.location.href =
                              edgeDevice?.IOTPrivateKeyS3Location)
                          }
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        />
                      </h6>
                      {/* certificate */}
                      <h6>
                        <Chip
                          label="Certificate"
                          style={{ marginRight: "50px"  }}
                        />
                        <a
                          href={edgeDevice?.IOTCertificatePemS3Location}
                          download
                          style={{  textDecoration: "none" }}
                        >
                          <span >
                            {edgeDevice?.IOTCertificatePemS3Location}
                          </span>
                        </a>
                        <DownloadingRoundedIcon
                         
                          onClick={() =>
                            (window.location.href =
                              edgeDevice?.IOTCertificatePemS3Location)
                          }
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        />
                      </h6>
                      <h6>
                        <Chip
                          label="IoT Server"
                          style={{ marginRight: "53px"  }}
                        />
                        <span >
                          {edgeDevice?.IOTServerURL}
                        </span>
                        <FileCopyOutlined
                          onClick={() => {
                            navigator.clipboard.writeText(
                              edgeDevice?.IOTServerURL
                            );
                            message.success("Copied to clipboard");
                          }}
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        />
                      </h6>
                      <h6>
                        <Chip
                          label="Description"
                          style={{ marginRight: "45px" }}
                        />
                        <span >
                          {edgeDevice?.Description}
                        </span>
                      </h6>
                    </div>
                  </Grid>
                </Grid>
                
              </Stack>
               )}
            </div>
          </Card.Body>
               
        </Card>
      </>
    </Layout>
  );
}
