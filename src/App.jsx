import React, { useState, useRef, useEffect } from 'react';

const weatherConfig = {
  Clear: { bg: "from-orange-400 to-yellow-600", quote: "Sun's out! Don't forget your sunglasses. 😎", sound: "/park child.wav" },
  Night: { bg: "from-slate-900 to-indigo-950", quote: "The stars are out. Have a peaceful night! 🌙", sound: "/park child.wav" },
  Rain: { bg: "from-blue-700 to-slate-900", quote: "It's raining! Grab an umbrella. ☔", sound: "/mixkit-heavy.wav" },
  Thunderstorm: { bg: "from-purple-900 to-black", quote: "Thunder! Better stay indoors. ⚡", sound: "/thunder.wav" },
  Clouds: { bg: "from-gray-500 to-blue-900", quote: "A bit cloudy today, perfect for a coffee. ☕", sound: "/wind-blowing.wav" },
  Snow: { bg: "from-blue-100 to-indigo-300", quote: "Snowing! Build a snowman. ☃️", sound: "/snow.mp3" },
  Mist: { bg: "from-teal-700 to-gray-700", quote: "Foggy weather, drive safely! 🌫️", sound: "" }
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const audioRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = Array.from({ length: 28 }, (_, i) => `/img/photo_${i + 1}.webp`);

  // --- Calendar Function ---
  const getFullDate = () => {
    const now = new Date();
    const jalali = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
    const gregorian = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(now);
    const islamic = new Intl.DateTimeFormat('fa-IR-u-ca-islamic-uma', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
    const weekday = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(now);

    return { jalali, gregorian, islamic, weekday };
  };
  const dateInfo = getFullDate();

  useEffect(() => {
    slides.forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  useEffect(() => {
    let interval;
    if (!weather) {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [weather]);

  const getLocalTimeData = (timezoneOffset) => {
    const localDate = new Date(new Date().getTime() + timezoneOffset * 1000 + (new Date().getTimezoneOffset() * 60000));
    const hours = localDate.getHours();
    const timeString = localDate.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    let status = { text: "روز بخیر", icon: "☀️", isNight: hours < 5 || hours >= 20 };
    return { timeString, ...status };
  };

  const playWeatherSound = (status) => {
    const soundUrl = weatherConfig[status]?.sound;
    if (soundUrl) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
      const audio = new Audio(soundUrl);
      audio.volume = 0.4;
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  };

  const handleSearch = async () => {
    if (!city.trim()) return;
    const API_KEY = "d364c3561c0faef5f5376ed9641c3a1f";
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=fa`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}&lang=fa`;

    try {
      const resCurrent = await fetch(currentUrl);
      const dataCurrent = await resCurrent.json();
      if (resCurrent.ok) {
        setWeather(dataCurrent);
        playWeatherSound(dataCurrent.weather[0].main);
        const resForecast = await fetch(forecastUrl);
        const dataForecast = await resForecast.json();
        const dailyData = dataForecast.list.filter(item => item.dt_txt.includes("12:00:00"));
        setForecast(dailyData);
      } else { alert("شهر پیدا نشد!"); }
    } catch (e) { console.error(e); }
  };

  const timeData = weather ? getLocalTimeData(weather.timezone) : null;
  const weatherType = weather?.weather[0].main;
  const currentTheme = (weather && timeData?.isNight && weatherType === "Clear") 
    ? weatherConfig["Night"] : (weatherConfig[weatherType] || { bg: "from-blue-500 to-indigo-800", quote: "Discover the world's weather 🌍" });

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-10 overflow-hidden font-sans text-white">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        {weather ? (
          <div className={`w-full h-full bg-gradient-to-br ${currentTheme.bg} transition-all duration-1000`}></div>
        ) : (
          slides.map((slide, index) => (
            <div key={index} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlideIndex ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url(${slide})` }}><div className="absolute inset-0 bg-black/40"></div></div>
          ))
        )}
      </div>

      {/* Quote */}
      <div className="absolute top-6 left-6 z-20 hidden lg:block max-w-sm">
        <p className="text-3xl font-black italic opacity-80 leading-snug">{currentTheme.quote}</p>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl z-10 items-stretch mt-10 lg:mt-0">
        
        {/* PANEL 1: Triple Calendar */}
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[40px] border border-white/10 flex flex-col justify-center min-w-[250px] animate-in fade-in slide-in-from-left duration-1000">
           <div className="text-center">
              <p className="text-blue-400 font-bold text-xl mb-1">{dateInfo.weekday}</p>
              <div className="bg-white/10 h-[1px] w-1/2 mx-auto my-4"></div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[3px] opacity-50 mb-1">خورشیدی</p>
                  <p className="text-2xl font-black">{dateInfo.jalali}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[3px] opacity-50 mb-1">Gregorian</p>
                  <p className="text-xl font-medium opacity-80">{dateInfo.gregorian}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[3px] opacity-50 mb-1">قمری</p>
                  <p className="text-lg opacity-70">{dateInfo.islamic}</p>
                </div>
              </div>
           </div>
        </div>

        {/* PANEL 2: Main Weather Card */}
        <div className="bg-white/10 backdrop-blur-3xl p-8 rounded-[40px] shadow-2xl flex-1 border border-white/20 relative min-w-[320px]">
          {weather && (
            <div className="absolute -top-16 -right-6 w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl animate-bounce duration-[3000ms]">
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="icon" />
            </div>
          )}
          <h1 className="text-xl font-bold mb-8 opacity-60 uppercase tracking-widest">Weather Dashboard</h1>
          <div className="flex gap-2 mb-10">
            <input type="text" value={city} dir="auto" onChange={(e) => setCity(e.target.value)} placeholder="جستجوی شهر..." 
              className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:bg-white/20 transition-all text-white placeholder:text-white/40" />
            <button onClick={handleSearch} className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-transform">GO</button>
          </div>

          {weather ? (
            <div className="text-center">
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-3 bg-black/20 px-5 py-2 rounded-full mb-3">
                  <span className="text-xl">{timeData.icon}</span>
                  <span className="text-sm font-bold">{timeData.text}</span>
                </div>
                <div className="text-6xl font-black tracking-tighter">{timeData.timeString}</div>
              </div>
              <h2 className="text-3xl font-bold mb-2">{weather.name}</h2>
              <div className="text-9xl font-black mb-4 drop-shadow-lg">{Math.round(weather.main.temp)}°</div>
              <p className="text-xl capitalize italic opacity-90 mb-8">{weather.weather[0].description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
                  <p className="text-[10px] uppercase opacity-40 mb-1 font-bold">Humidity</p>
                  <p className="text-2xl font-black">{weather.main.humidity}%</p>
                </div>
                <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
                  <p className="text-[10px] uppercase opacity-40 mb-1 font-bold">Wind Speed</p>
                  <p className="text-2xl font-black">{weather.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center opacity-30 italic">نام شهر را وارد کنید...</div>
          )}
        </div>

        {/* PANEL 3: Forecast Panel */}
        {weather && (
          <div className="bg-black/30 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 w-full lg:w-80 animate-in slide-in-from-right duration-700">
            <h3 className="text-lg font-bold mb-6 uppercase tracking-[4px] opacity-40">5-Day Forecast</h3>
            <div className="flex flex-col gap-3">
              {forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/5">
                  <div className="text-right">
                    <p className="font-bold text-sm">{new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(new Date(day.dt * 1000))}</p>
                  </div>
                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="icon" className="w-10 h-10" />
                  <p className="text-xl font-black">{Math.round(day.main.temp)}°</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;