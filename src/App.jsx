import React, { useState, useRef, useEffect } from 'react';

// 1. Configuration for Weather Themes, Quotes, and Audio
const weatherConfig = {
  Clear: {
    bg: "from-orange-400 to-yellow-600",
    quote: "Sun's out! Don't forget your sunglasses. 😎",
    sound: "/public/park child.wav"
  },
  Rain: {
    bg: "from-blue-700 to-slate-900",
    quote: "It's raining! Grab an umbrella. ☔",
    sound: "/public/mixkit-heavy.wav"
  },
  Thunderstorm: {
    bg: "from-purple-900 to-black",
    quote: "Thunder! Better stay indoors. ⚡",
    sound: "/public/thunder.wav"
  },
  Clouds: {
    bg: "from-gray-500 to-blue-900",
    quote: "A bit cloudy today, perfect for a coffee. ☕",
    sound: "/public/wind-blowing.wav" 
  },
  Snow: {
    bg: "from-blue-100 to-indigo-300",
    quote: "Snowing! Build a snowman. ☃️",
    sound: "/snow.mp3"
  },
  Mist: {
    bg: "from-teal-700 to-gray-700",
    quote: "Foggy weather, drive safely! 🌫️",
    sound: ""
  }
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  
  // Audio reference to manage playback and prevent overlaps
  const audioRef = useRef(null);

  // Slideshow state for initial screen
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = ["/img/photo_1.webp","/img/photo_2.webp","/img/photo_3.webp"
    ,"/img/photo_4.webp","/img/photo_5.webp","/img/photo_6.webp"
    ,"/img/photo_7.webp","/img/photo_8.webp","/img/photo_9.webp"
    ,"/img/photo_10.webp","/img/photo_11.webp","/img/photo_12.webp"
    ,"/img/photo_13.webp","/img/photo_14.webp","/img/photo_15.webp"
    ,"/img/photo_16.webp","/img/photo_17.webp","/img/photo_18.webp"
    ,"/img/photo_19.webp","/img/photo_20.webp","/img/photo_21.webp"
    ,"/img/photo_22.webp","/img/photo_23.webp","/img/photo_24.webp"
    ,"/img/photo_25.webp","/img/photo_26.webp","/img/photo_27.webp"
    ,"/img/photo_28.webp"]; 

  // Slideshow Logic: Rotate background every 5 seconds if no city is searched
 useEffect(() => {
  let interval;
  if (!weather) {
    interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => {
        // If we are at the last image, go back to the first one (0)
        // This prevents the "empty/gray" slide
        return prevIndex === slides.length - 1 ? 0 : prevIndex + 1;
      });
    }, 3000); // 5 seconds
  }
    return () => clearInterval(interval);
  }, [weather, slides.length]);

  // Audio Management Function
  const playWeatherSound = (status) => {
    const soundUrl = weatherConfig[status]?.sound;
    
    if (soundUrl) {
      // Stop and reset current audio before playing new one
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(soundUrl);
      audio.volume = 0.4;
      audioRef.current = audio;

      audio.play().catch(error => {
        console.warn("Audio playback blocked by browser", error);
      });
    }
  };

  // Weather Search Logic
  const handleSearch = async () => {
    if (!city.trim()) return;

    const API_KEY = "d364c3561c0faef5f5376ed9641c3a1f"; // <--- Replace with your API Key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
        playWeatherSound(data.weather[0].main);
      } else {
        alert("City not found!");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  // Determine current theme settings
  const currentTheme = weather && weatherConfig[weather.weather[0].main] 
    ? weatherConfig[weather.weather[0].main] 
    : { bg: "from-blue-500 to-indigo-800", quote: "Discover the world's weather 🌍" };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans text-white">
      
      {/* Background Layer: Slideshow or Dynamic Gradient */}
      <div className="absolute inset-0 transition-all duration-1000 z-0">
        {weather ? (
          <div className={`w-full h-full bg-gradient-to-br ${currentTheme.bg} transition-all duration-1000`}></div>
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center transition-all duration-1000 scale-110"
            style={{ backgroundImage: `url(${slides[currentSlideIndex]})` }}
          >
            {/* Dark overlay for better text readability during slideshow */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        )}
      </div>

      {/* Dynamic Quote Layer */}
      <div className="absolute top-6 left-0 w-full px-6 text-center md:top-10 md:left-10 md:text-left z-20">
        <p className="text-xl md:text-3xl font-black italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          {currentTheme.quote}
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white/10 backdrop-blur-2xl p-6 md:p-8 rounded-[40px] shadow-2xl w-full max-w-md border border-white/20 relative z-10 mt-16 md:mt-0">
        
        {/* Floating Weather Icon */}
        {weather && (
          <div className="absolute -top-12 -right-4 w-32 h-32 md:-top-16 md:-right-8 md:w-44 md:h-44 drop-shadow-2xl animate-pulse">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
              alt="weather icon"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight">Weather App</h1>

        {/* Search Bar */}
        <div className="flex gap-2 mb-10">
          <input 
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..." 
            className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-4 py-3 outline-none focus:bg-white/30 transition-all placeholder:text-white/60"
          />
          <button 
            onClick={handleSearch}
            className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-lg active:scale-95"
          >
            GO
          </button>
        </div>

        {/* Weather Results Display */}
        {weather ? (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-medium opacity-90">{weather.name}, {weather.sys.country}</h2>
            <div className="flex justify-center items-center my-4">
              <span className="text-7xl md:text-8xl font-black">{Math.round(weather.main.temp)}°</span>
              <span className="text-3xl md:text-4xl font-light mt-4">C</span>
            </div>
            <p className="text-xl capitalize tracking-widest font-light italic mb-8">
              {weather.weather[0].description}
            </p>

            {/* Weather Statistics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
                <p className="text-xs uppercase opacity-60 mb-1">Humidity</p>
                <p className="text-xl font-bold">{weather.main.humidity}%</p>
              </div>
              <div className="bg-black/20 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
                <p className="text-xs uppercase opacity-60 mb-1">Wind Speed</p>
                <p className="text-xl font-bold">{weather.wind.speed} <span className="text-xs">m/s</span></p>
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder while idle */
          <div className="text-center py-10 opacity-60">
            <p className="text-lg italic">Ready for a weather adventure?</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;