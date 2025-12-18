import React, { useState, useEffect } from "react";
import { useWebSocketData } from "../../../contexts/WebSocketContext";
import { useParams } from "react-router-dom";
import "../../../styles/cardnode.css";

function Evchargercard() {
  const messages = useWebSocketData();
  // console.log(messages);
  const { projectSiteName } = useParams();
  const [showImageCard, setShowImageCard] = useState(true);
  const [showImage, setShowImage] = useState(true);
  const [filterdata,setFilterData] = useState([]);


  useEffect(() => {
    if (!projectSiteName || !messages|| !messages.project_id ||messages.project_id !== projectSiteName) {
      console.log("Data ignoring: ", messages)
      return;
    }
    else
    {
      console.log("Data accepting: ", messages)
      setFilterData(messages)
    }
    if (

      messages?.live_schematic?.EV_charger.direction !== null &&
      messages?.live_schematic?.EV_charger.direction !== undefined
    ) {
      setShowImageCard(true);
    } else {
      setShowImageCard(false);
    }
  }, [messages,projectSiteName]);

  return (
    <>
      {showImageCard && filterdata ? (
        <div className="cardDetail ">
          <img src="/Echarging.png" alt="Battery"  style={{ width: '40px', height: '40px' }}/>
          <h6 style={{ fontWeight: "bold" }}>EV_charger</h6>
          {filterdata?.live_schematic?.EV_charger ? (
            <div>
              {Object.entries(filterdata.live_schematic.EV_charger)
                .filter(([key]) => key !== "direction")
                .map(([key, value]) => (
                  <p key={key}>{`${key}: ${value}`}</p>
                ))}
            </div>
          ) : (
            <p>No Data Available</p>
          )}
        </div>
      ) : (
        <div className="cardDetail">
          <img src="/Echarging.png" alt="Battery"  style={{ width: '40px', height: '40px' }}/>
          <h6 style={{ fontWeight: "bold" }}>EV_charger</h6>
          <div>
            <p>No Data</p>
            <p></p>
            <p></p>
          </div>
        </div>
      )}
    </>
  );
}

export default Evchargercard;
