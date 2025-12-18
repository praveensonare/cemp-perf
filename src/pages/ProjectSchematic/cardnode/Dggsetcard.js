import React, { useState, useEffect } from "react";
import { useWebSocketData } from "../../../contexts/WebSocketContext";
import { useParams } from "react-router-dom";
import "../../../styles/cardnode.css";

function Dggsetcard() {
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

      messages?.live_schematic?.DG_set.direction !== null &&
      messages?.live_schematic?.DG_set.direction !== undefined
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
          <img src="/DGset.png" alt="Dgset"  style={{ width: '30px', height: '30px' }}/>
          <h6 style={{ fontWeight: "bold" }}>DG_set</h6>
          {filterdata?.live_schematic?.DG_set ? (
            <div>
              {Object.entries(filterdata.live_schematic.DG_set)
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
           <img src="/DGset.png" alt="Dgset"  style={{ width: '30px', height: '30px' }}/>
          <h6 style={{ fontWeight: "bold" }}>DG_set</h6>
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

export default Dggsetcard;
