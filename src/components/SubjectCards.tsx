import React from 'react';
import { WordIcon, ExcelIcon, PowerPointIcon, ExploreIcon } from './OfficeIcons';
import { CalendarCheck, ChevronRight } from 'lucide-react';

interface SubjectCardsProps {
  onSelectSubject: (subject: 'word' | 'excel' | 'powerpoint' | 'guide') => void;
  onOpenGuide: () => void;
  onOpenAttendance: () => void;
}

export const SubjectCards: React.FC<SubjectCardsProps> = ({
  onSelectSubject,
  onOpenGuide,
  onOpenAttendance,
}) => {
  return (
    <section className="relative z-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 4 Cards: Word, Excel, PowerPoint, Tìm hiểu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 xl:gap-6">
        {/* ===================== CARD 1: WORD ===================== */}
        <button
          type="button"
          onClick={() => onSelectSubject('word')}
          className="group relative overflow-hidden bg-gradient-to-b from-white via-[#F7FAFD] to-[#E3F0FC] border border-[#BFDBFE] rounded-3xl p-4 sm:p-5 xl:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <div className="absolute -bottom-4 left-0 right-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
            <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60 C120 100 240 20 400 60 V120 H0 Z" fill="#93C5FD" />
              <path d="M0 80 C150 40 260 110 400 70 V120 H0 Z" fill="#BFDBFE" opacity="0.7" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 xl:gap-4 py-1.5 sm:py-2">
            <div className="shrink-0 transition-transform duration-300 group-hover:scale-105">
              <WordIcon className="w-14 h-14 sm:w-16 sm:h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 drop-shadow-md" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#0D62D9] font-extrabold text-xl sm:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl tracking-tight uppercase leading-none whitespace-nowrap">
                WORD
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 font-normal leading-snug">
                Tin học &ndash;
              </p>
              <p className="text-slate-800 text-xs sm:text-sm font-bold leading-snug">
                Soạn thảo văn bản
              </p>
            </div>
          </div>
        </button>

        {/* ===================== CARD 2: EXCEL ===================== */}
        <button
          type="button"
          onClick={() => onSelectSubject('excel')}
          className="group relative overflow-hidden bg-gradient-to-b from-white via-[#F5FCF8] to-[#DEF4E8] border border-[#A7F3D0] rounded-3xl p-4 sm:p-5 xl:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <div className="absolute -bottom-4 left-0 right-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
            <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60 C120 100 240 20 400 60 V120 H0 Z" fill="#86EFAC" />
              <path d="M0 80 C150 40 260 110 400 70 V120 H0 Z" fill="#BBF7D0" opacity="0.7" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 xl:gap-4 py-1.5 sm:py-2">
            <div className="shrink-0 transition-transform duration-300 group-hover:scale-105">
              <ExcelIcon className="w-14 h-14 sm:w-16 sm:h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 drop-shadow-md" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#107C41] font-extrabold text-xl sm:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl tracking-tight uppercase leading-none whitespace-nowrap">
                EXCEL
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 font-normal leading-snug">
                Tin học &ndash;
              </p>
              <p className="text-slate-800 text-xs sm:text-sm font-bold leading-snug">
                Bảng tính điện tử
              </p>
            </div>
          </div>
        </button>

        {/* ===================== CARD 3: POWERPOINT ===================== */}
        <button
          type="button"
          onClick={() => onSelectSubject('powerpoint')}
          className="group relative overflow-hidden bg-gradient-to-b from-white via-[#FFF7F4] to-[#FCE6DD] border border-[#FED7AA] rounded-3xl p-4 sm:p-5 xl:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <div className="absolute -bottom-4 left-0 right-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
            <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60 C120 100 240 20 400 60 V120 H0 Z" fill="#FDBA74" />
              <path d="M0 80 C150 40 260 110 400 70 V120 H0 Z" fill="#FFEDD5" opacity="0.7" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 xl:gap-4 py-1.5 sm:py-2">
            <div className="shrink-0 transition-transform duration-300 group-hover:scale-105">
              <PowerPointIcon className="w-14 h-14 sm:w-16 sm:h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 drop-shadow-md" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#D83B01] font-extrabold text-lg sm:text-xl lg:text-[15px] xl:text-[18px] 2xl:text-2xl tracking-tight uppercase leading-none whitespace-nowrap">
                POWERPOINT
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 font-normal leading-snug">
                Tin học &ndash;
              </p>
              <p className="text-slate-800 text-xs sm:text-sm font-bold leading-snug">
                Trình chiếu
              </p>
            </div>
          </div>
        </button>

        {/* ===================== CARD 4: TÌM HIỂU ===================== */}
        <button
          type="button"
          onClick={onOpenGuide}
          className="group relative overflow-hidden bg-gradient-to-b from-white via-[#FBF8FF] to-[#EDE7FB] border border-[#DDD6FE] rounded-3xl p-4 sm:p-5 xl:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <div className="absolute -bottom-4 left-0 right-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
            <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path d="M0 60 C120 100 240 20 400 60 V120 H0 Z" fill="#C4B5FD" />
              <path d="M0 80 C150 40 260 110 400 70 V120 H0 Z" fill="#DDD6FE" opacity="0.7" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center gap-3 sm:gap-3.5 xl:gap-4 py-1.5 sm:py-2">
            <div className="shrink-0 transition-transform duration-300 group-hover:scale-105">
              <ExploreIcon className="w-14 h-14 sm:w-16 sm:h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 drop-shadow-md" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#6D28D9] font-extrabold text-lg sm:text-xl lg:text-[16px] xl:text-xl 2xl:text-2xl tracking-tight uppercase leading-none whitespace-nowrap">
                TÌM HIỂU
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 font-normal leading-snug">
                Tin học &ndash;
              </p>
              <p className="text-slate-800 text-xs sm:text-sm font-bold leading-snug">
                Cẩm nang &amp; Hướng dẫn
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* ===================== NÚT DƯỚI: ĐIỂM DANH (1 DÒNG GỌN GÀNG) ===================== */}
      <div className="mt-5 flex justify-center">
        <button
          onClick={onOpenAttendance}
          className="group inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/85 hover:bg-white text-slate-700 hover:text-blue-700 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm font-semibold backdrop-blur-sm cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          <span>Điểm danh</span>
          <span className="text-slate-300 font-normal">&bull;</span>
          <span className="text-slate-500 font-normal text-xs">Quản lý lớp &amp; Import Excel</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </section>
  );
};
