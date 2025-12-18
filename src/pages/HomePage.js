/**HomePage.js
 *
 * This is a React component that serves as the home page of the application.
 * The component fetches project site data from an API when it mounts, and also fetches weather data for each project site.
 * Once data has been fetched, it renders a list of project sites and a Google Map showing the location of the currently selected project site.
 * Each project site is represented by a Card component, which displays the site's name, image, location, weather data, and a "More" button. Clicking the "More" button navigates to a detailed view of the project site.
 *
 Author : Arpana Meshram
  Date : 01-08-2023
   Revision:
         1.0 - 01-08-2023  : Development of React.Js code for Project Site home page
         2.0 - 01-09-2023  : API  integration for project site home page
         3.0 - 27-09-2023  : Googlemap and Weather API integration for project site
         4.0 - 08-10-2023  : Modifications in new designs for project Site page ( projectsite photo , convert time zone in UTC
                                  country name , country code and show respective lat lon )
         5.0 - 16-02-2024  : Develop RBAC for Project site landing page
         6.0 - 29-03-2024  : comment added for each function and variable.
         7.0 - 05-04-2024  : Create A searchbar on Projectsite List and add scrollbar on project site card design , text wrap for projectsite name.
         8.0 - 30-08-2024  :  API key integration (google- AIzaSyDT3hirHT4sh11ee_EN2SJViC5qndM-CAc ) 
                                                  (openweather-bcda10ba323e88e96cb486015a104d1d)
         
 */
import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProjectSite_Layout from "../components/ProjectSite_Layout";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import { ProjectContext } from "../ProjectContext";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { fetchPermissions } from "../features/permissions/permissionsSlice";
import { fetchrole } from "../features/permissions/userroleSlice";
import { fetchAssociatedProjects } from "../features/permissions/userAssociatedProjectSlice";
import { Spin } from "antd";
import LoaderDatagrid from "../components/common/LoaderDatagrid";
import RainIcon from "../assets/weather/rain.png";
import CloudIcon from "../assets/weather/cloudy.png";
import ClearskyIcon from "../assets/weather/sun.png";
import FoggyIcon from "../assets/weather/foggy.png";
import SnowyIcon from "../assets/weather/snowy.png";
import Thunderstrom from "../assets/weather/thunderstorm.png";
import HazeIcon from "../assets/weather/haze.png";
import SunnyIcon from "../assets/weather/sun.png";
import DefaultIcon from "../assets/weather/default.png";
import WindIcon from "../assets/weather/wind.png";
import Celsius from "../assets/weather/celsiuss.png";
import Humidity from "../assets/weather/humidity.png";
import SmokeIcon from "../assets/weather/smoke.png";

//CSS
import "../styles/HomePage.css";
import ProjectSite_LayoutDisabled from "../components/ProjectSite_LayoutDisabled";

axios.defaults.baseURL = `${window.REACT_APP_SERVER_URL}`;

const HomePage = () => {
  // useLoadScript hook is used to load the Google Maps script.
  const { isLoaded } = useLoadScript({
    //googleMapsApiKey: "AIzaSyDT3hirHT4sh11ee_EN2SJViC5qndM-CAc",  old API KEY  && AIzaSyAwxyff984ODfM7zn_LRo-QJgdlreW2PE4 , BUY API KEY
    googleMapsApiKey:
      window.REACT_APP_APIKEY_google ||
      "AIzaSyDT3hirHT4sh11ee_EN2SJViC5qndM-CAc",
  });
  const GeocodeAPIkey =
    window.REACT_APP_APIKEY_google || "AIzaSyDT3hirHT4sh11ee_EN2SJViC5qndM-CAc";
  // const [center, setCenter] = useState({ lat: 1.352083, lng: 103.819839 });
  const [data, setData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setProjectSiteName } = useContext(ProjectContext);
  // Add a new state for the search term
  const [searchTerm, setSearchTerm] = useState("");
  //RBAC
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.permissions);
  const userRole = useSelector((state) => state.userRole);
  const AssociatedProject = useSelector((state) => state.AssociatedProject);
  const canClickonMoreButton = permissions.includes(
    "canClickOnMoreInProjectSite"
  );
  const canViewProjectSiteForUserGroup = permissions.includes(
    "canViewProjectSiteForUserGroupOnly"
  );

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchrole());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAssociatedProjects());
  }, [dispatch]);

  useEffect(() => {
    getProjectSites();
  }, []);

  // getProjectSites function fetches the projectsite.
  const getProjectSites = async () => {
    try {
      const response = await axios.get("/sites/project/projectSites");
      const projectSiteNames = response.data.map(
        (item) => item.projectSiteName
      );
      setData(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: JSON.stringify(error.response.data),
        });
        setData([]);
      } else {
        Swal.fire("Error", error.response.data);
      }
    } finally {
     setTimeout(()=>{setIsLoading(false)},1000)
    }
  };

  //API code for preprod
  const fetchLatLong = useCallback(async (projectLocation) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        projectLocation
      )}&key=${GeocodeAPIkey}`;
      const response = await fetch(url);
      const locationInfo = await response.json();
      //  console.log("response fetch Lat Long", locationInfo);
      if (locationInfo.results[0]) {
        const location = locationInfo.results[0].geometry.location;
        return location; // This will return an object with lat and lng properties
      } else {
        throw new Error(`No results for ${projectLocation}`);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  }, []);

  const fetchWeatherDataPerprod = useCallback(async () => {
    // if (process.env.NODE_ENV === 'perprod') return;

    const updatedWeatherData = [];
    console.log(process.env.NODE_ENV);
    for (const cityData of data) {
      if (cityData.projectLocation) {
        try {
          // Fetch latitude and longitude
          const location = await fetchLatLong(cityData.projectLocation);
          // Fetch weather data using latitude and longitude
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&units=metric&appid=${window.REACT_APP_APIKEY_weather}`;
          const response = await fetch(url);
          const weatherInfo = await response.json();
          updatedWeatherData.push({
            name: cityData.projectSiteName,
            aliasName: cityData.projectSiteAlias,
            image: cityData.siteImage,
            projectLocation: cityData.projectLocation,
            temperature: Math.round(weatherInfo.main.temp),
            humidity: weatherInfo.main.humidity,
            lat: location.lat,
            lon: location.lng,
            weather: weatherInfo.weather[0].main,
            timezone: moment()
              .utcOffset(weatherInfo.timezone / 60)
              .format("dddd , h:mm A"),
            dt: weatherInfo.dt,
          });
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    }
    setWeatherData(updatedWeatherData);
  }, [data]);

  //API code for dev staging
  // useEffect hooks are used to call the fetchWeatherData function when the data changes.
  const fetchWeatherDataOther = useCallback(async () => {
    // if (process.env.NODE_ENV === 'dev' && process.env.NODE_ENV === 'staging') return;
    const updatedWeatherData = [];
    console.log(process.env.NODE_ENV);
    for (const cityData of data) {
      if (cityData.projectLocation) {
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityData.projectLocation}&units=metric&appid=f74319b07322665b1f3eec0366aa7993`; //bcda10ba323e88e96cb486015a104d1d    , //f74319b07322665b1f3eec0366aa7993
          const response = await fetch(url);
          const weatherInfo = await response.json();
          updatedWeatherData.push({
            name: cityData.projectSiteName,
            aliasName: cityData.projectSiteAlias,
            image: cityData.siteImage,
            projectLocation: cityData.projectLocation,
            temperature: Math.round(weatherInfo.main.temp),
            humidity: weatherInfo.main.humidity,
            lat: weatherInfo.coord.lat,
            lon: weatherInfo.coord.lon,
            weather: weatherInfo.weather[0].main,
            timezone: moment()
              .utcOffset(weatherInfo.timezone / 60)
              .format("dddd , h:mm A"),
            dt: weatherInfo.dt,
          });
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    }
    setWeatherData(updatedWeatherData);
  }, [data]);

  // Conditional rendering based on the environment

  useEffect(() => {
    const parts = window.REACT_APP_SERVER_URL.split("/");
    const env = parts[3];
    console.log(env);
    if (env === "preprod") {
      fetchWeatherDataPerprod();
    } else if (env === "dev" || env === "staging") {
      fetchWeatherDataOther();
    } else {
      fetchWeatherDataOther();
    }
  }, [fetchWeatherDataPerprod, fetchWeatherDataOther]);

  // useEffect hook is used to update the state of selectedCard when the weatherData changes.
  useEffect(() => {
    setSelectedCard(weatherData.length > 0 ? weatherData[0] : null);
  }, [weatherData]);

  // renderGoogleMap is a function that returns the GoogleMap component.
  const renderGoogleMap = () => {
    return (
      <div data-testid="google-map">
        <GoogleMap
          mapContainerClassName="map-container"
          center={{
            lat: parseFloat(selectedCard.lat),
            lng: parseFloat(selectedCard.lon),
          }}
          zoom={10}
          data-testid="google-map"
        >
          <Marker
            position={{
              lat: parseFloat(selectedCard.lat),
              lng: parseFloat(selectedCard.lon),
            }}
          />
        </GoogleMap>
      </div>
    );
  };

  // renderProjectSites is a function that returns a list of Card components for each project site.
  const renderProjectSites = () => {
    let projectSitesToRender = [];

    if (userRole === "SuperAdmin") {
      projectSitesToRender = weatherData;
    } else if (canViewProjectSiteForUserGroup) {
      // Find the intersection of weatherData and groupProjectSite based on name and projectSiteName
      projectSitesToRender = weatherData.filter((data) =>
        AssociatedProject.some(
          (groupData) => groupData.projectSiteName === data.name
        )
      );
      console.log(
        "projectSites Render when user have permissions",
        projectSitesToRender
      );
    } else {
      projectSitesToRender = weatherData;
    }
    // Filter the project sites based on the search term
    projectSitesToRender = projectSitesToRender.filter((site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return projectSitesToRender.map((data, index) => (
      <Card key={index} data={data} onClick={() => setSelectedCard(data)} />
    ));
  };
  //weather icon code
  const getWeatherIcon = (weather) => {
    switch (weather) {
      case "Clear":
        return (
          <img
            src={ClearskyIcon}
            alt="Clear Sky"
            style={{ height: "35px", width: "35px" }}
          />
        );
      case "Wind":
        return (
          <img
            src={WindIcon}
            alt="Clear Sky"
            style={{ height: "35px", width: "35px" }}
          />
        );
      case "Clouds":
        return (
          <img
            src={CloudIcon}
            alt="Cloudy"
            style={{ height: "35px", width: "35px" }}
          />
        );
      case "Smoke":
        return (
          <img
            src={SmokeIcon}
            alt="Cloudy"
            style={{ height: "35px", width: "35px" }}
          />
        );
      case "Sunny":
        return (
          <img
            src={SunnyIcon}
            alt="Snow"
            style={{ height: "35px", width: "35px" }}
          />
        );
      case "Rain":
        return (
          <img
            src={RainIcon}
            alt="Rain"
            style={{ height: "35px", width: "35px" }}
          />
        );

      case "Thunderstorm":
        return (
          <img
            src={Thunderstrom}
            alt="Thunderstorm"
            style={{ height: "35px", width: "35px" }}
          />
        );
      case "Snow":
        return (
          <img
            src={SnowyIcon}
            alt="Snow"
            style={{ height: "35px", width: "35px" }}
          />
        );
      case "Drizzle":
      case "Mist":
      case "Fog":
        return (
          <img
            src={FoggyIcon}
            alt="Fog"
            style={{ height: "38px", width: "38px" }}
          />
        );
      case "Haze":
        return (
          <img
            src={HazeIcon}
            alt="Fog"
            style={{ height: "38px", width: "38px" }}
          />
        );
      default:
        return (
          <img
            src={DefaultIcon}
            alt="Default weather"
            style={{ height: "35px", width: "35px" }}
          />
        );
    }
  };
  // Card is a component that displays the details of a project site.
  const Card = ({ data, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
      setProjectSiteName(data.name);
      navigate(`/project-sites/${data.name}/schematic-status`);
    };

    return (
      <div
        onClick={onClick}
        className="card-container"
        style={{ marginTop: "2px" }}
        role="article"
        aria-label="card"
      >
        <h3 className="card-title">{data.aliasName}</h3>
        <div className="d-flex">
          <div className="cardimg">
            <img
              src={`data:image/jpeg;base64,${data.image}`}
              alt="siteImg"
              className="Cardimg img-fluid"
              role="img"
            />
          </div>
          <div className="card-body px-4" data-testid="card-body-id">
            <p className="card-text">Weather</p>
            <div style={{ display: "flex" }}>
              <div>
                <p className="m-0" style={{ fontSize: "14px" }}>
                  <span style={{ marginRight: "5px" }}>
                    {data.temperature}{" "}
                    <img
                      src={Celsius}
                      alt="Celsius"
                      style={{ height: "26px", width: "26px", margin: "-4px" }}
                    />{" "}
                  </span>
                  |{" "}
                  <span style={{ marginLeft: "5px" }}>
                    {data.humidity}{" "}
                    <img
                      src={Humidity}
                      alt="humidity"
                      style={{ height: "30px", width: "30px", margin: "-5px" }}
                    />
                  </span>
                </p>
                <p className="mt-1">{data.timezone}</p>
              </div>
              <div style={{ paddingLeft: "40px" }}>
                <Tooltip title={data.weather} arrow>
                  <p className="mb-2">{getWeatherIcon(data.weather)}</p>
                </Tooltip>
              </div>
            </div>
            <Tooltip
              title={
                userRole !== "SuperAdmin" && !canClickonMoreButton
                  ? "You do not have permission"
                  : ""
              }
              arrow
            >
              <span>
                <Button
                  onClick={handleClick}
                  size="small"
                  variant="contained"
                  disabled={userRole !== "SuperAdmin" && !canClickonMoreButton}
                  className={
                    userRole !== "SuperAdmin" && !canClickonMoreButton
                      ? ""
                      : "button_warning"
                  }
                >
                  More
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {!isLoading ? (
        <ProjectSite_Layout>
          <div className="row">
            <div className="col-lg-5 col-md-5 col-sm col-xl-5 col-12 flex-conrtaine">
              {/* <h1 className="projectSiteHeading">Project Sites</h1> */}
              <div>
                {weatherData.length <= 0 ? (
                  <div className="searchContainer">
                    <input
                      type="search"
                      placeholder=" loading projects...."
                      disabled={true}
                      className="projectSearch"
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <i className="fa fa-search searchIcon"></i>
                  </div>
                ) : (
                  <div className="searchContainer">
                    <input
                      type="search"
                      placeholder="search projects...."
                      className="projectSearch"
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <i className="fa fa-search searchIcon"></i>
                  </div>
                )}

                <div className="card-body px-3 py-1">
                  <div>{renderProjectSites()}</div>
                </div>
              </div>
            </div>

            <div className="col-lg-7 col-md-7 col-sm col-xl-7 col-12">
              {isLoaded && (
                <div
                  style={{ height: "500px", width: "100%" }}
                  role="map-container"
                >
                  {weatherData.length > 0 ? (
                    selectedCard && renderGoogleMap()
                  ) : (
                    <div
                      style={{ position: "relative", top: "50%", right: "40%" }}
                    >
                      <LoaderDatagrid />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ProjectSite_Layout>
      ) : (
        <ProjectSite_LayoutDisabled>
          <div className="row">
            <div className="col-lg-5 col-md-5 col-sm col-xl-5 col-12 flex-conrtaine">
              {/* <h1 className="projectSiteHeading">Project Sites</h1> */}
              <div>
                {weatherData.length <= 0 ? (
                  <div className="searchContainer">
                    <input
                      type="search"
                      placeholder=" loading projects...."
                      disabled={true}
                      className="projectSearch"
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <i className="fa fa-search searchIcon"></i>
                  </div>
                ) : (
                  <div className="searchContainer">
                    <input
                      type="search"
                      placeholder="search projects...."
                      className="projectSearch"
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <i className="fa fa-search searchIcon"></i>
                  </div>
                )}

                <div className="card-body px-3 py-1">
                  <div>{renderProjectSites()}</div>
                </div>
              </div>
            </div>

            <div className="col-lg-7 col-md-7 col-sm col-xl-7 col-12">
              {isLoaded && (
                <div
                  style={{ height: "500px", width: "100%" }}
                  role="map-container"
                >
                  {weatherData.length > 0 ? (
                    selectedCard && renderGoogleMap()
                  ) : (
                    <div
                      style={{ position: "relative", top: "50%", right: "40%" }}
                    >
                      <LoaderDatagrid />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ProjectSite_LayoutDisabled>
      )}
    </>
  );
};

export default HomePage;
