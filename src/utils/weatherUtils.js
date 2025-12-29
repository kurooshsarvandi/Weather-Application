// utils/weatherUtils.js

// 3.AQI Graphics Logic
export const getAQIInfo = (aqi) => {
  const levels = {
    1: { label: "پاک", color: "bg-green-500", shadow: "shadow-green-500/50" },
    2: { label: "سالم", color: "bg-emerald-400", shadow: "shadow-emerald-400/50" },
    3: { label: "متوسط", color: "bg-yellow-400", shadow: "shadow-yellow-400/50" },
    4: { label: "ناسالم", color: "bg-orange-500", shadow: "shadow-orange-500/50" },
    5: { label: "خطرناک", color: "bg-red-600", shadow: "shadow-red-600/50" }
  };
  return levels[aqi] || levels[1];
};

// Helper function to get theme based on weather
export const getWeatherTheme = (weather, timeData, weatherConfig) => {
  if (!weather) return { bg: "from-blue-900 to-black" };
  
  if (timeData?.isNight) {
    return weatherConfig.Night;
  }
  
  const condition = weather.weather[0].main;
  return weatherConfig[condition] || weatherConfig.Clear;
};