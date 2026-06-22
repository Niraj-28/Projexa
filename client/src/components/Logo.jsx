import React from 'react';

const Logo = ({ className = "", light = false }) => {
  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Dynamic connected nodes W logo matching WorkArea brand identity */}
      <svg className="h-6 w-6 shrink-0" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <filter id="logo-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-1.2" dy="1.8" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.75"/>
        </filter>
        <linearGradient id="logo-grad" x1="6" y1="10" x2="58" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3F3F3" />
          <stop offset="1" stopColor="#A3A3A3" />
        </linearGradient>

        {/* Arch line connecting the nodes */}
        <path d="M 9,21 A 23,23 0 0,1 55,21" stroke="url(#logo-grad)" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="1.5 1.5" />

        {/* Vertical connector lines */}
        <line x1="9" y1="21" x2="9" y2="29" stroke="url(#logo-grad)" strokeWidth="1.5" opacity="0.3" />
        <line x1="32" y1="13" x2="32" y2="29" stroke="url(#logo-grad)" strokeWidth="1.5" opacity="0.3" />
        <line x1="55" y1="21" x2="55" y2="29" stroke="url(#logo-grad)" strokeWidth="1.5" opacity="0.3" />

        {/* Rounded square node connectors */}
        <rect x="6.5" y="18.5" width="5" height="5" rx="1.5" fill="url(#logo-grad)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="29.5" y="10.5" width="5" height="5" rx="1.5" fill="url(#logo-grad)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <rect x="52.5" y="18.5" width="5" height="5" rx="1.5" fill="url(#logo-grad)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

        {/* Slanted overlapping polygon ribbon pieces of the letter W */}
        <path 
          d="M 6,30 L 13,29 L 23,47 L 16,48 Z" 
          fill="url(#logo-grad)" 
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />
        <path 
          d="M 29,31 L 36,30 L 46,48 L 39,49 Z" 
          fill="url(#logo-grad)" 
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />
        <path 
          d="M 14,48 L 21,49 L 32,31 L 25,30 Z" 
          fill="url(#logo-grad)" 
          filter="url(#logo-shadow)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />
        <path 
          d="M 42,47 L 49,46 L 58,28 L 51,27 Z" 
          fill="url(#logo-grad)" 
          filter="url(#logo-shadow)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />
      </svg>
      <span className={`font-semibold text-lg tracking-tight font-heading ${light ? 'text-white' : 'text-text-primary'}`}>WorkArea</span>
    </div>
  );
};

export default Logo;
