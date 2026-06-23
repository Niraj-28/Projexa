import React from 'react';
import Logo from './Logo';

const AuthShowcase = ({ heading = "Organize Sprints & Track Progress", description = "WorkArena helps teams manage sprint tasks, track real-time attendance, and complete projects successfully under a secure workspace." }) => {
  return (
    <div className="hidden lg:flex w-full h-full bg-[#01161E] rounded-[24px] relative overflow-hidden flex-col justify-between p-10 text-white select-none">
      {/* Custom SVG Fluid/Ribbon Gradient Waves */}
      <svg className="absolute inset-0 w-full h-full object-cover scale-110 opacity-80 z-0" viewBox="0 0 500 700" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ribbon1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#124559" />
            <stop offset="40%" stopColor="#598392" />
            <stop offset="80%" stopColor="#AEC3B0" />
            <stop offset="100%" stopColor="#124559" />
          </linearGradient>
          <linearGradient id="ribbon2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#AEC3B0" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#124559" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#01161E" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="30" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Ribbon Flow */}
        <path d="M-100 150 C 120 20 280 400 600 100 L 600 800 L -100 800 Z" fill="url(#ribbon1)" opacity="0.9" />
        <path d="M-100 300 C 150 150 320 580 600 400 L 600 800 L -100 800 Z" fill="url(#ribbon2)" opacity="0.75" />
        <path d="M-100 480 C 200 320 250 680 600 550 L 600 800 L -100 800 Z" fill="#01161E" opacity="0.95" />

        {/* Decorative Glow Elements */}
        <circle cx="150" cy="180" r="100" fill="#AEC3B0" opacity="0.2" filter="url(#glow)" />
        <circle cx="380" cy="520" r="140" fill="#124559" opacity="0.25" filter="url(#glow)" />
      </svg>

      {/* Wise Quote Divider (Top) */}
      <div className="relative z-10 flex items-center gap-3">
        <span className="text-[10px] font-bold text-[#AEC3B0]/80 tracking-[0.2em] uppercase font-sans">WORKARENA PLATFORM</span>
        <div className="h-[1px] bg-white/10 flex-grow"></div>
      </div>

      {/* Center Showcase Branding / Typography (Bottom) */}
      <div className="relative z-10 space-y-4">
        {/* High-contrast title color to ensure readability */}
        <h1 className="text-[38px] font-bold !text-#AEC3B0 tracking-tight leading-[1.12] font-heading" style={{ color: '#AEC3B0' }}>
          {heading}
        </h1>
        <p className="text-[13px] font-light text-[#AEC3B0] leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AuthShowcase;
