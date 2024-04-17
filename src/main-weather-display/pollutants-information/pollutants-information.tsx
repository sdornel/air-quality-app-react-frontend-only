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

            {/* <p>
                Globally, PM levels are monitored to ensure they do not exceed set standards which are 
                established to protect public health. The World Health Organization (WHO), the United 
                States Environmental Protection Agency (EPA), and other regulatory bodies have established 
                air quality guidelines or standards for PM2.5 and PM10.
            </p> */}
        </div>
    );
};

export default PollutantsInformation;
