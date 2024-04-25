import './air-quality-information.css';
import React from 'react';

const AirQualityInformation = (props: any) => {
    
    return (
        <div className="air-quality-information-div">
            <h4>Monitoring and Regulation</h4>
            <p>
                PM levels are monitored to ensure they do not exceed established standards
                to protect public health. The World Health Organization
                (WHO), the United States Environmental Protection Agency (EPA), and other
                regulatory bodies have established air quality guidelines for PM2.5
                and PM10.
            </p>
        </div>
    );
};

export default AirQualityInformation;
