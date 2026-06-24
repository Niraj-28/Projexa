import React from 'react';
import Logo from './Logo';

const AuthShowcase = ({ heading = "Organize Sprints & Track Progress", description = "WorkArena helps teams manage sprint tasks, track real-time attendance, and complete projects successfully under a secure workspace." }) => {
  return (
    <div className="hidden lg:flex w-full h-full bg-[#111111] rounded-[24px] relative overflow-hidden flex-col justify-between p-10 text-white select-none">
      {/* Minimal geometric background */}
      <svg className="absolute inset-0 w-full h-full object-cover opacity-30 z-0" viewBox="0 0 500 700" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ribbon1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#888888" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#333333" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="ribbon2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#999999" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#444444" stopOpacity="0.15" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="30" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Subtle flowing shapes */}
        <path d="M-100 150 C 120 20 280 400 600 100 L 600 800 L -100 800 Z" fill="url(#ribbon1)" opacity="0.9" />
        <path d="M-100 300 C 150 150 320 580 600 400 L 600 800 L -100 800 Z" fill="url(#ribbon2)" opacity="0.75" />
        <path d="M-100 480 C 200 320 250 680 600 550 L 600 800 L -100 800 Z" fill="#000000" opacity="0.6" />

        {/* Soft light orbs */}
        <circle cx="150" cy="180" r="100" fill="#ffffff" opacity="0.04" filter="url(#glow)" />
        <circle cx="380" cy="520" r="140" fill="#ffffff" opacity="0.03" filter="url(#glow)" />
      </svg>

      {/* Top label */}
      <div className="relative z-10 flex items-center gap-3">
        <span className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase font-sans">WORKARENA PLATFORM</span>
        <div className="h-[1px] bg-white/10 flex-grow"></div>
      </div>

      {/* Bottom heading */}
      <div className="relative z-10 space-y-4">
        <h1 className="text-[38px] font-bold !text-white tracking-tight leading-[1.12] font-heading" style={{ color: '#FFFFFF' }}>
          {heading}
        </h1>
        <p className="text-[13px] font-light text-white/70 leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AuthShowcase;
