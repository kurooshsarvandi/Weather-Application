// components/panels/ForecastPanel.jsx
import React from 'react';

const ForecastPanel = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;
  
  return (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-7 rounded-[40px] w-full lg:w-72 shadow-2xl">
      <p className="text-[10px] font-black opacity-30 uppercase tracking-[5px] mb-8 text-center">
        پیش‌بینی ۵ روزه
      </p>
      <div className="space-y-4">
        {forecast.map((day, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5"
          >
            <span className="text-xs font-bold opacity-80 w-12">
              {new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(
                new Date(day.dt * 1000)
              )}
            </span>
            <img 
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
              className="w-10 h-10" 
              alt="weather icon" 
            />
            <span className="text-xl font-bold">{Math.round(day.main.temp)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastPanel;