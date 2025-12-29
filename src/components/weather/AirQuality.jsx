// components/weather/AirQuality.jsx
import React from 'react';
import { getAQIInfo } from '../../utils/weatherUtils';

const AirQuality = ({ airQuality }) => {
  if (!airQuality) return null;
  
  const aqiInfo = getAQIInfo(airQuality);
  
  return (
    <div className="flex justify-center md:justify-end mb-6">
      <div className={`px-4 py-1 rounded-full text-[10px] font-black shadow-lg flex items-center gap-2 ${aqiInfo.color} ${aqiInfo.shadow}`}>
        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
        کیفیت هوا: {aqiInfo.label}
      </div>
    </div>
  );
};

export default AirQuality;