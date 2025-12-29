// src/api/prayerApi.js
import { apiClient } from '../utils/apiClient.js';

export const getPrayerTimes = async (city) => {
  try {
    // استفاده از پروکسی عمومی برای دور زدن CORS
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=8`;
    
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
    const data = await response.json();
    return data.data?.timings || null;
  } catch (error) {
    console.warn('خطا در دریافت اوقات شرعی:', error);
    return null;
  }
};