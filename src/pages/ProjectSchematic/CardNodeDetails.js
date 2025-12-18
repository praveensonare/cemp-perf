import React, { useEffect, useState } from 'react';
import { useWebSocketData } from '../../contexts/WebSocketContext';
import "../../styles/Projectschematic.css";
function CardNodeDetails() {
  const messages = useWebSocketData();
  const [liveSchematicData, setLiveSchematicData] = useState({});
 
  useEffect(() => {
    if (messages?.live_schematic) {
      setLiveSchematicData(messages.live_schematic);
    }
  }, [messages]);
 
  return (
    <div className='cardDetail'>
      {Object.entries(liveSchematicData).map(([key, value]) => (
        <div key={key} className='boxcard'>
          <h6>{key}</h6>
          {Object.entries(value).map(([subKey, subValue]) => (
            <p key={subKey}>{`${subKey}: ${subValue}`}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
 
export default CardNodeDetails;