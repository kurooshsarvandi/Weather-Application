// constants/weatherConfig.js
export const weatherConfig = {
  Clear: { 
    bg: "from-orange-400 to-yellow-600", 
    icon: "☀️", 
    animate: "animate-spin-slow", 
    sound: "/park child.wav" 
  },
  Night: { 
    bg: "from-slate-900 to-indigo-950", 
    icon: "🌙", 
    animate: "animate-pulse", 
    sound: "/park child.wav" 
  },
  Rain: { 
    bg: "from-blue-700 to-slate-900", 
    icon: "🌧️", 
    animate: "animate-bounce", 
    sound: "/mixkit-heavy.wav" 
  },
  Clouds: { 
    bg: "from-gray-500 to-blue-900", 
    icon: "☁️", 
    animate: "animate-pulse", 
    sound: "/wind-blowing.wav" 
  },
  Snow: { 
    bg: "from-blue-100 to-indigo-300", 
    icon: "❄️", 
    animate: "animate-spin", 
    sound: "/snow.mp3" 
  },
  Thunderstorm: { 
    bg: "from-purple-900 to-black", 
    icon: "⛈️", 
    animate: "animate-bounce", 
    sound: "/thunder.wav" 
  }
};