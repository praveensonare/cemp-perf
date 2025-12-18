import React from 'react';
import { Handle, Position } from 'reactflow';

const CircularNodeL = ({ data }) => {
  return (
    <>
      <img src={data.src} alt={data.label} style={{ width: '70px', height: '70px' }} />
     
      {/* <Handle type="target" position={Position.Left} /> */}
      <Handle type="source" position={Position.Top} />
    </>
  );
};

export default CircularNodeL;