import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', iconOnly = false, className = '' }) => {
  const iconDimensions = {
    sm: { w: 26, h: 26 },
    md: { w: 34, h: 34 },
    lg: { w: 46, h: 46 }
  }[size];

  const titleSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-black'
  }[size];

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Vector Cyber Shield Emblem */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-xs"
      >
        <defs>
          <linearGradient id="shieldGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="rimGradReact" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="coreEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Outer Shield Plate */}
        <path
          d="M32 6 
             C44 6 52 10.5 52 22 
             C52 38 42.5 48.5 32 57 
             C21.5 48.5 12 38 12 22 
             C12 10.5 20 6 32 6 Z"
          fill="url(#shieldGradReact)"
          stroke="url(#rimGradReact)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner Inset Circuit Perimeter */}
        <path
          d="M32 12
             C41 12 46.5 15.5 46.5 23.5
             C46.5 35 38.5 44 32 50.5
             C25.5 44 17.5 35 17.5 23.5
             C17.5 15.5 23 12 32 12 Z"
          fill="#0B132B"
          stroke="#38BDF8"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />

        {/* Circuit Nodes */}
        <line x1="32" y1="14" x2="32" y2="23" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="14" r="1.5" fill="#BFDBFE" />

        <path d="M22 22 L27 26" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="22" cy="22" r="1.2" fill="#BFDBFE" />

        <path d="M42 22 L37 26" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="42" cy="22" r="1.2" fill="#BFDBFE" />

        <line x1="32" y1="37" x2="32" y2="46" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="46" r="1.5" fill="#BFDBFE" />

        {/* Central Quantum Nexus Core */}
        <polygon points="32,23 39,30 32,37 25,30" fill="url(#coreEmerald)" stroke="#A7F3D0" strokeWidth="1.2" />
        <circle cx="32" cy="30" r="3" fill="#FFFFFF" />
        <circle cx="32" cy="30" r="1.2" fill="#065F46" />
      </svg>

      {/* Brand Typography */}
      {!iconOnly && (
        <div className="leading-tight">
          <div className={`tracking-wider text-slate-100 flex items-center gap-1.5 ${titleSizes}`}>
            <span>AI GUARDIAN</span>
          </div>
          <p className={`font-mono text-slate-400 font-medium tracking-tight ${subSizes}`}>
            QUANTITATIVE RISK ENGINE
          </p>
        </div>
      )}
    </div>
  );
};
