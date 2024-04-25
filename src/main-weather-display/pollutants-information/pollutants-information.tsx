import './pollutants-information.css';
import React from 'react';

const PollutantsInformation = (props: any) => {
    
    return (
        <div className="pollutants-information-div">
            <h4>About the PM2.5 and PM10 air pollutants</h4>
            <p>
                Particulate matter (PM) refers to tiny particles or droplets in the air that can be 
                inhaled and cause health problems. PM is categorized by the size of the particles, 
                and two of the most commonly monitored sizes are PM2.5 and PM10. These particles are 
                measured in micrometers (µm).
            </p>
        </div>
    );
};

export default PollutantsInformation;
