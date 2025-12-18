/*
  Author : Arpana Meshram
  Date : 30-04-2024
  */
import React from 'react';
import { Handle, Position } from 'reactflow';

const LineDotTop = ({ data }) => {
  return (
    <>
      <img src={data.src} alt={data.label} style={{ width: '10px', height: '10px' }} />
     
      <Handle type="target" position={Position.Top} />
      {/* <Handle type="source" position={Position.Left} /> */}
    </>
  );
};

export default LineDotTop;