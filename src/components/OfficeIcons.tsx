import React from 'react';

// Official-style Microsoft Word 3D Icon matching the reference screenshot
export const WordIcon: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="wordBg" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#185ABD" />
        <stop offset="100%" stopColor="#0B3E8C" />
      </linearGradient>
      <linearGradient id="wordLayer1" x1="30" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#41A5EE" />
        <stop offset="100%" stopColor="#1E65C9" />
      </linearGradient>
      <linearGradient id="wordLayer2" x1="30" y1="40" x2="85" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2B7CD3" />
        <stop offset="100%" stopColor="#104A9E" />
      </linearGradient>
      <filter id="tileShadow" x="5" y="15" width="55" height="55" filterUnits="userSpaceOnUse">
        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#061d47" floodOpacity="0.4" />
      </filter>
    </defs>
    
    {/* Base back cards / layers */}
    <rect x="26" y="16" width="54" height="66" rx="8" fill="url(#wordLayer1)" />
    <rect x="26" y="38" width="54" height="44" rx="8" fill="url(#wordLayer2)" />
    <path d="M26 50 H80 V74 C80 78.4 76.4 82 72 82 H34 C29.6 82 26 78.4 26 74 Z" fill="#104A9E" />

    {/* Front raised tile with W */}
    <g filter="url(#tileShadow)">
      <rect x="12" y="24" width="40" height="40" rx="8" fill="url(#wordBg)" />
      <text
        x="32"
        y="53"
        fill="#FFFFFF"
        fontFamily="'Segoe UI', 'Be Vietnam Pro', system-ui, sans-serif"
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
      >
        W
      </text>
    </g>
  </svg>
);

// Official-style Microsoft Excel 3D Icon matching the reference screenshot
export const ExcelIcon: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="excelBg" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#107C41" />
        <stop offset="100%" stopColor="#0B552C" />
      </linearGradient>
      <linearGradient id="excelLayer1" x1="30" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#33C481" />
        <stop offset="100%" stopColor="#107C41" />
      </linearGradient>
      <linearGradient id="excelLayer2" x1="30" y1="40" x2="85" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#18864B" />
        <stop offset="100%" stopColor="#0B552C" />
      </linearGradient>
      <filter id="excelTileShadow" x="5" y="15" width="55" height="55" filterUnits="userSpaceOnUse">
        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#032613" floodOpacity="0.4" />
      </filter>
    </defs>
    
    {/* Base back cards / grid layers */}
    <rect x="26" y="16" width="54" height="66" rx="8" fill="url(#excelLayer1)" />
    <rect x="26" y="38" width="54" height="44" rx="8" fill="url(#excelLayer2)" />
    <path d="M26 50 H80 V74 C80 78.4 76.4 82 72 82 H34 C29.6 82 26 78.4 26 74 Z" fill="#0E582F" />

    {/* Front raised tile with X */}
    <g filter="url(#excelTileShadow)">
      <rect x="12" y="24" width="40" height="40" rx="8" fill="url(#excelBg)" />
      <text
        x="32"
        y="53"
        fill="#FFFFFF"
        fontFamily="'Segoe UI', 'Be Vietnam Pro', system-ui, sans-serif"
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
      >
        X
      </text>
    </g>
  </svg>
);

// Official-style Microsoft PowerPoint 3D Icon matching the reference screenshot
export const PowerPointIcon: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="pptBg" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D83B01" />
        <stop offset="100%" stopColor="#A82800" />
      </linearGradient>
      <linearGradient id="pptLayer1" x1="30" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F7630C" />
        <stop offset="100%" stopColor="#D83B01" />
      </linearGradient>
      <linearGradient id="pptLayer2" x1="30" y1="40" x2="85" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EA4300" />
        <stop offset="100%" stopColor="#B22B00" />
      </linearGradient>
      <filter id="pptTileShadow" x="5" y="15" width="55" height="55" filterUnits="userSpaceOnUse">
        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#3d0e00" floodOpacity="0.4" />
      </filter>
    </defs>
    
    {/* Base pie chart / circular presentation discs */}
    <circle cx="58" cy="49" r="32" fill="url(#pptLayer1)" />
    <path d="M58 17 A32 32 0 0 1 90 49 L58 49 Z" fill="#F7630C" opacity="0.9" />
    <path d="M58 49 L90 49 A32 32 0 0 1 58 81 Z" fill="#C43E1C" />
    <path d="M58 49 L58 81 A32 32 0 0 1 26 49 Z" fill="#EA4300" />

    {/* Front raised tile with P */}
    <g filter="url(#pptTileShadow)">
      <rect x="12" y="24" width="40" height="40" rx="8" fill="url(#pptBg)" />
      <text
        x="32"
        y="53"
        fill="#FFFFFF"
        fontFamily="'Segoe UI', 'Be Vietnam Pro', system-ui, sans-serif"
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
      >
        P
      </text>
    </g>
  </svg>
);

// Official-style 3D Explore / Guide Icon matching Word, Excel, PowerPoint style
export const ExploreIcon: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="expBg" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#4C1D95" />
      </linearGradient>
      <linearGradient id="expLayer1" x1="30" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
      <linearGradient id="expLayer2" x1="30" y1="40" x2="85" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
      <filter id="expShadow" x="5" y="15" width="55" height="55" filterUnits="userSpaceOnUse">
        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#2e1065" floodOpacity="0.4" />
      </filter>
    </defs>
    
    {/* Base back cards / layers */}
    <rect x="26" y="16" width="54" height="66" rx="8" fill="url(#expLayer1)" />
    <rect x="26" y="38" width="54" height="44" rx="8" fill="url(#expLayer2)" />
    <path d="M26 50 H80 V74 C80 78.4 76.4 82 72 82 H34 C29.6 82 26 78.4 26 74 Z" fill="#5B21B6" />

    {/* Front raised tile with Compass / Search emblem */}
    <g filter="url(#expShadow)">
      <rect x="12" y="24" width="40" height="40" rx="8" fill="url(#expBg)" />
      {/* 3D Compass Star */}
      <circle cx="32" cy="44" r="11" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
      <polygon points="32,35 36,44 32,41" fill="#FDE047" />
      <polygon points="32,53 28,44 32,47" fill="#E2E8F0" />
      <polygon points="41,44 32,48 35,44" fill="#FDE047" />
      <polygon points="23,44 32,40 29,44" fill="#E2E8F0" />
      <circle cx="32" cy="44" r="2.5" fill="#FFFFFF" />
    </g>
  </svg>
);

// Golden Graduation Cap Icon matching the header brand logo
export const BrandCapIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Cap body */}
    <path
      d="M32 8L4 22L32 36L60 22L32 8Z"
      fill="#FDB813"
      stroke="#E5A100"
      strokeWidth="1.5"
    />
    <path
      d="M16 29.5V43C16 43 22 49 32 49C42 49 48 43 48 43V29.5L32 37.5L16 29.5Z"
      fill="#FDB813"
      stroke="#E5A100"
      strokeWidth="1.5"
    />
    {/* Tassel cord & knot */}
    <circle cx="32" cy="22" r="2.5" fill="#FFFFFF" />
    <path
      d="M32 22C32 22 20 23 15 28C14 29 13 32 13 36"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Tassel brush */}
    <rect x="11.5" y="36" width="3" height="7" rx="1.5" fill="#FFFFFF" />
  </svg>
);
