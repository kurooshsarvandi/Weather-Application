// src/api/weatherApi.js
import { apiClient } from '../utils/apiClient';

// دریافت کلید API از محیط
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = '/weather-api/data/2.5';

/**
 * دریافت اطلاعات آب و هوای فعلی یک شهر
 * @param {string} city - نام شهر
 * @returns {Promise} اطلاعات آب و هوا
 */
export const getCurrentWeather = async (city) => {
  return apiClient(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}&lang=fa`
  );
};

/**
 * دریافت پیش‌بینی ۵ روزه آب و هوا
 * @param {string} city - نام شهر
 * @returns {Promise} لیست پیش‌بینی‌ها
 */
export const getForecast = async (city) => {
  return apiClient(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}&lang=fa`
  );
};

/**
 * دریافت کیفیت هوا بر اساس مختصات
 * @param {number} lat - عرض جغرافیایی
 * @param {number} lon - طول جغرافیایی
 * @returns {Promise} اطلاعات کیفیت هوا
 */
export const getAirQuality = async (lat, lon) => {
  return apiClient(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
};

/**
 * دریافت تمام اطلاعات آب و هوا به صورت یکجا
 * @param {string} city - نام شهر
 * @returns {Promise} آب و هوای فعلی، پیش‌بینی و کیفیت هوا
 */
export const getAllWeatherData = async (city) => {
  try {
    // دریافت آب و هوای فعلی
    const currentWeather = await getCurrentWeather(city);
    
    // دریافت پیش‌بینی (به صورت موازی برای سرعت)
    const forecastPromise = getForecast(city);
    
    // دریافت کیفیت هوا بر اساس مختصات
    const airQualityPromise = getAirQuality(
      currentWeather.coord.lat, 
      currentWeather.coord.lon
    );

    // منتظر تمام درخواست‌ها بمان
    const [forecast, airQuality] = await Promise.all([
      forecastPromise,
      airQualityPromise
    ]);

    return {
      current: currentWeather,
      forecast: forecast.list.filter(item => item.dt_txt.includes("12:00:00")),
      airQuality: airQuality.list[0]?.main?.aqi || 1
    };
  } catch (error) {
    console.error('خطا در دریافت اطلاعات آب و هوا:', error);
    throw error;
  }
};