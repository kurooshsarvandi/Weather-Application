import React from "react";
import { 
  FaXTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, 
  FaGithub, FaGlobe, FaHeart, FaCode 
} from "react-icons/fa6";

export default function CustomFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative w-full bg-gradient-to-b from-gray-900 to-gray-950 border-t border-cyan-900/30 py-10 px-4 overflow-hidden">
      
      {/* افکت پس‌زمینه */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/5 via-transparent to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto flex flex-col items-center gap-8 z-10">
        
        {/* کپی‌رایت با استایل ویژه */}
        <div className="text-center">
          <div className="text-sm md:text-base text-gray-300 mb-1">
            © {currentYear} Weather App — Crafted with Precision
          </div>
          <div className="text-xs md:text-sm text-gray-500">
            Developed by <span className="text-cyan-300 font-semibold">Kuroosh Sarvandi</span>
          </div>
        </div>
        
        {/* آیکون‌ها با افکت hover */}
        <div className="flex justify-center items-center gap-3 md:gap-5">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-400 hover:text-white transition-all duration-500 hover:border-cyan-500/50 hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              aria-label={link.label}
            >
              <link.icon className="text-xl group-hover:scale-110 transition-transform duration-300" />
              {/* ابزارک توضیح */}
              <span className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs py-1 px-2 rounded transition-opacity duration-300 whitespace-nowrap">
                {link.label}
              </span>
            </a>
          ))}
        </div>
        
        {/* بخش پایانی */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FaCode className="text-cyan-400" />
            <span>Built with React + Vite + Tailwind</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <FaHeart className="text-red-400" />
            <span>Made with passion in Iran</span>
          </div>
        </div>
        
      </div>
      
      {/* خط پایین */}
      <div className="mt-8 pt-6 border-t border-gray-800/50 text-center text-xs text-gray-600">
        v1.0.0 • Data provided by OpenWeatherMap & Aladhan API
      </div>
    </footer>
  );
}

// داده‌های آیکون‌ها (همان بالا)
const socialLinks = [
  { 
    icon: FaXTwitter, 
    url: "https://x.com/kuroosh", 
    label: "Twitter/X Profile" 
  },
  { 
    icon: FaFacebookF, 
    url: "https://facebook.com/kuroosh", 
    label: "Facebook Profile" 
  },
  { 
    icon: FaInstagram, 
    url: "https://www.instagram.com/kuroosh.sarvandi7/", 
    label: "Instagram Profile" 
  },
  { 
    icon: FaLinkedinIn, 
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7396857386906578945/", 
    label: "LinkedIn Profile" 
  },
  { 
    icon: FaGithub, 
    url: "https://github.com/kurooshsarvandi", 
    label: "GitHub Profile" 
  },
  { 
    icon: FaGlobe, 
    url: "https://kuroosh.dev", 
    label: "Personal Website" 
  },
];