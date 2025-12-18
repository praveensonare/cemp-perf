import React from 'react';
import { Edge } from 'reactflow';

const CustomEdge = ({
  id,
  source,
  target,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) => {
  return (
    <Edge
      id={id}
      source={source}
      target={target}
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
      style={style}
      arrowHeadType={arrowHeadType}
      markerEndId={markerEndId}
      label={<div style={{ padding: 10 }}>{data.text}</div>}
    />
  );
};

export default CustomEdge;