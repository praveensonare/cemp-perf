import React from 'react';
import { Handle, Position } from 'reactflow';

const CircularNodeR = ({ data }) => {
  return (
    <>
      <img src={data.src} alt={data.label} style={{ width: '70px', height: '70px' }} />
     
      {/* <Handle type="target" position={Position.Right} /> */}
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default CircularNodeR;