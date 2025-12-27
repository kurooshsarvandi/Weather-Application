import React, { useState, useRef, useEffect } from 'react';

// Weather configurations for background, icons, and sounds
const weatherConfig = {
  Clear: { bg: "from-orange-400 to-yellow-600", icon: "☀️", animate: "animate-spin-slow", sound: "/park child.wav" },
  Night: { bg: "from-slate-900 to-indigo-950", icon: "🌙", animate: "animate-pulse", sound: "/park child.wav" },
  Rain: { bg: "from-blue-700 to-slate-900", icon: "🌧️", animate: "animate-bounce", sound: "/mixkit-heavy.wav" },
  Clouds: { bg: "from-gray-500 to-blue-900", icon: "☁️", animate: "animate-pulse", sound: "/wind-blowing.wav" },
  Snow: { bg: "from-blue-100 to-indigo-300", icon: "❄️", animate: "animate-spin", sound: "/snow.mp3" },
  Thunderstorm: { bg: "from-purple-900 to-black", icon: "⛈️", animate: "animate-bounce", sound: "/thunder.wav" }
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const audioRef = useRef(null);
  const slides = Array.from({ length: 28 }, (_, i) => `/img/photo_${i + 1}.webp`);

  // 1. Triple Calendar logic with Full Year and Correct Islamic Date
  const getTripleDate = () => {
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return {
      jalali: new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(now),
      gregorian: new Intl.DateTimeFormat('en-US', options).format(now),
      islamic: new Intl.DateTimeFormat('fa-IR-u-ca-islamic-uma', options).format(now),
      weekday: new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(now),
    };
  };

  // 2. Local Time and Day/Night check for the city
  const getLocalTimeData = (timezoneOffset) => {
    const localDate = new Date(new Date().getTime() + timezoneOffset * 1000 + (new Date().getTimezoneOffset() * 60000));
    const hours = localDate.getHours();
    const isNight = hours < 6 || hours >= 19;
    return {
      timeString: localDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text: hours < 5 || hours >= 20 ? "شب خوش" : hours < 12 ? "صبح بخیر" : hours < 17 ? "بعد از ظهر بخیر" : "عصر بخیر",
      isNight
    };
  };

  // 3.AQI Graphics Logic
  const getAQIInfo = (aqi) => {
    const levels = {
      1: { label: "پاک", color: "bg-green-500", shadow: "shadow-green-500/50" },
      2: { label: "سالم", color: "bg-emerald-400", shadow: "shadow-emerald-400/50" },
      3: { label: "متوسط", color: "bg-yellow-400", shadow: "shadow-yellow-400/50" },
      4: { label: "ناسالم", color: "bg-orange-500", shadow: "shadow-orange-500/50" },
      5: { label: "خطرناک", color: "bg-red-600", shadow: "shadow-red-600/50" }
    };
    return levels[aqi] || levels[1];
  };

  useEffect(() => {
    if (!weather) {
      const interval = setInterval(() => {
        setCurrentSlideIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [weather]);

  const handleSearch = async () => {
    if (!city.trim()) return;
    const API_KEY = "d364c3561c0faef5f5376ed9641c3a1f";
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=fa`);
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
        // Fetch AQI
        const airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${API_KEY}`);
        const airData = await airRes.json();
        setAirQuality(airData.list[0].main.aqi);
        // Fetch Prayer Times
        const pRes = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${data.name}&country=&method=8`);
          const pData = await pRes.json();
            if (pData.code === 200) {
              setPrayerTimes(pData.data.timings);
                }
        // Fetch Forecast
        const fRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}&lang=fa`);
        const fData = await fRes.json();
        setForecast(fData.list.filter(item => item.dt_txt.includes("12:00:00")));

        // 4. Sound Handling
        const condition = data.weather[0].main;
        const soundFile = weatherConfig[condition]?.sound;
        if (soundFile) {
          if (audioRef.current) audioRef.current.pause();
          audioRef.current = new Audio(soundFile);
          audioRef.current.play().catch(e => console.log("Audio Play Blocked:", e));
        }
      } else { alert("شهر پیدا نشد!"); }
    } catch (e) { console.error("Search Error:", e); }
  };

  const date = getTripleDate();
  const timeData = weather ? getLocalTimeData(weather.timezone) : null;
  // 6. Day/Night Background Selection
  const theme = weather 
    ? (timeData.isNight ? weatherConfig.Night : weatherConfig[weather.weather[0].main] || weatherConfig.Clear)
    : { bg: "from-blue-900 to-black" };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-8 overflow-hidden font-sans text-white">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-slate-950">
        {weather ? (
          <div className={`w-full h-full bg-gradient-to-br ${theme.bg} transition-all duration-1000`}></div>
        ) : (
          slides.map((s, i) => (
            <div key={i} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === currentSlideIndex ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url(${s})` }}><div className="absolute inset-0 bg-black/40"></div></div>
          ))
        )}
      </div>

      <div className="z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 w-full max-w-7xl">
        
        {/* PANEL 1: Triple Calendar (Jalali, Gregorian, Islamic) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[35px] flex lg:flex-col items-center justify-center lg:w-56 w-full shadow-2xl">
          <div className="text-center w-full space-y-4">
            <h3 className="text-blue-300 font-black text-xl border-b border-white/10 pb-3">{date.weekday}</h3>
            <div className="bg-white/5 p-2 rounded-xl">
              <p className="text-[9px] opacity-40 uppercase font-bold">خورشیدی</p>
              <p className="text-md font-bold">{date.jalali}</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <p className="text-[9px] opacity-40 uppercase font-bold">میلادی</p>
              <p className="text-sm opacity-80">{date.gregorian}</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <p className="text-[9px] opacity-40 uppercase font-bold">قمری</p>
              <p className="text-sm opacity-60">{date.islamic}</p>
            </div>
          </div>
        </div>

       {/* PANEL 2: Main Weather Card */}
<div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 md:p-10 rounded-[45px] shadow-2xl flex-1 w-full max-w-md relative">
  
  {/* Weather Icon */}
  {weather && (
    <div className={`absolute -top-16 -right-8 text-8xl drop-shadow-2xl ${theme.animate}`}>
      {theme.icon}
    </div>
  )}
  
  {/* Search Box */}
  <div className="flex gap-2 mb-8 relative z-30">
    <input type="text" value={city} dir="auto" onChange={(e) => setCity(e.target.value)} placeholder="جستجوی شهر..." 
      className="flex-1 bg-black/30 border border-white/10 rounded-2xl px-5 py-3 outline-none text-sm" />
    <button onClick={handleSearch} className="bg-white text-blue-900 px-6 py-3 rounded-2xl font-black text-sm active:scale-95">GO</button>
  </div>

  {weather ? (
    <div className="text-center md:text-right">
      <div className="flex flex-col items-center md:items-end mb-6">
        <div className="text-xs font-bold uppercase tracking-widest bg-black/20 px-4 py-1 rounded-full mb-1">{timeData.text}</div>
        <div className="text-6xl font-black tracking-tighter">{timeData.timeString}</div>
      </div>

      {airQuality && (
        <div className="flex justify-center md:justify-end mb-6">
          <div className={`px-4 py-1 rounded-full text-[10px] font-black shadow-lg flex items-center gap-2 ${getAQIInfo(airQuality).color} ${getAQIInfo(airQuality).shadow}`}>
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
            کیفیت هوا: {getAQIInfo(airQuality).label}
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold opacity-90">{weather.name}</h2>
      <div className="text-8xl font-black my-2">{Math.round(weather.main.temp)}°</div>
      
      <div className="flex justify-center md:justify-end gap-4 text-[11px] opacity-60 mb-6">
        <div className="flex items-center gap-1">☀️ {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('fa-IR', {hour:'2-digit', minute:'2-digit'})}</div>
        <div className="flex items-center gap-1">🌙 {new Date(weather.sys.sunset * 1000).toLocaleTimeString('fa-IR', {hour:'2-digit', minute:'2-digit'})}</div>
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

      {/* --- اضافه شده: بخش اوقات شرعی --- */}
      {prayerTimes && (
        <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-3 gap-2">
          <div className="bg-white/5 p-2 rounded-xl">
            <p className="text-[8px] opacity-50 uppercase">اذان صبح</p>
            <p className="text-[12px] font-bold">{prayerTimes.Fajr}</p>
          </div>
          <div className="bg-white/5 p-2 rounded-xl">
            <p className="text-[8px] opacity-50 uppercase">اذان ظهر</p>
            <p className="text-[12px] font-bold">{prayerTimes.Dhuhr}</p>
          </div>
          <div className="bg-white/5 p-2 rounded-xl">
            <p className="text-[8px] opacity-50 uppercase">اذان مغرب</p>
            <p className="text-[12px] font-bold">{prayerTimes.Maghrib}</p>
          </div>
        </div>
      )}
     

    </div>
  ) : (
    <div className="py-24 text-center opacity-10 font-black text-3xl uppercase tracking-[10px]">Weather</div>
  )}
</div> 

        {/* PANEL 3: 5-Day Forecast */}
        {weather && forecast.length > 0 && (
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-7 rounded-[40px] w-full lg:w-72 shadow-2xl">
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[5px] mb-8 text-center">پیش‌بینی ۵ روزه</p>
            <div className="space-y-4">
              {forecast.map((day, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold opacity-80 w-12">
                    {new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(new Date(day.dt * 1000))}
                  </span>
                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} className="w-10 h-10" alt="icon" />
                  <span className="text-xl font-black">{Math.round(day.main.temp)}°</span>
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