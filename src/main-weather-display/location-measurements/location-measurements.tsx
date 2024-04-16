import { useLocation, Link } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import './location-measurements.css';
import React from "react";

const LocationMeasurements = () => {
  // TODO:
  // unit tests
  const { state }: any = useLocation();
  const data1: Array<{ name: string, uv: number, pv: number, amt: number }> = [];
  const data2: Array<{ name: string, uv: number, pv: number, amt: number }> = [];
  state.measurementData.results[0].parameters.forEach((param: any) => {
    if (param.unit === 'µg/m³') {
      data1.push({ name: param.displayName, uv: param.average, pv: 2400, amt: 2400 })
    }
    if (param.unit === 'particles/cm³') {
      data2.push({ name: param.displayName, uv: param.average, pv: 2400, amt: 2400 })
    }
  });

  return (
    <div className="location-measurements-wrapper-div">
      <Link to="/"><button>Back</button></Link>
      <div className="location-measurements-div">
        <div className="cards-div">
          <h2 className="location-measurements-title">Measurements for Location</h2>
          {state.measurementData.results[0].parameters.map((measurement: any, index: any) => {
            return (
              <div key={index}>
                <p>Unit: {measurement.unit}</p>
                <p>Parameter: {measurement.parameter}</p>
                <p>Display Name: {measurement.displayName}</p>
                <p>Last Value: {measurement.lastValue}</p>
                <span>---------------------------------</span>
              </div>
            )
          })}
        </div>
        <div className="graph-div">
          <LineChart width={900} height={400} data={data1} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
            <Tooltip />
          </LineChart>
          <LineChart width={900} height={400} data={data2} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
            <Tooltip />
          </LineChart>
        </div>
      </div>
    </div>
  )
}

export default LocationMeasurements;