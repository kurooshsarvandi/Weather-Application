// src/utils/dateUtils.js
import { toHijri } from 'hijri-converter';

export const getTripleDate = () => {
  const now = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  
  // 1. تاریخ شمسی
  const jalali = new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(now);
  
  // 2. تاریخ میلادی
  const gregorian = new Intl.DateTimeFormat('en-US', options).format(now);
  
  // 3. تاریخ قمری با کتابخانه جدید
  const hijri = toHijri(
    now.getFullYear(),
    now.getMonth() + 1, // ماه در جاوااسکریپت از 0 شروع می‌شود
    now.getDate()
  );
  
  // نام‌های ماه‌های قمری به فارسی
  const hijriMonths = [
    'محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی',
    'جمادی‌الاول', 'جمادی‌الثانی', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذی‌قعده', 'ذی‌حجه'
  ];
  
  const islamic = `${hijri.hd} ${hijriMonths[hijri.hm - 1]} ${hijri.hy}`;
  
  // 4. نام روز هفته
  const weekday = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(now);

  return {
    jalali,      // مثال: "۸ دی ۱۴۰۴"
    gregorian,   // مثال: "December 29, 2025"
    islamic,     // مثال: "۲۳ جمادی‌الثانی ۱۴۴۷"
    weekday      // مثال: "دوشنبه"
  };
};

// تابع زمان محلی بدون تغییر
export const getLocalTimeData = (timezoneOffset) => {
  const localDate = new Date(
    new Date().getTime() + 
    timezoneOffset * 1000 + 
    (new Date().getTimezoneOffset() * 60000)
  );
  const hours = localDate.getHours();
  const isNight = hours < 6 || hours >= 19;
  
  return {
    timeString: localDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    text: hours < 5 || hours >= 20 ? "شب خوش" : 
          hours < 12 ? "صبح بخیر" : 
          hours < 17 ? "بعد از ظهر بخیر" : "عصر بخیر",
    isNight
  };
};