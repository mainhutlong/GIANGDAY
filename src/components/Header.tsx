import React from 'react';
import { Home } from 'lucide-react';
import { BrandCapIcon } from './OfficeIcons';

interface HeaderProps {
  activeTab: 'home' | 'word' | 'excel' | 'powerpoint' | 'guide';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigateHome,
}) => {
  return (
    <header className="sticky top-0 z-40 select-none bg-[#0F284B] backdrop-blur-md border-b border-white/10 shadow-md">
      {/* Subtle top amber-gold highlight line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-[#FDB813] to-sky-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand: Giảng dạy CNTT */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="p-1.5 rounded-xl bg-white/10 border border-white/10 transition-transform duration-300 group-hover:scale-105">
            <BrandCapIcon className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-sm" />
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-blue-100 transition-colors">
            Giảng dạy CNTT
          </span>
        </button>

        {/* Right Nav: Only Trang chủ */}
        <nav className="flex items-center">
          <button
            onClick={onNavigateHome}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-blue-600/90 text-white shadow-sm border border-blue-400/40 ring-1 ring-blue-400/30'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Home className="w-4 h-4 text-white" />
            <span>Trang chủ</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
