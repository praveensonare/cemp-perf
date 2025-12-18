import React, { useState, useEffect, useCallback, useContext } from "react";
import Layout from "../../components/Layout";
import Card from "react-bootstrap/Card";
import Status from "./Status";
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
import { message } from "antd";
import Swal from "sweetalert2";
import CardNodeDetail from "./CardNodeDetails";
import "../../styles/Projectschematic.css";
import Stack from "@mui/material/Stack";
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
import "react-flow-renderer/dist/style.css";
import Batterycard from "./cardnode/Batterycard";
import Solarcard from "./cardnode/Solarcard";
import Dggsetcard from "./cardnode/Dggsetcard";
import Evchargercard from "./cardnode/EVchargercard";
import Fuelcellcard from "./cardnode/Fuelcellcard";
import Windplantcard from "./cardnode/Windplantcard";
import Loadcard from "./cardnode/Loadcard";
import Gridcard from "./cardnode/Gridcard";
import Loader from "../../components/common/LoaderDatagrid";
// import Windplantcard from "./cardnode/Windplantcard";

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
    arrowHeadType: "arrowclosed",
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
    arrowHeadType: "arrowclosed",
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
    arrowHeadType: "arrowclosed",
  },
];

function ProjectSchematicStatus() {
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setIntialEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSolar, setShowSolar] = useState(true);
  const panOnDrag = false;
  const { projectSiteName } = useContext(ProjectContext);
  const [schematicConfig, setSchematicConfig] = useState([]);
  // const messages = useWebSocketData();
  const [ProjectSiteData, setProjectSiteData] = useState([]);
  console.log("projectSiteName", projectSiteName);

  const nodesData = useContext(NodesContext);
  console.log("Nodes data from context:", nodesData);
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `sites/project/projectSite/projectSchematic/${projectSiteName}`
        );
        const nodesData = response.data.schematicConfig
          .map((node) => ({
            ...node,
            position: {
              x: parseFloat(node.position.x),
              y: parseFloat(node.position.y),
            },
          }))
          .filter((node) => node.isChecked);
        setNodes(nodesData);
        setSchematicConfig(nodesData);
        setIsLoading(false); // Stop the loader
        console.log("nodesData from status.js get api", nodesData);
      } catch (error) {
        if (error.response?.status === 404) {
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
        console.error("Error fetching nodes: ", error);
      }
    };

    fetchData();
  }, [projectSiteName]);

  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
  };
  const findNode = (nodeName) =>
    schematicConfig.find((node) => node.data.name === nodeName);

  return (
    <Layout >
        <>
          <div className="parentContainer" style={{ marginTop: "5px" }}>
            {
                isLoading ? (<div style={{position:"relative",top:"210px",right:"35px"}}><Loader/></div>):(
                    <Stack
              direction="column"
              style={{
                backgroundColor: "#ffffff",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <div className="reactflow-wrapper">
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

              <div className="cardcontainer_status">
                {findNode("Grid")?.isChecked && <Gridcard />}
                {findNode("Solar PV")?.isChecked && <Solarcard />}
                {findNode("DG set")?.isChecked && <Dggsetcard />}
                {findNode("EV Charger")?.isChecked && <Evchargercard />}
                {findNode("Battery")?.isChecked && <Batterycard />}
                {findNode("H2 Fuel")?.isChecked && <Fuelcellcard />}
                {findNode("Wind")?.isChecked && <Windplantcard />}
                {findNode("Electric load")?.isChecked && <Loadcard />}
              </div>
            </Stack>
                )
            }
          </div>
        </>
      
    </Layout>
  );
}

export default ProjectSchematicStatus;
