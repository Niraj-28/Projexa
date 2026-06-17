import React from 'react';
import Logo from './Logo';
import { Layers3, Zap, Shield } from 'lucide-react';

const AuthShowcase = ({ heading, description }) => {
  return (
    <div className="hidden lg:flex lg:col-span-7 bg-[#131313] min-h-screen flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#B5B5B5]/[0.04] blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#F3F3F3]/[0.03] blur-[80px] pointer-events-none"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 linear-grid-bg opacity-15 pointer-events-none"></div>

      {/* Decorative line accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#3C3C3C] to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-t from-transparent via-[#3C3C3C] to-transparent"></div>

      {/* Center content */}
      <div className="relative z-10 text-center max-w-lg px-12 space-y-8">

        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Logo />
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-medium tracking-tight leading-[1.1] text-white font-heading">
            {heading}
          </h1>
          <p className="text-sm text-[#B5B5B5] font-light leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#3C3C3C] bg-[#1C1C1C]/50">
            <Layers3 className="h-3.5 w-3.5 text-[#B5B5B5]" />
            <span className="text-[11px] text-[#B5B5B5] font-medium">Projects</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#3C3C3C] bg-[#1C1C1C]/50">
            <Zap className="h-3.5 w-3.5 text-[#B5B5B5]" />
            <span className="text-[11px] text-[#B5B5B5] font-medium">Sprints</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#3C3C3C] bg-[#1C1C1C]/50">
            <Shield className="h-3.5 w-3.5 text-[#B5B5B5]" />
            <span className="text-[11px] text-[#B5B5B5] font-medium">Secure</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthShowcase;
