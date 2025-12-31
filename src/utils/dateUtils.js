// src/utils/dateUtils.js

// ============================================================================
// SECTION 1: IMPORTS
// ============================================================================

// Import the Hijri (Islamic calendar) conversion library
// This library converts Gregorian dates to Hijri dates
import { toHijri } from 'hijri-converter';

// ============================================================================
// SECTION 2: TRIPLE CALENDAR FUNCTION
// ============================================================================

/**
 * Generates current date in three different calendar systems:
 * 1. Jalali (Persian/Solar) calendar
 * 2. Gregorian (Western) calendar  
 * 3. Hijri (Islamic/Lunar) calendar
 * 
 * This function demonstrates three different approaches to date handling:
 * - Intl.DateTimeFormat for Jalali/Gregorian (browser-native)
 * - External library for Hijri (more reliable than browser support)
 * 
 * @returns {Object} Object containing four date properties:
 *   - jalali: String - Persian date (e.g., "۸ دی ۱۴۰۴")
 *   - gregorian: String - Western date (e.g., "December 29, 2025")
 *   - islamic: String - Islamic date (e.g., "۲۳ جمادی‌الثانی ۱۴۴۷")
 *   - weekday: String - Persian day name (e.g., "دوشنبه")
 * 
 * @example
 * const dates = getTripleDate();
 * // Returns: {
 * //   jalali: "۸ دی ۱۴۰۴",
 * //   gregorian: "December 29, 2025", 
 * //   islamic: "۲۳ جمادی‌الثانی ۱۴۴۷",
 * //   weekday: "دوشنبه"
 * // }
 */
export const getTripleDate = () => {
  // Create a Date object representing the current moment
  const now = new Date();
  
  // Common formatting options for date display
  const options = { 
    day: 'numeric',     // Show day as number (e.g., 8)
    month: 'long',      // Show full month name (e.g., "دی")
    year: 'numeric'     // Show full year (e.g., 1404)
  };
  
  // --------------------------------------------------------------------------
  // 1. JALALI (PERSIAN/SOLAR) DATE
  // --------------------------------------------------------------------------
  // Uses browser's Internationalization API with Persian calendar
  const jalali = new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(now);
  
  // --------------------------------------------------------------------------
  // 2. GREGORIAN (WESTERN) DATE  
  // --------------------------------------------------------------------------
  // Uses browser's Internationalization API with Gregorian calendar
  const gregorian = new Intl.DateTimeFormat('en-US', options).format(now);
  
  // --------------------------------------------------------------------------
  // 3. HIJRI (ISLAMIC/LUNAR) DATE
  // --------------------------------------------------------------------------
  // Convert Gregorian date to Hijri using external library
  // Note: JavaScript Date months are 0-indexed (0=January, 11=December)
  const hijri = toHijri(
    now.getFullYear(),      // Current year (e.g., 2025)
    now.getMonth() + 1,     // Current month (add 1 to fix 0-index)
    now.getDate()           // Current day of month (1-31)
  );
  
  // Array of Hijri month names in Persian
  const hijriMonths = [
    'محرم',        // Muharram
    'صفر',         // Safar
    'ربیع‌الاول',  // Rabi' al-awwal
    'ربیع‌الثانی', // Rabi' al-thani
    'جمادی‌الاول', // Jumada al-awwal
    'جمادی‌الثانی', // Jumada al-thani
    'رجب',         // Rajab
    'شعبان',       // Sha'ban
    'رمضان',       // Ramadan
    'شوال',        // Shawwal
    'ذی‌قعده',     // Dhu al-Qi'dah
    'ذی‌حجه'       // Dhu al-Hijjah
  ];
  
  // Construct the formatted Islamic date string
  const islamic = `${hijri.hd} ${hijriMonths[hijri.hm - 1]} ${hijri.hy}`;
  
  // --------------------------------------------------------------------------
  // 4. WEEKDAY NAME
  // --------------------------------------------------------------------------
  // Get the Persian name for the current day of week
  const weekday = new Intl.DateTimeFormat('fa-IR', { 
    weekday: 'long'  // Full weekday name (e.g., "دوشنبه" not "2شنبه")
  }).format(now);

  // Return all four date representations as an object
  return {
    jalali,      // Persian solar date
    gregorian,   // Western date
    islamic,     // Islamic lunar date
    weekday      // Persian weekday name
  };
};

// ============================================================================
// SECTION 3: LOCAL TIME CALCULATION FUNCTION
// ============================================================================

/**
 * Calculates local time and greeting for a specific timezone
 * This is used to display the correct local time for any city worldwide
 * 
 * @param {number} timezoneOffset - Timezone offset in seconds from UTC
 *                                  Positive for east of UTC, negative for west
 * @returns {Object} Object containing time information:
 *   - timeString: String - Formatted 24-hour time (e.g., "15:45")
 *   - text: String - Context-appropriate greeting in Persian
 *   - isNight: Boolean - True if it's nighttime (6PM-6AM local time)
 * 
 * @example
 * // For Tehran (UTC+3:30 = 12600 seconds)
 * const timeData = getLocalTimeData(12600);
 * // Returns: {
 * //   timeString: "15:45",
 * //   text: "بعد از ظهر بخیر",
 * //   isNight: false
 * // }
 */
export const getLocalTimeData = (timezoneOffset) => {
  // Calculate the local time for the target city
  const localDate = new Date(
    // Current UTC time
    new Date().getTime() + 
    // Add the city's timezone offset (convert seconds to milliseconds)
    timezoneOffset * 1000 + 
    // Adjust for browser's local timezone (convert minutes to milliseconds)
    (new Date().getTimezoneOffset() * 60000)
  );
  
  // Extract the hour (0-23) from the calculated local time
  const hours = localDate.getHours();
  
  // Determine if it's nighttime (6PM to 6AM)
  const isNight = hours < 6 || hours >= 19;
  
  // Return the complete time information object
  return {
    // Format time as 24-hour string (e.g., "15:45" not "3:45 PM")
    timeString: localDate.toLocaleTimeString('en-US', { 
      hour: '2-digit',   // Two-digit hour (01-23)
      minute: '2-digit', // Two-digit minute (00-59)
      hour12: false      // Use 24-hour format, not 12-hour AM/PM
    }),
    
    // Persian greeting based on time of day
    text: hours < 5 || hours >= 20 ? "شب خوش" :        // Night (8PM-5AM)
          hours < 12 ? "صبح بخیر" :                    // Morning (5AM-12PM)
          hours < 17 ? "بعد از ظهر بخیر" : "عصر بخیر", // Afternoon/Evening
    
    // Flag indicating if it's nighttime for UI theming
    isNight
  };
};