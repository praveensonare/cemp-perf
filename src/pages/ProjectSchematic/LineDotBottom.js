/*
  Author : Arpana Meshram
  Date : 30-04-2024
  */
import React from 'react';
import { Handle, Position } from 'reactflow';

const LineDotBottom = ({ data }) => {
  return (
    <>
      <img src={data.src} alt={data.label} style={{ width: '10px', height: '10px' }} />
     
      <Handle type="target" position={Position.Bottom} />
      {/* <Handle type="source" position={Position.Left} /> */}
    </>
  );
};

export default LineDotBottom;