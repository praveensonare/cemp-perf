import React, { useState, useEffect } from "react";
import { useWebSocketData } from "../../../contexts/WebSocketContext";
import { useParams } from "react-router-dom";
import ReactDOM from "react-dom";

function Windplantnode({ data }) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 235, left: 1150 });
  const [showImage, setShowImage] = useState(true);
  const messages = useWebSocketData();
  const { projectSiteName } = useParams();
  const [showImageCard, setShowImageCard] = useState(true);
  const [filterdata,setFilterData] = useState([]);


  useEffect(() => {
    if (!projectSiteName ||!messages || !messages.project_id || messages.project_id !== projectSiteName) {
      return;
    } else {
      setFilterData(messages);
    }
    if (
      messages?.project_id === projectSiteName &&
      messages?.live_schematic?.Wind_plant?.direction !== 0
    ) {
      setShowImage(true);
    } else {
      setShowImage(false);
    }
  }, [messages]);

  // useEffect(() => {
  //   if (
  //     messages?.project_id === projectSiteName &&
  //     messages?.live_schematic?.Wind_plant.direction !== null &&
  //     messages?.live_schematic?.Wind_plant.direction !== undefined
  //   ) {
  //     setShowImageCard(true);
  //   } else {
  //     setShowImageCard(false);
  //   }
  // }, [messages]);

  const rotationStyle =
    filterdata?.project_id === projectSiteName &&
    filterdata?.live_schematic?.Wind_plant?.direction === 1
      ? { transform: "rotate(180deg)" }
      : { transform: "rotate(0deg)" };

  return (
    <>
      <div>
        {showImage &&
          filterdata?.project_id === projectSiteName &&
          filterdata.live_schematic.Wind_plant.direction !== 0 && (
            <img
              src={data.src}
              alt={data.label}
              style={{ width: "20px", height: "20px", ...rotationStyle }}
            />
          )}
{/*
        {showImageCard && messages && messages?.project_id === projectSiteName
          ? ReactDOM.createPortal(
              <div
                style={{
                  top: position.top,
                  left: position.left,
                }}
                className="nodes-popup"
              >
                <h6 style={{ fontWeight: "bold" }}>Wind Plant</h6>
                {messages?.live_schematic?.Wind_plant ? (
                <div>
                  {Object.entries(messages.live_schematic.Wind_plant)
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
                <h6 style={{ fontWeight: "bold" }}>Wind Plant</h6>
                <div>
                  <p>No Data</p>
                  <p></p>
                  <p></p>
                </div>
              </div>,
              document.body
            )} */}
      </div>
    </>
  );
}

export default Windplantnode;
