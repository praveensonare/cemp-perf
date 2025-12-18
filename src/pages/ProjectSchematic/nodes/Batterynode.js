import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { useWebSocketData } from "../../../contexts/WebSocketContext";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import ReactDOM from "react-dom";

function Batterynode({ data }) {
  const [wsData, setWsData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 235, left: 930 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const messages = useWebSocketData();
  console.log(messages);
  const { projectSiteName } = useParams();
  const [showImageCard, setShowImageCard] = useState(true);
  const [showImage, setShowImage] = useState(true);
  const [filterdata,setFilterData] = useState([]);


  useEffect(() => {
    if (!projectSiteName || !messages|| !messages.project_id ||messages.project_id !== projectSiteName) {
      console.log("Data ignoring node: ", messages);
      return;
    } else {
      console.log("Data accepting for nodes: ", messages);
      setFilterData(messages);
    }
    if (
      messages?.project_id === projectSiteName &&
      messages?.live_schematic?.Battery?.direction !== 0
    ) {
      setShowImage(true);
    } else {
      setShowImage(false);
    }
  }, [messages]);

  // useEffect(() => {
  //   if (messages?.project_id === projectSiteName && messages?.live_schematic?.Battery.direction) {
  //     setShowImageCard(true);
  //   } else {
  //     setShowImageCard(false);
  //   }
  // }, [messages]);
  // useEffect(() => {
  //  if (
  //     messages?.project_id === projectSiteName &&
  //     messages?.live_schematic?.Battery.direction !== null &&
  //     messages?.live_schematic?.Battery.direction !== undefined
  //   )  {
  //     setShowImageCard(true);
  //   } else {
  //     setShowImageCard(false);
  //   }
  // }, [messages]);

  const handleMouseEnter = (event) => {
    setIsHovered(true);
    setPosition({ top: event.clientY - 22, left: event.clientX + 13 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // If direction is 1 then it is charging from centere point
  // If direction is -1 then it is discharging to centere point
  // If direction is 0 then it not charging

  const rotationStyle =
    filterdata?.project_id === projectSiteName &&
    filterdata?.live_schematic?.Battery?.direction === 1
      ? { transform: "rotate(180deg)" }
      : { transform: "rotate(0deg)" };

  return (
    <>
      {showImage &&
        filterdata?.project_id === projectSiteName &&
        filterdata.live_schematic.Battery.direction !== 0 && (
          <img
            src={data.src}
            alt={data.label}
            style={{ width: "20px", height: "20px", ...rotationStyle }}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
          />
        )}

      {/* {showImageCard && messages && messages?.project_id === projectSiteName
        ? ReactDOM.createPortal(
            <div
              style={{
                top: position.top,
                left: position.left,
              }}
              className="nodes-popup"
            >
              <h6 style={{ fontWeight: "bold" }}>Battery</h6>
              {messages?.live_schematic?.Battery ? (
                <div>
                  {Object.entries(messages.live_schematic.Battery)
                    .filter(([key]) => key !== "direction")
                    .map(([key, value]) => (
                      <p key={key}>{`${key}: ${value}`}</p>
                    ))}
                </div>
              ) : (
                <p style={{ display: "flex", justifyContent: "center" }}>
                  No Data Available
                </p>
              )}
            </div>,
            document.body
          )
        : ReactDOM.createPortal(
            <div
              style={{
                top: position.top,
                left: position.left,
              }}
              className="nodes-popup"
            >
              <h6 style={{ fontWeight: "bold" }}>Battery</h6>
              <div>
                <p>No Data</p>
                <p></p>
                <p></p>
              </div>
            </div>,
            document.body
          )} */}
    </>
  );
}

export default Batterynode;
