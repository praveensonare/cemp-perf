import React from 'react';
import { Handle, Position } from 'reactflow';

const ImageNode = ({ data }) => {
  return (
    <>
      <img src={data.src} alt={data.label} style={{ width: '70px', height: '70px' }} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      {/* <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} /> */}
    </>
  );
};

export default ImageNode;