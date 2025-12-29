// src/App.jsx
import React, { useState, useRef } from 'react';
import { weatherConfig } from './constants/weatherConfig';
import { getLocalTimeData } from './utils/dateUtils';
import { getWeatherTheme } from './utils/weatherUtils';
import DatePanel from './components/panels/DatePanel';
import MainWeatherPanel from './components/panels/MainWeatherPanel';
import ForecastPanel from './components/panels/ForecastPanel';
import Background from './components/common/Background';
import { getAllWeatherData, getPrayerTimes } from './api';
import CustomFooter from './components/CustomFooter/CustomFooter';

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ اضافه شد: state برای لودینگ
  const audioRef = useRef(null);

  const handleSearch = async () => {
    if (!city.trim()) return;
    
    setIsLoading(true); // شروع لودینگ
    
    try {
      // 1. دریافت تمام اطلاعات آب و هوا به صورت یکجا
      const weatherData = await getAllWeatherData(city);
      
      setWeather(weatherData.current);
      setForecast(weatherData.forecast);
      setAirQuality(weatherData.airQuality);
      
      // 2. دریافت اوقات شرعی
      const prayerData = await getPrayerTimes(city);
      setPrayerTimes(prayerData);
      
      // 3. پخش صدای مربوطه
      const condition = weatherData.current.weather[0].main;
      const soundFile = weatherConfig[condition]?.sound;
      
      if (soundFile) {
        if (audioRef.current) audioRef.current.pause();
        audioRef.current = new Audio(soundFile);
        audioRef.current.play().catch(e => console.log("Audio Play Blocked:", e));
      }
      
    } catch (error) {
      if (error.message.includes('404')) {
        alert("شهر پیدا نشد! لطفاً نام شهر را بررسی کنید.");
      } else {
        alert("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.");
        console.error("Search Error:", error);
      }
    } finally {
      setIsLoading(false); // پایان لودینگ (چه موفق چه ناموفق)
    }
  };

  const timeData = weather ? getLocalTimeData(weather.timezone) : null;
  const theme = getWeatherTheme(weather, timeData, weatherConfig);

  return (
    <div className="min-h-screen flex flex-col">
      {/* بخش ۱: محتوای اصلی */}
      <div className="flex-1 relative flex items-center justify-center p-4 lg:p-8 overflow-hidden font-sans text-white">
        <Background weather={weather} theme={theme} />

        <div className="z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 w-full max-w-7xl">
          <DatePanel />
          
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
          
          {weather && <ForecastPanel forecast={forecast} />}
        </div>
      </div>
      
      
      <CustomFooter />
    </div>
  );
}

export default App;