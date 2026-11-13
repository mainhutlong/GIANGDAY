import React from 'react';

export const BottomWaves: React.FC = () => {
  return (
    <div className="w-full overflow-hidden leading-none pointer-events-none mt-auto">
      <svg
        viewBox="0 0 1440 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-24 sm:h-32 md:h-40 block object-cover"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#BFDBFE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#DBEAFE" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Back softer wave */}
        <path
          d="M0,80 C320,160 540,20 880,90 C1140,140 1320,50 1440,70 L1440,180 L0,180 Z"
          fill="url(#waveGrad1)"
        />

        {/* Front layered wave */}
        <path
          d="M0,120 C360,50 640,150 1020,95 C1220,60 1360,110 1440,115 L1440,180 L0,180 Z"
          fill="url(#waveGrad2)"
        />
      </svg>
    </div>
  );
};
