import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { useWebSocketData } from "../../../contexts/WebSocketContext";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { notification } from "antd";
import ReactDOM from "react-dom";

function Fuelcellnode({ data }) {
  const [wsData, setWsData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 400, left: 1036 });
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
      messages?.live_schematic?.Fuel_cell?.direction !== 0
    ) {
      setShowImage(true);
    } else {
      setShowImage(false);
    }
  }, [messages]);

  // useEffect(() => {
  //   if (
  //     messages?.project_id === projectSiteName &&
  //     messages?.live_schematic?.Fuel_cell.direction !== null &&
  //     messages?.live_schematic?.Fuel_cell.direction !== undefined
  //   ) {
  //     setShowImageCard(true);
  //   } else {
  //     setShowImageCard(false);
  //   }
  // }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(false);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  const rotationStyle =
    filterdata?.project_id === projectSiteName &&
    filterdata?.live_schematic?.Fuel_cell?.direction === 1
      ? { transform: "rotate(180deg)" }
      : { transform: "rotate(0deg)" };

  return (
    <>
      {showImage &&
        filterdata?.project_id === projectSiteName &&
        filterdata.live_schematic.Fuel_cell.direction !== 0 && (
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
              <h6 style={{ fontWeight: "bold" }}>H2 Fuel</h6>
              {messages?.live_schematic?.Fuel_cell ? (
                <>
                  <div>
                    {Object.entries(messages.live_schematic.Fuel_cell)
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
              <h6 style={{ fontWeight: "bold" }}>H2 fuel</h6>
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

export default Fuelcellnode;
