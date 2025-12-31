// src/components/panels/MainWeatherPanel.jsx

// ============================================================================
// SECTION 1: IMPORTS
// ============================================================================

// Import React (necessary for JSX syntax)
import React from 'react';

// Import child components that this panel will use
import SearchBox from '../common/SearchBox';        // Search input and button
import WeatherIcon from '../weather/WeatherIcon';   // Animated weather icon
import AirQuality from '../weather/AirQuality';     // Air quality indicator
import PrayerTimes from '../common/PrayerTimes';    // Islamic prayer times display

// ============================================================================
// SECTION 2: COMPONENT DEFINITION WITH PROPS
// ============================================================================

/**
 * MainWeatherPanel - The central weather display component
 * 
 * This is a presentational (dumb) component that receives all data via props
 * and focuses solely on rendering the UI. It doesn't manage any state itself.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.city - Current city input value
 * @param {Function} props.setCity - Function to update city state
 * @param {Object|null} props.weather - Current weather data from API
 * @param {Object} props.theme - UI theme (colors, icons) based on weather/time
 * @param {Object|null} props.timeData - Local time information for the city
 * @param {number|null} props.airQuality - Air Quality Index (1-5)
 * @param {Object|null} props.prayerTimes - Islamic prayer times
 * @param {Function} props.onSearch - Function to trigger weather search
 * 
 * @returns {JSX.Element} The rendered weather panel
 * 
 * @example
 * <MainWeatherPanel
 *   city="Tehran"
 *   setCity={setCityFunction}
 *   weather={weatherData}
 *   theme={currentTheme}
 *   timeData={localTimeInfo}
 *   airQuality={3}
 *   prayerTimes={prayerData}
 *   onSearch={handleSearch}
 * />
 */
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
  // ==========================================================================
  // SECTION 3: COMPONENT RENDER LOGIC
  // ==========================================================================
  
  return (
    // Main container with glassmorphism effect and responsive sizing
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 md:p-10 rounded-[45px] shadow-2xl flex-1 w-full max-w-md relative">
      
      {/* ==================================================================== */}
      {/* WEATHER ICON (Conditionally rendered) */}
      {/* ==================================================================== */}
      {weather && <WeatherIcon weather={weather} theme={theme} />}
      
      {/* ==================================================================== */}
      {/* SEARCH BOX (Always visible) */}
      {/* ==================================================================== */}
      <SearchBox city={city} setCity={setCity} onSearch={onSearch} />

      {/* ==================================================================== */}
      {/* CONDITIONAL RENDERING: Weather Data vs Empty State */}
      {/* ==================================================================== */}
      {weather ? (
        // ====================================================================
        // WEATHER DATA STATE: City has been searched, data exists
        // ====================================================================
        <div className="text-center md:text-right">
          
          {/* ---------------------------------------------------------------- */}
          {/* TIME DISPLAY SECTION */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex flex-col items-center md:items-end mb-6">
            {/* Greeting text based on time of day */}
            <div className="text-xs font-bold uppercase tracking-widest bg-black/20 px-4 py-1 rounded-full mb-1">
              {timeData.text}
            </div>
            
            {/* 24-hour time display */}
            <div className="text-5xl font-black tracking-tighter">
              {timeData.timeString}
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* AIR QUALITY INDICATOR */}
          {/* ---------------------------------------------------------------- */}
          <AirQuality airQuality={airQuality} />

          {/* ---------------------------------------------------------------- */}
          {/* CITY NAME AND TEMPERATURE */}
          {/* ---------------------------------------------------------------- */}
          <h2 className="text-3xl font-bold opacity-90">{weather.name}</h2>
          <div className="text-5xl font-black my-2">
            {Math.round(weather.main.temp)}°
          </div>
          
          {/* ---------------------------------------------------------------- */}
          {/* SUNRISE AND SUNSET TIMES */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex justify-center md:justify-end gap-4 text-[11px] opacity-60 mb-6">
            {/* Sunrise time */}
            <div className="flex items-center gap-1">
              ☀️ {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            
            {/* Sunset time */}
            <div className="flex items-center gap-1">
              🌙 {new Date(weather.sys.sunset * 1000).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* WEATHER METRICS GRID */}
          {/* ---------------------------------------------------------------- */}
          <div className="grid grid-cols-2 gap-4">
            {/* Humidity card */}
            <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
              <p className="text-[10px] opacity-40 uppercase">رطوبت</p>
              <p className="text-xl font-bold">{weather.main.humidity}%</p>
            </div>
            
            {/* Wind speed card */}
            <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
              <p className="text-[10px] opacity-40 uppercase">سرعت باد</p>
              <p className="text-xl font-bold">{weather.wind.speed} m/s</p>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* PRAYER TIMES COMPONENT */}
          {/* ---------------------------------------------------------------- */}
          <PrayerTimes prayerTimes={prayerTimes} />
          
        </div>
      ) : (
        // ====================================================================
        // EMPTY STATE: No city searched yet
        // ====================================================================
        <div className="py-24 text-center opacity-10 font-black text-3xl uppercase tracking-[10px]">
          Weather
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SECTION 4: EXPORT
// ============================================================================
export default MainWeatherPanel;