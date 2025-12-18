import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { useWebSocketData } from "../../../contexts/WebSocketContext";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import ReactDOM from "react-dom";

function EVchargernode({ data }) {
  const [wsData, setWsData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 400, left: 800 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const messages = useWebSocketData();
  const { projectSiteName } = useParams();
  const [showImageCard, setShowImageCard] = useState(true);
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
      messages?.live_schematic?.EV_charger?.direction !== 0
    ) {
      setShowImage(true);
    } else {
      setShowImage(false);
    }
  }, [messages]);

  // useEffect(() => {
  //   if (
  //     messages?.project_id === projectSiteName &&
  //     messages?.live_schematic?.EV_charger.direction !== null &&
  //     messages?.live_schematic?.EV_charger.direction !== undefined
  //   ) {
  //     setShowImageCard(true);
  //   } else {
  //     setShowImageCard(false);
  //   }
  // }, [messages]);

  const handleMouseEnter = (event) => {
    setIsHovered(true);
    setPosition({ top: event.clientY - 35, left: event.clientX + 25 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const rotationStyle =
    filterdata?.project_id === projectSiteName &&
    filterdata?.live_schematic?.EV_charger?.direction === 1
      ? { transform: "rotate(180deg)" }
      : { transform: "rotate(0deg)" };

  return (
    <>
      {showImage &&
        filterdata?.project_id === projectSiteName &&
        filterdata.live_schematic.EV_charger.direction !== 0 && (
          <img
            src={data.src}
            alt={data.label}
            style={{ width: "20px", height: "20px", ...rotationStyle }}
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
              <h6 style={{ fontWeight: "bold" }}>EV charger</h6>
              {messages?.live_schematic?.EV_charger ? (
                <>
                  <div>
                    {Object.entries(messages.live_schematic.EV_charger)
                      .filter(([key]) => key !== "direction")
                      .map(([key, value]) => (
                        <p key={key}>{`${key}: ${value}`}</p>
                      ))}
                  </div>
                </>
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
              <h6 style={{ fontWeight: "bold" }}>EV Charger</h6>
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

export default EVchargernode;
