// src/components/common/PrayerTimes.jsx
import React from 'react';

// آیکون‌های متناسب با هر نماز
const prayerIcons = {
  Fajr: "🕌",        // اذان صبح
  Sunrise: "☀️",     // طلوع آفتاب
  Dhuhr: "🕋",       // اذان ظهر
  Asr: "📿",         // اذان عصر
  Maghrib: "🌙",     // اذان مغرب
  Isha: "⭐",        // اذان عشاء
  Imsak: "🤲",       // امساک
  Midnight: "🌃"     // نیمه شب
};

// ترتیب نمایش نمازها
const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const PrayerTimes = ({ prayerTimes }) => {
  if (!prayerTimes) return null;
  
  return (
    <div className="mt-5 pt-5 border-t border-white/10">
      <h4 className="text-sm font-bold opacity-70 mb-3 text-center">⏰ اوقات شرعی</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {prayerOrder.map(prayerName => {
          if (!prayerTimes[prayerName]) return null;
          
          return (
            <div 
              key={prayerName} 
              className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{prayerIcons[prayerName] || "🕰️"}</span>
                  <div>
                    <p className="text-[9px] opacity-50 uppercase">{getPrayerLabel(prayerName)}</p>
                    <p className="text-[13px] font-bold">{prayerTimes[prayerName]}</p>
                  </div>
                </div>
                <div className="text-[10px] opacity-40">
                  {getPrayerTimeInfo(prayerName)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// تابع برای نام فارسی نمازها
const getPrayerLabel = (englishName) => {
  const labels = {
    Fajr: "اذان صبح",
    Sunrise: "طلوع آفتاب",
    Dhuhr: "اذان ظهر",
    Asr: "اذان عصر",
    Maghrib: "اذان مغرب",
    Isha: "اذان عشاء",
    Imsak: "امساک",
    Midnight: "نیمه شب"
  };
  return labels[englishName] || englishName;
};

// تابع برای اطلاعات اضافی
const getPrayerTimeInfo = (prayerName) => {
  const info = {
    Fajr: "فجر",
    Sunrise: "شروق",
    Dhuhr: "ظهر",
    Asr: "عصر",
    Maghrib: "مغرب",
    Isha: "عشاء"
  };
  return info[prayerName] || "";
};

export default PrayerTimes;