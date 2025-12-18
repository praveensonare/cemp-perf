import React from 'react';
import { Handle } from 'reactflow';

const CircularNode = ({ data }) => {
  return (
    <div style={{ border:'8px solid #FFBD00',background: '#fff', borderRadius: '50%', width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {data.label}
      <Handle
        type="source"
        position="right"
        style={{ background: '#fff' }}
        onConnect={(params) => console.log('handle onConnect', params)}
      />
      <Handle
        type="target"
        position="left"
        style={{ background: '#fff' }}
      />
    </div>
  );
};

export default CircularNode;