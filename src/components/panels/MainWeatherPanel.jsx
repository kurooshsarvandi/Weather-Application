// components/panels/MainWeatherPanel.jsx
import React from 'react';
import SearchBox from '../common/SearchBox';
import WeatherIcon from '../weather/WeatherIcon';
import AirQuality from '../weather/AirQuality';
import PrayerTimes from '../common/PrayerTimes';

const MainWeatherPanel = ({
  city,
  setCity,
  weather,
  theme,
  timeData,
  airQuality,
  prayerTimes,
  onSearch
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 md:p-10 rounded-[45px] shadow-2xl flex-1 w-full max-w-md relative">
      
      {/* Weather Icon */}
      {weather && <WeatherIcon weather={weather} theme={theme} />}
      
      {/* Search Box */}
      <SearchBox city={city} setCity={setCity} onSearch={onSearch} />

      {weather ? (
        <div className="text-center md:text-right">
          <div className="flex flex-col items-center md:items-end mb-6">
            <div className="text-xs font-bold uppercase tracking-widest bg-black/20 px-4 py-1 rounded-full mb-1">
              {timeData.text}
            </div>
            <div className="text-6xl font-black tracking-tighter">
              {timeData.timeString}
            </div>
          </div>

          {/* Air Quality */}
          <AirQuality airQuality={airQuality} />

          <h2 className="text-3xl font-bold opacity-90">{weather.name}</h2>
          <div className="text-8xl font-black my-2">
            {Math.round(weather.main.temp)}°
          </div>
          
          <div className="flex justify-center md:justify-end gap-4 text-[11px] opacity-60 mb-6">
            <div className="flex items-center gap-1">
              ☀️ {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="flex items-center gap-1">
              🌙 {new Date(weather.sys.sunset * 1000).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
              <p className="text-[10px] opacity-40 uppercase">رطوبت</p>
              <p className="text-xl font-bold">{weather.main.humidity}%</p>
            </div>
            <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
              <p className="text-[10px] opacity-40 uppercase">سرعت باد</p>
              <p className="text-xl font-bold">{weather.wind.speed} m/s</p>
            </div>
          </div>

          {/* Prayer Times */}
          <PrayerTimes prayerTimes={prayerTimes} />
        </div>
      ) : (
        <div className="py-24 text-center opacity-10 font-black text-3xl uppercase tracking-[10px]">
          Weather
        </div>
      )}
    </div>
  );
};

export default MainWeatherPanel;