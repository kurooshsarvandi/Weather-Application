// components/weather/WeatherIcon.jsx
import React from 'react';

const WeatherIcon = ({ weather, theme }) => {
  if (!weather) return null;
  
  return (
    <div className={`absolute -top-16 -right-8 text-8xl drop-shadow-2xl ${theme.animate}`}>
      {theme.icon}
    </div>
  );
};

export default WeatherIcon;