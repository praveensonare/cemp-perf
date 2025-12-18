import React, { useState, useEffect, useCallback, useContext } from "react";
import Layout from "../../components/Layout";
import Card from "react-bootstrap/Card";
import { Spin } from "antd";
import CircularNode from "./CircularNode";
import ImageNode from "./ImageNode";
import LineDotTop from "./LineDotTop";
import LineDotBottom from "./LineDotBottom";
import CircularNodeR from "./CircleNodeRight";
import CircularNodeL from "./CircleNodeLeft";
import ArrowNode from "./nodes/Gridnode";
import Dggsetnode from "./nodes/Dggsetnode";
import Batterynode from "./nodes/Batterynode";
import Windplantnode from "./nodes/Windplantnode";
import Solarnode from "./nodes/Solarnode";
import EVchargernode from "./nodes/EVchargernode";
import Fuelcellnode from "./nodes/Fuelcellnode";
import Loadnode from "./nodes/Loadnode";
import Drawer from "@mui/material/Drawer";
import Line from "./Line";
import Nodedata from "./Nodedata.json";
import { useDispatch, useSelector } from "react-redux";
import { useWebSocketData } from "../../contexts/WebSocketContext";
import axios from "axios";
import { NodesContext } from "../../NodesContext";
import { ProjectContext } from "../../ProjectContext";
import { message } from 'antd';
import Swal from "sweetalert2";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
} from "reactflow";

import "reactflow/dist/style.css";
import 'react-flow-renderer/dist/style.css';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  sourceTopPosition: Position.Top,
  targetBottomPosition: Position.Bottom,
};

const edges = [
  {
    id: "e1",
    source: "1",
    target: "2",
    // animated: true,
    style: { stroke: "black", strokeWidth: 2.5 },
    arrowHeadType: "arrowclosed",
  },

  {
    id: "eSolar-Solar_Second",
    source: "Solar",
    target: "Solar_Second",
    animated: true,
    style: { stroke: "blue" },
    arrowHeadType: "arrowclosed",
  },
  {
    id: "eGrid-Grid_Second",
    source: "Grid",
    target: "Grid_Second",
    animated: true,
    style: { stroke: "blue" },
    arrowHeadType: "arrowclosed",
  },
  {
    id: "eDG_set-DG_set_Second",
    source: "DG_set",
    target: "DG_set_Second",
    animated: true,
    style: { stroke: "blue" },
    arrowHeadType: "arrowclosed",
  },
  {
    id: "eEcharging-EV_charger_Second",
    source: "Echarging",
    target: "EV_charger_Second",
    animated: true,
    style: { stroke: "blue" },
    arrowHeadType: 'arrowclosed',
  },
  {
    id: "eBattery-BatterySecond",
    source: "Battery",
    target: "BatterySecond",
    animated: true,
    style: { stroke: "blue" },
    arrowHeadType: "arrowclosed",
  },
  {
    id: "eFuel_cell-Fuel_cell_Second",
    source: "Fuel_cell",
    target: "Fuel_cell_Second",
    animated: true,
    style: { stroke: "blue" },
    arrowHeadType: 'arrowclosed',
  },
  {
    id: "eWind_plant-Wind_plant_Second",
    source: "Wind_plant",
    target: "Wind_plant_Second",
    animated: true,
    style: { stroke: "blue" },
    arrowHeadType: "arrowclosed",
  },
  {
    id: "eLoad-Load_Second",
    source: "Load",
    target: "Load_Second",
    animated: true,
    style: { stroke: "blue" },
    arrowHeadType: 'arrowclosed',
  }
]


function Status() {
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setIntialEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSolar, setShowSolar] = useState(true);
  const panOnDrag = false;
  const { projectSiteName } = useContext(ProjectContext);
  // const messages = useWebSocketData();


  const [ProjectSiteData, setProjectSiteData] = useState([])
  console.log("projectSiteName", projectSiteName)

  const nodesData = useContext(NodesContext);
  console.log('Nodes data from context:', nodesData);


  const [nodes, setNodes] = useState([]);

  // useEffect(() => {
  //   if (!messages) {
  //     message.info('Please turn on the WebSocket data.');
  //   }
  // }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`sites/project/projectSite/projectSchematic/${projectSiteName}`);
        const nodesData = response.data.schematicConfig.map(node => ({
          ...node,
          position: {
            x: parseFloat(node.position.x),
            y: parseFloat(node.position.y),
          },
        })).filter(node => node.isChecked);
        setNodes(nodesData);
        console.log("nodesData from status.js get api", nodesData)
      } catch (error) {
        if (error.response.status === 404) {
          Swal.fire({
            icon: "info",
            title: "Info",
            text: JSON.stringify(error.response.data),
          });
          // setNodes([]);
          setIsLoading(false); // Stop the loader
        } else {
          Swal.fire("Error", error.response.data);
        }
        // setIsLoading(false);
        console.error('Error fetching nodes: ', error);
      }
    };

    fetchData();
  }, [projectSiteName]);

  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
  };


  return (
    <Layout>
      <Card
        style={{
          width: "100%",
          height: "75vh",
          border: "none",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Card.Body>
          <div style={{ height: "70vh" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              nodeTypes={{
                ArrowNode: ArrowNode,
                Dggsetnode: Dggsetnode,
                Batterynode: Batterynode,
                Windplantnode: Windplantnode,
                EVchargernode: EVchargernode,
                Fuelcellnode: Fuelcellnode,
                Loadnode: Loadnode,
                line: Line,
                lineDotBottom: LineDotBottom,
                lineDotTop: LineDotTop,
                circularNode: CircularNode,
                imageNode: ImageNode,
                circularNodeR: CircularNodeR,
                circularNodeL: CircularNodeL,
                Solarnode: Solarnode,
              }}
              zoomOnDoubleClick={false}
              onNodeDragStop={(event, node) => console.log("Node:", node)}
              panOnDrag={panOnDrag}
              zoomOnPinch={false}
              zoomOnScroll={false}
            >
              <Background />
              {/* <Controls showFitView={true} showInteractive={false} /> */}
            </ReactFlow>
          </div>
        </Card.Body>
      </Card>
    </Layout>
  );
}

export default Status;
