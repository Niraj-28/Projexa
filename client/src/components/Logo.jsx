import React from 'react';
import logoImg from '../assets/logo/Logo.png';

const Logo = ({ className = "", light = false, ...props }) => {
  return (
    <div className={`flex items-center select-none ${className}`} {...props}>
      <img 
        src={logoImg} 
        alt="WorkArena" 
        className="h-8 w-auto object-contain max-h-full mix-blend-multiply"
      />
    </div>
  );
};

export default Logo;

