// src/api/weatherApi.js

// ============================================================================
// SECTION 1: IMPORTS AND CONFIGURATION
// ============================================================================

// Import the centralized API client for making HTTP requests
import { apiClient } from '../utils/apiClient';

// Load API key from environment variables for security
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Base URL for OpenWeatherMap API (using Vite proxy for CORS)
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ============================================================================
// SECTION 2: INDIVIDUAL API FUNCTIONS
// ============================================================================

/**
 * Fetches current weather data for a specified city
 * @param {string} city - Name of the city to search for
 * @returns {Promise<Object>} Current weather data object
 * @example getCurrentWeather("Tehran") → {main: {temp: 25, humidity: 40}, weather: [{...}], ...}
 */
export const getCurrentWeather = async (city) => {
  return apiClient(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}&lang=fa`
  );
};

/**
 * Fetches 5-day weather forecast for a specified city
 * @param {string} city - Name of the city to search for
 * @returns {Promise<Object>} Forecast data with 3-hour intervals
 * @example getForecast("Tehran") → {list: [{dt_txt: "2024-...", main: {...}, ...}, ...]}
 */
export const getForecast = async (city) => {
  return apiClient(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}&lang=fa`
  );
};

/**
 * Fetches air quality data based on geographic coordinates
 * @param {number} lat - Latitude coordinate
 * @param {number} lon - Longitude coordinate
 * @returns {Promise<Object>} Air pollution data
 * @example getAirQuality(35.6892, 51.3890) → {list: [{main: {aqi: 2}, ...}]}
 */
export const getAirQuality = async (lat, lon) => {
  return apiClient(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
};

// ============================================================================
// SECTION 3: CONSOLIDATED DATA FETCHING FUNCTION
// ============================================================================

/**
 * Orchestrates fetching of all weather-related data with optimized parallel requests
 * This is the main function called by App.jsx to get complete weather information
 * 
 * @param {string} city - Name of the city to search for
 * @returns {Promise<Object>} Consolidated weather data object with:
 *   - current: Current weather conditions
 *   - forecast: Filtered 5-day forecast (one reading per day at 12:00)
 *   - airQuality: Air Quality Index (1-5) or default 1 if unavailable
 * 
 * @throws {Error} Propagates any API errors to the caller for centralized handling
 * 
 * @example getAllWeatherData("Tehran") → {
 *   current: {...current data},
 *   forecast: [...5 filtered forecast items],
 *   airQuality: 2
 * }
 */
export const getAllWeatherData = async (city) => {
  try {
    // ------------------------------------------------------------------------
    // STEP 1: Fetch current weather (required for coordinates)
    // ------------------------------------------------------------------------
    const currentWeather = await getCurrentWeather(city);
    
    // ------------------------------------------------------------------------
    // STEP 2: Initiate parallel requests for forecast and air quality
    // ------------------------------------------------------------------------
    const forecastPromise = getForecast(city);
    const airQualityPromise = getAirQuality(
      currentWeather.coord.lat,      // Latitude from current weather response
      currentWeather.coord.lon       // Longitude from current weather response
    );

    // ------------------------------------------------------------------------
    // STEP 3: Execute parallel requests and wait for all to complete
    // ------------------------------------------------------------------------
    const [forecast, airQuality] = await Promise.all([
      forecastPromise,      // 5-day forecast data
      airQualityPromise     // Air quality data
    ]);

    // ------------------------------------------------------------------------
    // STEP 4: Process and structure the response data
    // ------------------------------------------------------------------------
    return {
      // Current weather conditions
      current: currentWeather,
      
      // Filter forecast to show only one reading per day (at 12:00:00)
      forecast: forecast.list.filter(item => item.dt_txt.includes("12:00:00")),
      
      // Extract Air Quality Index or use default value 1 (Good)
      airQuality: airQuality.list[0]?.main?.aqi || 1
    };
    
  } catch (error) {
    // ------------------------------------------------------------------------
    // ERROR HANDLING: Log error and re-throw for upstream handling
    // ------------------------------------------------------------------------
    console.error('Error fetching weather data:', error);
    throw error; // Propagate error to App.jsx for user notification
  }
};