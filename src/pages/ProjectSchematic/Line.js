/*
  Author : Arpana Meshram
  Date : 30-04-2024
  */
import React from 'react';
import { Handle, Position } from 'reactflow';

const Line = ({ data }) => {
  return (
    <>
      <img src={data.src} alt={data.label} style={{ width: '20px', height: '20px' }} />
     
      <Handle type="target" position={Position.Left} />
       <Handle type="source" position={Position.Right} /> 
    </>
  );
};

export default Line;