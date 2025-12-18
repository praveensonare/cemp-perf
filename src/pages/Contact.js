import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout';
import Card from "react-bootstrap/Card";
import { Spin } from "antd";


function Contact() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          zIndex: 9999,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
  return (
    <Layout>
      <Card
        style={{
          width: "100%",
          border: "none",
          display: "flex",
          justifyContent: "centere",
        }}>
        <Card.Body>
          <div>
            <h1>Contact Us</h1>
          </div>
        </Card.Body>
      </Card>
    </Layout>
  )
}

export default Contact
