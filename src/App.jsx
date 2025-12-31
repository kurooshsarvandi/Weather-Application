// src/App.jsx

// ============================================================================
// SECTION 1: IMPORTS AND DEPENDENCIES
// ============================================================================

// Core React hooks for state management and DOM reference
import React, { useState, useRef } from 'react';

// Application configuration and utility functions
import { weatherConfig } from './constants/weatherConfig';  // Visual/audio config for weather conditions
import { getLocalTimeData } from './utils/dateUtils';       // Converts timezone offset to local time
import { getWeatherTheme } from './utils/weatherUtils';     // Determines UI theme based on weather/time

// UI Component imports (organized by feature/module)
import DatePanel from './components/panels/DatePanel';               // Displays triple calendar
import MainWeatherPanel from './components/panels/MainWeatherPanel'; // Primary weather display
import ForecastPanel from './components/panels/ForecastPanel';       // 5-day forecast
import Background from './components/common/Background';             // Dynamic background handler

// API service layer abstraction (separation of concerns)
import { getAllWeatherData, getPrayerTimes } from './api';           // Centralized API calls

// Custom footer component (personal branding)
import CustomFooter from './components/CustomFooter/CustomFooter';   // Footer with social links

// ============================================================================
// SECTION 2: MAIN APP COMPONENT DEFINITION
// ============================================================================

function App() {
  // ==========================================================================
  // STATE MANAGEMENT HOOKS
  // ==========================================================================
  
  // User input for city search
  const [city, setCity] = useState("");
  
  // Current weather data from OpenWeatherMap API
  const [weather, setWeather] = useState(null);
  
  // 5-day forecast data (filtered to show one reading per day)
  const [forecast, setForecast] = useState([]);
  
  // Air Quality Index (1-5) from OpenWeatherMap
  const [airQuality, setAirQuality] = useState(null);
  
  // Islamic prayer times for the searched city
  const [prayerTimes, setPrayerTimes] = useState(null);
  
  // Loading state for UI feedback during API calls
  const [isLoading, setIsLoading] = useState(false);
  
  // Audio reference for playing weather-condition sounds
  const audioRef = useRef(null);

  // ==========================================================================
  // CORE APPLICATION LOGIC: SEARCH HANDLER
  // ==========================================================================
  
  /**
   * Orchestrates the main application workflow:
   * 1. Validates input → 2. Fetches weather data → 3. Fetches prayer times
   * 4. Updates state → 5. Plays audio feedback → 6. Handles errors
   * 
   * @async
   * @throws {Error} Propagates API errors for centralized handling
   */
  const handleSearch = async () => {
    // Guard clause: prevent empty searches
    if (!city.trim()) return;
    
    // UI feedback: show loading state
    setIsLoading(true);
    
    try {
      // ======================================================================
      // STEP 1: Fetch consolidated weather data (current + forecast + AQI)
      // ======================================================================
      const weatherData = await getAllWeatherData(city); 
      
      // Update state with weather information
      setWeather(weatherData.current);           // Current conditions
      setForecast(weatherData.forecast);         // 5-day forecast
      setAirQuality(weatherData.airQuality);     // Air quality index (1-5)
      
      // ======================================================================
      // STEP 2: Fetch Islamic prayer times (parallel or sequential)
      // ======================================================================
      const prayerData = await getPrayerTimes(city);
      setPrayerTimes(prayerData);
      
      // ======================================================================
      // STEP 3: Audio feedback based on weather condition
      // ======================================================================
      const condition = weatherData.current.weather[0].main;
      const soundFile = weatherConfig[condition]?.sound;
      
      if (soundFile) {
        // Stop any currently playing audio
        if (audioRef.current) audioRef.current.pause();
        
        // Create and play new audio instance
        audioRef.current = new Audio(soundFile);
        
        // Silent error handling for browser autoplay restrictions
        audioRef.current.play().catch(e => 
          console.log("Audio Play Blocked (user gesture required):", e)
        );
      }
      
    } catch (error) {
      // ======================================================================
      // ERROR HANDLING: User-friendly error messages
      // ======================================================================
      if (error.message.includes('404')) {
        // Specific handling for "city not found" errors
        alert("City not found! Please check the city name.");
      } else {
        // Generic error for network/issues
        alert("Error fetching data. Please try again.");
        console.error("Search Error Details:", error);
      }
    } finally {
      // ======================================================================
      // CLEANUP: Always reset loading state (success or error)
      // ======================================================================
      setIsLoading(false);
    }
  };

  // ==========================================================================
  // DERIVED STATE: Computed values based on current state
  // ==========================================================================
  
  // Calculate local time data only when weather data is available
  const timeData = weather ? getLocalTimeData(weather.timezone) : null;
  
  // Determine UI theme (colors, icons) based on weather and time of day
  const theme = getWeatherTheme(weather, timeData, weatherConfig);

  // ==========================================================================
  // COMPONENT RENDER: UI Structure
  // ==========================================================================
  return (
    // Root container: full viewport height with vertical flex layout
    <div className="min-h-screen flex flex-col">
      
      {/* =================================================================== */}
      {/* SECTION 1: MAIN CONTENT AREA (takes all available space) */}
      {/* =================================================================== */}
      <div className="flex-1 relative flex items-center justify-center p-4 lg:p-8 overflow-hidden font-sans text-white">
        
        {/* Dynamic background (slideshow or weather-based gradient) */}
        <Background weather={weather} theme={theme} />
        
        {/* Content container with responsive layout */}
        <div className="z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 w-full max-w-7xl">
          
          {/* Left Panel: Triple Calendar Display */}
          <DatePanel />
          
          {/* Center Panel: Primary Weather Information */}
          <MainWeatherPanel
            city={city}
            setCity={setCity}
            weather={weather}
            theme={theme}
            timeData={timeData}
            airQuality={airQuality}
            prayerTimes={prayerTimes}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
          
          {/* Right Panel: 5-Day Forecast (conditionally rendered) */}
          {weather && <ForecastPanel forecast={forecast} />}
          
        </div>
      </div>
      
      {/* =================================================================== */}
      {/* SECTION 2: FOOTER (always at bottom) */}
      {/* =================================================================== */}
      <CustomFooter />
      
    </div>
  );
}

// ============================================================================
// MODULE EXPORT
// ============================================================================
export default App;