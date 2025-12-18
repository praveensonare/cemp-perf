import React, { createContext, useState, useEffect, useContext } from 'react';

// Step 1: Create a new context
const WebSocketContext = createContext();

// Step 2: Create a provider for this context
export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    let timer;
    const newSocket = new WebSocket(window.REACT_APP_WEBSOCKET);

    newSocket.onmessage = function (event) {
      // Clear the old timer if a new message is received
      clearTimeout(timer);

      try {
        const data = JSON.parse(event.data);
        setMessages(data);
        // Set a new timer to reset messages after a certain period of time
        timer = setTimeout(() => {
          setMessages(null); // or setMessages([]);     
        }, 60000); // Adjust the time as needed
      } catch (error) {
        console.error("Error parsing JSON: ", error);
      }
    };

    setSocket(newSocket);

    // Clean up function
    return () => {
      newSocket.close();
      clearTimeout(timer);
      console.log('WebSocket connection closed');
    };
  }, []);

  return (
    <WebSocketContext.Provider value={messages}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Step 3: Create a custom hook that will use the WebSocket context
export const useWebSocketData = () => useContext(WebSocketContext);