// components/common/Background.jsx
import React, { useEffect, useState } from 'react';

const Background = ({ weather, theme }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = Array.from({ length: 28 }, (_, i) => `/img/photo_${i + 1}.webp`);

  useEffect(() => {
    if (!weather) {
      const interval = setInterval(() => {
        setCurrentSlideIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [weather, slides.length]);

  return (
    <div className="fixed inset-0 z-0 bg-slate-950">
      {weather ? (
        <div 
          className={`w-full h-full bg-gradient-to-br ${theme.bg} transition-all duration-1000`}
        ></div>
      ) : (
        slides.map((s, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === currentSlideIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${s})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))
      )}
    </div>
  );
};

export default Background;