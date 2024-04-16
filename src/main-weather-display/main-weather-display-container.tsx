import { useState, useRef, useEffect, Dispatch, SetStateAction, MutableRefObject } from 'react';
import { useNavigate } from "react-router-dom";
import WorldMap from './world-map/world-map';
import './main-weather-display.css';
import React from 'react';

const MainWeatherDisplayContainer = () => {
  const dataUrl = 'https://api.openaq.org/v2/locations?limit=1000&page=1&offset=0&sort=desc&radius=1000&order_by=lastUpdated&&dumpRaw=false';

  const airQualityData: MutableRefObject<{}> = useRef({});
  const [loading, setLoading]: Array<boolean | Dispatch<SetStateAction<boolean>>> = useState(false);

  const measurementDataForLocation: MutableRefObject<{}> = useRef({});
  useEffect((): void => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    const data = await fetch(dataUrl);
    const dataToJson = await data.json();

    airQualityData.current = [...dataToJson.results]
  }

  const getMeasurementData = async (locationId: number) => { 
    const getMeasurementDataForLocation = `https://api.openaq.org/v2/locations/${locationId}?limit=100&page=1&offset=0&sort=desc&radius=1000&order_by=lastUpdated&dumpRaw=false`;
    
    const res = await fetch(getMeasurementDataForLocation);
    
    const measurementData = res.json();
    measurementDataForLocation.current = measurementData;
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
      <div className="main-weather-display-container-div">
        <h1 className="main-air-quality-display-title">Main Air Quality Display</h1>
        <WorldMap airQualityData={airQualityData} getMeasurementData={getMeasurementData} measurementDataForLocation={measurementDataForLocation} navigate={navigate} onLoad={onLoad} />
      </div>
    );

  }

}

export default MainWeatherDisplayContainer;
