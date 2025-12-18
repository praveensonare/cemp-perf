// Loader.js
import React from 'react';
import { Spin } from 'antd';

const Loader = () => (
    <div
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 2,
        }}
    >
        <Spin size="large" />
    </div>
);

export default Loader;