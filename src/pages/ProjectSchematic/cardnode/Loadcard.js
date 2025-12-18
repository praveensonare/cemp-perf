import React, { useState, useEffect } from "react";
import { useWebSocketData } from "../../../contexts/WebSocketContext";
import { useParams } from "react-router-dom";
import "../../../styles/cardnode.css";

function Loadcard() {
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

      messages?.live_schematic?.Load.direction !== null &&
      messages?.live_schematic?.Load.direction !== undefined
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
           <img src="/Eload.png" alt="Battery"  style={{ width: '30px', height: '30px' }}/>
          <h6 style={{ fontWeight: "bold" }}>Load</h6>
          {filterdata?.live_schematic?.Load ? (
            <div>
              {Object.entries(filterdata.live_schematic.Load)
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
           <img src="/Eload.png" alt="Battery"  style={{ width: '30px', height: '30px' }}/>
          <h6 style={{ fontWeight: "bold" }}>Load</h6>
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

export default Loadcard;
