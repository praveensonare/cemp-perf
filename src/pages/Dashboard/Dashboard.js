/* This is implementation of Login flow in the application.
  Author : Tinku Gupta
  Revision: 1.0 - 13-03-2021 : Comment and 404 handle on data grid .
*/

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";

import "../../styles/Loader.css";
import { createEmbeddingContext } from "amazon-quicksight-embedding-sdk";
import axios from "axios";
import Swal from "sweetalert2";
import { useContext } from "react";
import { ProjectContext } from "../../ProjectContext";
import Loader from "../../components/common/LoaderDatagrid";
// import Loader from '../../components/Loader/Loader';

export default function BasicTabs() {
  const { projectSiteName } = useParams();
  const dashboardRef = useRef([]);
  const [embeddedDashboard, setEmbeddedDashboard] = useState(null);
  const [dashboardUrl, setDashboardUrl] = useState(null);
  const [embeddingContext, setEmbeddingContext] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // This useEffect hook is used to fetch the dashboard URL from the server.
  useEffect(() => {
    const timeout = setTimeout(() => {
      axios
        .get(
          `${window.REACT_APP_SERVER_URL}/sites/qs/dashboardUrlForProjectSite/${projectSiteName}`
        )
        .then((response) => {
          console.log(response);
          setDashboardUrl(response.data.EmbedUrl);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            Swal.fire({
              icon: "info",
              title: "Info",
              text: JSON.stringify(error.response.data),
            });
            setIsLoading(false);
          } else {
            Swal.fire("Error", error.response.data);
            setIsLoading(false);
          }
        });
    }, 200);
    // The cleanup function of this useEffect hook clears the timeout.
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  // This function creates an embedding context for the dashboard.
  // It sets up a function to refresh the dashboard every 30 seconds once it's loaded.
  const createContext = async () => {
    const context = await createEmbeddingContext();

    context.onDashboardLoad = () => {
      setInterval(() => {
        context.refreshDashboard();
      }, 30000);
    };

    setEmbeddingContext(context);
  };
  // This useEffect hook calls the createContext function whenever the dashboard URL changes.
  useEffect(() => {
    if (dashboardUrl) {
      createContext();
    }
  }, [dashboardUrl]);
  // This useEffect hook calls the embed function whenever the embedding context changes.
  useEffect(() => {
    if (embeddingContext) {
      embed();
    }
  }, [embeddingContext]);
  // This function embeds the dashboard into the webpage.
  // It sets up the options for the dashboard frame and content, then calls the embedDashboard method of the embedding context to embed the dashboard.
  const embed = async () => {
    console.log("Dashboard URL", dashboardUrl); // Debug line

    const frameOptions = {
      url: dashboardUrl,
      container: dashboardRef.current,
      height: "700px",
      width: "100%",
      resizeHeightOnSizeChangedEvent: true,
    };

    const contentOptions = {
      toolbarOptions: {
        export: true,
        undoRedo: true,
        reset: true,
        bookmarks: true,
      },
      attributionOptions: {
        overlayContent: false,
      },
      onMessage: async (messageEvent, experienceMetadata) => {
        switch (messageEvent.eventName) {
          case "CONTENT_LOADED": {
            console.log(
              "All visuals are loaded. The title of the document:",
              messageEvent.message.title
            );
            break;
          }
          case "ERROR_OCCURRED": {
            console.log(
              "Error occurred while rendering the experience. Error code:",
              messageEvent.message.errorCode
            );
            break;
          }
          case "PARAMETERS_CHANGED": {
            console.log(
              "Parameters changed. Changed parameters:",
              messageEvent.message.changedParameters
            );
            break;
          }
          case "SELECTED_SHEET_CHANGED": {
            console.log(
              "Selected sheet changed. Selected sheet:",
              messageEvent.message.selectedSheet
            );
            break;
          }
          case "SIZE_CHANGED": {
            console.log("Size changed. New dimensions:", messageEvent.message);
            break;
          }
          case "MODAL_OPENED": {
            window.scrollTo({
              top: 0, // iframe top position
            });
            break;
          }
        }
      },
    };

    const newEmbeddedDashboard = await embeddingContext.embedDashboard(
      frameOptions,
      contentOptions
    );

    setEmbeddedDashboard(newEmbeddedDashboard);
  };

  return (
    <Layout style={{ position: "relative" }}>
      <main data-testid="maindiv">
        {isLoading ? (
          <div style={{ position: "relative", top: "210px", right: "35px" }}>
            <Loader />
          </div>
        ) : (
          <div ref={dashboardRef} data-testid="dashboardrefdiv" />
        )}
      </main>
    </Layout>
  );
}
