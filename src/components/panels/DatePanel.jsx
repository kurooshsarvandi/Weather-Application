// components/panels/DatePanel.jsx
import React from 'react';
import { getTripleDate } from '../../utils/dateUtils';

const DatePanel = () => {
  const date = getTripleDate();
  
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[35px] flex lg:flex-col items-center justify-center lg:w-56 w-full shadow-2xl">
      <div className="text-center w-full space-y-4">
        <h3 className="text-blue-300 font-black text-xl border-b border-white/10 pb-3">
          {date.weekday}
        </h3>
        
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
  );
};

export default DatePanel;