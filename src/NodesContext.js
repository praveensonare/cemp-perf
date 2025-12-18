import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NodesContext = React.createContext();

const NodesProvider = ({ children }) => {
  const [nodesData, setNodesData] = useState(null);

  // useEffect(() => {
  //   axios.get(`http://127.0.0.1:3004/nodes`)
  //     .then(response => {
  //       setNodesData(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data: ', error);
  //     });
  // }, []);
  useEffect(() => {
    const data = [
      {
        "LineData": [
          {
            "id": "1",
            "type": "line",
            "position": {
              "x": 40,
              "y": 150
            },
            "data": {
              "color": "Blue",
              "src": "/minus.png",
              "name": "line"
            },
            // "draggable": false
          },
          {
            "id": "2",
            "type": "line",
            "position": {
              "x": 900,
              "y": 150
            },
            "data": {
              "color": "Blue",
              "src": "/minus.png",
              "name": "line"
            },
            // "draggable": false
          }
        ]
      },

      {
        "GridData": [
          {
            "id": "3",
            "type": "ArrowNode",
            "position": { "x": 115, "y": 100 },
            "data": { "color": "Blue", "src": "/down.jpg", "direction": "0", "name": "grid Arrow" },
            "image": { "src": "/up.jpg" }
          },
          {
            "id": "Grid_Second",
            "type": "lineDotTop",
            "position": {
              "x": 120,
              "y": 150
            },
            "data": {
              "color": "Blue",
              "src": "/circle-dashed.jpg",
              "name": "grid Node"
            }
          },
          {
            "id": "Grid",
            "type": "circularNodeR",
            "position": {
              "x": 90,
              "y": 8
            },
            "data": {
              "color": "Blue",
              "src": "/gridNew.png",
              "name": "Grid"
            }
          }
        ]
      },
      {
        "SolarData": [
          {
            "id": "Solarnode_Arrow",
            "type": "Solarnode",
            "position": { "x": 215, "y": 195 },
            "data": { "color": "Blue", "src": "/up.jpg", "direction": "0", "name": "solar up arrow" }
          },
          {
            "id": "Solar_Second",
            "type": "lineDotBottom",
            "position": {
              "x": 220,
              "y": 150
            },
            "data": {
              "color": "Blue",
              "src": "/circle-dashed.jpg",
              "name": "solar PV Node "
            }
          },
          {
            "id": "Solar",
            "type": "circularNodeL",
            "position": {
              "x": 190,
              "y": 240
            },
            "data": {
              "color": "Blue",
              "src": "/solarPV.png",
              "name": "Solar PV"
            }
          }
        ]
      },
      {
        "DGData": [
          {
            "id": "DGset_Arrow",
            "type": "Dggsetnode",
            "position": { "x": 315, "y": 100 },
            "data": { "color": "Blue", "src": "/down.jpg", "direction": "0", "name": "DGset down arrow" }
          },


          {
            "id": "DG_set_Second",
            "type": "lineDotTop",
            "position": {
              "x": 320,
              "y": 150
            },
            "data": {
              "color": "Blue",
              "src": "/circle-dashed.jpg",
              "name": "DGset Node"
            }
          },
          {
            "id": "DG_set",
            "type": "circularNodeR",
            "position": {
              "x": 290,
              "y": 10
            },
            "data": {
              "color": "Blue",
              "src": "/DGset.png",
              "name": "DG set"
            }
          }
        ]
      },
      {
        "EVchargeData": [
          {
            "id": "EV_charger_Second",
            "type": "lineDotBottom",
            "position": {
              "x": 420,
              "y": 150
            },
            "data": {
              "color": "Blue",
              "src": "/circle-dashed.jpg",
              "name": "Electric Charging Node"
            }
          },

          {
            "id": "EVchargernode_Arrow",
            "type": "EVchargernode",
            "position": { "x": 415, "y": 195 },
            "data": { "color": "Blue", "src": "/up.jpg", "direction": "0", "name": "EV charger up arrow" }
          },
          {
            "id": "Echarging",
            "type": "circularNodeL",
            "position": {
              "x": 390,
              "y": 240
            },
            "data": {
              "color": "Blue",
              "src": "/Echarging.png",
              "name": "EV Charger"
            }
          }
        ]
      },
      {
        "BatteryData": [
          {
            "id": "BatterySecond",
            "type": "lineDotTop",
            "position": {
              "x": 525,
              "y": 150
            },
            "data": {
              "color": "Blue",
              "src": "/circle-dashed.jpg",
              "name": "Battery Node"
            }
          },
          {
            "id": "Battery",
            "type": "circularNodeR",
            "position": {
              "x": 495,
              "y": 10
            },
            "data": {
              "color": "Blue",
              "src": "/battery.png",
              "name": "Battery"
            }
          },
          {
            "id": "Battery_Arrow",
            "type": "Batterynode",
            "position": { "x": 520, "y": 100 },
            "data": { "color": "Blue", "src": "/down.jpg", "direction": "0", "name": "Battery down arrow" }
          }
        ]
      },
      {
        "FuelData": [
          {
            "id": "Fuelcellnode_Arrow",
            "type": "Fuelcellnode",
            "position": { "x": 625, "y": 195 },
            "data": { "color": "Blue", "src": "/up.jpg", "direction": "0", "name": "Fuel cell up arrow" }
          },
          {
            "id": "Fuel_cell_Second",
            "type": "lineDotBottom",
            "position": {
              "x": 630,
              "y": 150
            },
            "data": {
              "color": "Blue",
              "src": "/circle-dashed.jpg",
              "name": "Fuel Node"
            }
          },
          {
            "id": "Fuel_cell",
            "type": "circularNodeL",
            "position": {
              "x": 600,
              "y": 240
            },
            "data": {
              "color": "Blue",
              "src": "/fuel.png",
              "name": "H2 Fuel"
            }
          }
        ]
      },
      {
        "WindData": [
          {
            "id": "Winddplantnode_Arrow",
            "type": "Windplantnode",
            "position": { "x": 725, "y": 100 },
            "data": { "color": "Blue", "src": "/down.jpg", "direction": "0", "name": "Wind plant down arrow" }
          },
          {
            "id": "Wind_plant_Second",
            "type": "lineDotTop",
            "position": {
              "x": 730,
              "y": 150
            },
            "data": {
              "color": "Blue",
              "src": "/circle-dashed.jpg",
              "name": "Node Wind"
            }
          },
          {
            "id": "Wind_plant",
            "type": "circularNodeR",
            "position": {
              "x": 700,
              "y": 10
            },
            "data": {
              "color": "Blue",
              "src": "/wind.png",
              "name": "Wind"
            }
          }
        ]
      },
      {
        "LoadData": [
          {
            "id": "Loadnode_Arrow",
            "type": "Loadnode",
            "position": { "x": 825, "y": 195},
            "data": { "color": "Blue", "src": "/up.jpg", "direction": "0", "name": "Node Eload up arrow" }
          },
          {
            "id": "Load_Second",
            "type": "lineDotBottom",
            "position": {
              "x": 830,
              "y": 150
            },
            "data": {
              "color": "Blue",
              "src": "/circle-dashed.jpg",
              "name": "Node Eload"
            }
          },
          {
            "id": "Load",
            "type": "circularNodeL",
            "position": {
              "x": 800,
              "y": 240
            },
            "data": {
              "color": "Blue",
              "src": "/Eload.png",
              "name": "Electric load"
            }
          }
        ]
      }
    ]
    //   }
    // ]
    setNodesData(data);
  }, []);


  return (
    <NodesContext.Provider value={nodesData}>
      {children}
    </NodesContext.Provider>
  );
};

export { NodesProvider, NodesContext };