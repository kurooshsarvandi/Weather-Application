# 🌤️ Modern Weather Dashboard with Islamic Prayer Times

**Live Demo:** [https://kuroosh-weather.vercel.app/](https://kuroosh-weather.vercel.app/) • **Source Code:** [GitHub Repository](https://github.com/kurooshsarvandi/Weather-Application)

A beautifully designed, feature-rich weather application built with React, Vite, and Tailwind CSS that provides comprehensive weather information alongside Islamic prayer times for any city worldwide.

## ✨ Key Features

### 🌍 **Multi-Source Weather Intelligence**
- **Real-time Weather Data** from OpenWeatherMap API
- **5-Day Forecast** with intuitive visual predictions
- **Air Quality Index (AQI)** monitoring with color-coded alerts
- **Dynamic Backgrounds** that change based on weather conditions and time of day

### 🕌 **Integrated Islamic Features**
- **Accurate Prayer Times** for any city using Aladhan API
- **Triple Calendar Display** (Jalali/Solar, Gregorian, Hijri/Lunar)
- **Persian Language Support** throughout the interface
- **Cultural Time Greetings** ("صبح بخیر", "عصر بخیر", etc.)

### 🎨 **Immersive User Experience**
- **Weather-Responsive Audio** (rain sounds, thunder, wind, etc.)
- **Time-Aware UI Themes** (day/night mode auto-switching)
- **Responsive Design** that works flawlessly on all devices
- **Smooth Animations** and transitions for all interactions

## 🛠️ Technical Architecture

### **Frontend Stack**
- **React 18** with Hooks for state management
- **Vite** for lightning-fast development and builds
- **Tailwind CSS v4** for utility-first styling
- **React Icons** for consistent iconography

### **API Integration Layer**
- **Modular API Architecture** with clean separation of concerns
- **Custom API Client** with centralized error handling
- **CORS Proxy Configuration** for seamless external API calls
- **Environment Variable Security** for API key protection

### **Smart Features**
- **Parallel API Requests** for optimal performance
- **Local Timezone Calculations** for accurate global time display
- **Conditional Audio Playback** based on weather conditions
- **Loading States & Error Boundaries** for robust UX

## 📱 Core Components

### **Main Dashboard**
- **Search Panel** with auto-complete and validation
- **Primary Weather Display** (temperature, conditions, humidity, wind)
- **Triple Calendar Panel** (Jalali/Gregorian/Hijri)
- **5-Day Forecast** with visual weather icons

### **Specialized Modules**
- **Air Quality Monitor** with health recommendations
- **Prayer Times Display** with Islamic month names
- **Time Context Greeter** (changes based on time of day)
- **Custom Footer** with developer social links

## 🚀 Deployment & Performance

- **Vercel Hosted** at [kuroosh-weather.vercel.app](https://kuroosh-weather.vercel.app/)
- **Optimized Bundle Size** through Vite's tree-shaking
- **Lazy Loading** for non-critical components
- **Automatic CI/CD** from GitHub repository

## 🌐 API Services Utilized

| Service | Purpose | Features |
|---------|---------|----------|
| **OpenWeatherMap** | Weather Data | Current weather, 5-day forecast, AQI, timezone data |
| **Aladhan** | Prayer Times | Accurate Hijri dates, prayer timings worldwide |
| **Browser Intl API** | Date Formatting | Localized date displays in multiple calendars |

## 🎯 Unique Selling Points

1. **Cultural Integration** - Seamlessly blends modern weather tech with Islamic features
2. **Multi-Calendar Support** - One of few apps displaying Jalali, Gregorian, AND Hijri dates
3. **Sensory Experience** - Combines visual, auditory, and contextual weather information
4. **Developer Focused** - Clean codebase following best practices and modular architecture

## 📊 Technical Highlights

- **Modular Component Structure** for easy maintenance
- **Custom Hooks & Utilities** for reusable logic
- **Responsive Breakpoints** optimized for mobile/tablet/desktop
- **Accessibility Considerations** with proper ARIA labels
- **Performance Optimized** with memoization and efficient re-renders

