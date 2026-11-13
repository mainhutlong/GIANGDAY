import React from 'react';

// Desktop PC Showcase using user-provided high-resolution transparent PC set image
const DesktopPCShowcase: React.FC = () => (
  <div className="relative group w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] flex flex-col items-center justify-center py-2">
    {/* Ambient radial glow */}
    <div className="absolute -inset-3 bg-gradient-to-tr from-blue-400/20 via-sky-300/30 to-indigo-400/20 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    {/* The PC Image - Transparent PNG with realistic drop-shadow */}
    <div className="relative z-10 w-full flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1.5">
      <img
        src="/assets/computer-pc.png"
        alt="Bộ máy vi tính thực hành tin học"
        className="w-full h-auto max-h-[270px] sm:max-h-[310px] object-contain select-none pointer-events-none drop-shadow-xl"
      />
    </div>

    {/* Soft realistic ground shadow under PC set */}
    <div className="w-[85%] h-4 -mt-2 bg-gradient-to-r from-transparent via-slate-400/35 to-transparent rounded-[100%] blur-[4px] pointer-events-none" />
  </div>
);

// Office Icons Showcase using user-provided transparent W, E, PPT image
const OfficeIconsShowcase: React.FC = () => (
  <div className="relative group w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] flex flex-col items-center justify-center py-2">
    {/* Soft ambient glow behind icons */}
    <div className="absolute -inset-3 bg-gradient-to-tr from-sky-300/30 via-emerald-200/30 to-orange-300/25 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    {/* The Office Icons Image - Transparent PNG with smooth hover animation */}
    <div className="relative z-10 w-full flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-105">
      <img
        src="/assets/office-icons.png"
        alt="Bộ ba Microsoft Word, Excel, PowerPoint"
        className="w-full h-auto max-h-[250px] sm:max-h-[280px] object-contain select-none pointer-events-none drop-shadow-xl"
      />
    </div>

    {/* Soft ground shadow underneath */}
    <div className="w-[75%] h-4 -mt-1 bg-gradient-to-r from-transparent via-slate-400/25 to-transparent rounded-[100%] blur-[4px] pointer-events-none" />
  </div>
);

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-8 sm:pt-10 pb-2 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 lg:gap-2">
          {/* Left: Desktop PC Showcase with user's uploaded image */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end order-2 lg:order-1">
            <DesktopPCShowcase />
          </div>

          {/* Center: Hero Headlines */}
          <div className="lg:col-span-4 text-center order-1 lg:order-2 px-2 py-4">
            {/* Line 1: Tin học */}
            <h1 className="text-[#0F284B] font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-3">
              Tin học
            </h1>

            {/* Line 3: Học tập • Ôn luyện • Kiểm tra • Nâng cao kỹ năng */}
            <p className="text-[#2C4A75] font-medium italic text-base sm:text-lg tracking-wide">
              Học tập &bull; Ôn luyện &bull; Kiểm tra &bull; Nâng cao kỹ năng
            </p>
          </div>

          {/* Right: Office W, E, PPT Showcase with user's uploaded image */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start order-3">
            <OfficeIconsShowcase />
          </div>
        </div>
      </div>
    </section>
  );
};
