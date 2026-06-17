import React from 'react';

const Logo = ({ className = "", light = false }) => {
  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Stylized vector geometric 'P' icon */}
      <svg className="h-6 w-6 text-brand-primary shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M6 4h12a10 10 0 0 1 0 20H12v8H6V4zm6 6v8h6a4 4 0 0 0 0-8h-6z" 
          fillRule="evenodd" 
          clipRule="evenodd"
          fill="url(#logo-grad-comp)" 
        />
        {/* Right-pointing arrow triangle overlap */}
        <path d="M6 9l8.5 8.5L6 26V9z" fill="#ffffff" opacity="0.18" />
        <defs>
          <linearGradient id="logo-grad-comp" x1="6" y1="4" x2="28" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F3F3F3" />
            <stop offset="1" stopColor="#B5B5B5" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`font-semibold text-lg tracking-tight font-heading ${light ? 'text-white' : 'text-text-primary'}`}>Projexa</span>
    </div>
  );
};

export default Logo;
