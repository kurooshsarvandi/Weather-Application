// src/components/common/SearchBox.jsx
import React from 'react';

const SearchBox = ({ city, setCity, onSearch, isLoading = false }) => {
  return (
    <div className="flex gap-2 mb-8 relative z-30">
      <input 
        type="text" 
        value={city} 
        dir="auto" 
        onChange={(e) => setCity(e.target.value)} 
        placeholder="جستجوی شهر..." 
        className="flex-1 bg-black/30 border border-white/10 rounded-2xl px-5 py-3 outline-none text-sm disabled:opacity-50" 
        onKeyPress={(e) => e.key === 'Enter' && !isLoading && onSearch()}
        disabled={isLoading}
      />
      <button 
        onClick={onSearch} 
        disabled={isLoading}
        className="bg-white text-blue-900 px-6 py-3 rounded-2xl font-black text-sm active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            در حال جستجو...
          </>
        ) : 'GO'}
      </button>
    </div>
  );
};

export default SearchBox;