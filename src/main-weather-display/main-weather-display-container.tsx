import { useState, useRef, useEffect, Dispatch, SetStateAction, MutableRefObject } from 'react';
import { useNavigate } from "react-router-dom";
import WorldMap from './world-map/world-map';
import './main-weather-display.css';
import React from 'react';

const MainWeatherDisplayContainer = () => {
  const dataUrl = 'https://api.openaq.org/v2/locations?limit=1000&page=1&offset=0&sort=desc&radius=1000&order_by=lastUpdated&&dumpRaw=false';

  const airQualityData: MutableRefObject<{}> = useRef({});
  const [loading, setLoading]: Array<boolean | Dispatch<SetStateAction<boolean>>> = useState(false);

  const measurementData: MutableRefObject<{}> = useRef({});
  useEffect((): void => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    const data = await fetch(dataUrl);
    const dataToJson = await data.json();

    airQualityData.current = [...dataToJson.results]
  }

  const getMeasurementData = async (locationId: number): Promise<MutableRefObject<{}>> => { 
    const getMeasurementData = `https://api.openaq.org/v2/locations/${locationId}?limit=1000&page=1&offset=0&sort=desc&radius=1000&order_by=lastUpdated&dumpRaw=false`;
    
    const res = await fetch(getMeasurementData);
    
    measurementData.current = res.json();
    return measurementData;
  }

  let navigate = useNavigate();

  const onLoad = () => {
    setLoading(true);
  }

  if (loading) {
    return (
      <div>
        <div className="location-data-loader"/>
        <h3 className="loading-text">Loading. Please wait.</h3>
      </div>
    )
  } else {
    return (
      <div>
        <h1 className="main-air-quality-display-title">Air Quality Application</h1>
      
        <div className="main-weather-display-container-div">

          <div className="sidebar left-sidebar">
            {/* this becomes a component */}
            <h2>Air Quality Insights</h2>
            <p>Learn why monitoring air quality is crucial for health and environment.</p>
          </div>

          <WorldMap airQualityData={airQualityData} getMeasurementData={getMeasurementData} navigate={navigate} onLoad={onLoad} />

          <div className="sidebar right-sidebar">
            {/* this becomes a component */}
            <h2>Understanding PM Levels</h2>
            <p>PM2.5 and PM10 are common air pollutants that are monitored worldwide.</p>
          </div>
        </div>
      </div>
    );

  }

}

export default MainWeatherDisplayContainer;
