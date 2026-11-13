import React from 'react';

// Crisp custom SVG icons matching the exact style of the reference image
const LectureIcon: React.FC = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
    <path
      d="M8 12C8 9.79086 9.79086 8 12 8H22C23.1046 8 24 8.89543 24 10V36C24 37.1046 23.1046 38 22 38H12C9.79086 38 8 36.2091 8 34V12Z"
      fill="#0D62D9"
    />
    <path
      d="M40 12C40 9.79086 38.2091 8 36 8H26C24.8954 8 24 8.89543 24 10V36C24 37.1046 24.8954 38 26 38H36C38.2091 38 40 36.2091 40 34V12Z"
      fill="#2563EB"
    />
    <path d="M12 14H20M12 20H20M12 26H18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 14H36M28 20H36M28 26H34" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    {/* Page spine curve */}
    <path d="M8 34C14 33 20 35 24 37C28 35 34 33 40 34" stroke="#0B3E8C" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ExerciseIcon: React.FC = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
    {/* Clipboard base */}
    <rect x="10" y="8" width="28" height="34" rx="5" fill="#107C41" />
    {/* Clip top */}
    <rect x="17" y="5" width="14" height="6" rx="2" fill="#34D399" />
    <circle cx="24" cy="8" r="1.5" fill="#064E3B" />
    {/* Document sheet */}
    <rect x="14" y="14" width="20" height="23" rx="2" fill="#FFFFFF" />
    {/* Lines */}
    <line x1="17" y1="19" x2="31" y2="19" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="24" x2="31" y2="24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="29" x2="25" y2="29" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    {/* Green checkmark badge */}
    <circle cx="31" cy="31" r="6" fill="#10B981" />
    <path d="M28.5 31L30.5 33L34 29" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExamIcon: React.FC = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
    {/* Monitor screen */}
    <rect x="8" y="10" width="32" height="23" rx="4" fill="#7C3AED" />
    {/* Inner screen */}
    <rect x="11" y="13" width="26" height="17" rx="2" fill="#EDE9FE" />
    {/* Checkmark inside screen */}
    <path d="M19 21.5L23 25.5L29 18.5" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Monitor stand */}
    <path d="M22 33H26V37H22V33Z" fill="#6D28D9" />
    <path d="M16 37H32" stroke="#6D28D9" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const GameIcon: React.FC = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
    {/* Gamepad body */}
    <path
      d="M12 16C8 16 6 22 7 30C7.7 35.6 12 37 15 34L19 29H29L33 34C36 37 40.3 35.6 41 30C42 22 40 16 36 16H12Z"
      fill="#F59E0B"
    />
    {/* D-Pad on left */}
    <path d="M13 22H17M15 20V24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    {/* Action buttons on right */}
    <circle cx="31" cy="21" r="1.5" fill="#FFFFFF" />
    <circle cx="34" cy="23.5" r="1.5" fill="#FFFFFF" />
    <circle cx="31" cy="26" r="1.5" fill="#FFFFFF" />
    <circle cx="28" cy="23.5" r="1.5" fill="#FFFFFF" />
  </svg>
);

const ProgressIcon: React.FC = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
    {/* Bars */}
    <rect x="8" y="28" width="6" height="12" rx="1.5" fill="#0284C7" />
    <rect x="18" y="20" width="6" height="20" rx="1.5" fill="#0284C7" />
    <rect x="28" y="14" width="6" height="26" rx="1.5" fill="#0284C7" />
    <rect x="38" y="8" width="6" height="32" rx="1.5" fill="#0284C7" />
    {/* Rising arrow */}
    <path
      d="M11 24L21 16L31 11L42 5"
      stroke="#38BDF8"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M37 5H42V10" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface FeatureBarProps {
  onOpenLectures: () => void;
  onOpenExercises: () => void;
  onOpenMockExam: () => void;
  onOpenGames: () => void;
  onOpenProgress: () => void;
}

export const FeatureBar: React.FC<FeatureBarProps> = ({
  onOpenLectures,
  onOpenExercises,
  onOpenMockExam,
  onOpenGames,
  onOpenProgress,
}) => {
  return (
    <section className="relative z-10 py-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 px-3 sm:px-6 py-3.5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-0 lg:divide-x lg:divide-slate-200">
          {/* Feature 1: Bài giảng phong phú */}
          <button
            onClick={onOpenLectures}
            className="flex items-center gap-3 p-2.5 lg:px-4 rounded-xl hover:bg-blue-50/60 transition-colors text-left group focus:outline-none"
          >
            <div className="transition-transform group-hover:scale-105">
              <LectureIcon />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-blue-700 transition-colors">
                Bài giảng
              </p>
              <p className="text-slate-500 text-xs sm:text-sm leading-tight mt-0.5">
                phong phú
              </p>
            </div>
          </button>

          {/* Feature 2: Bài tập thực hành đa dạng */}
          <button
            onClick={onOpenExercises}
            className="flex items-center gap-3 p-2.5 lg:px-4 rounded-xl hover:bg-emerald-50/60 transition-colors text-left group focus:outline-none"
          >
            <div className="transition-transform group-hover:scale-105">
              <ExerciseIcon />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-emerald-700 transition-colors">
                Bài tập thực hành
              </p>
              <p className="text-slate-500 text-xs sm:text-sm leading-tight mt-0.5">
                đa dạng
              </p>
            </div>
          </button>

          {/* Feature 3: Đề thi thử chuyên nghiệp */}
          <button
            onClick={onOpenMockExam}
            className="flex items-center gap-3 p-2.5 lg:px-4 rounded-xl hover:bg-purple-50/60 transition-colors text-left group focus:outline-none"
          >
            <div className="transition-transform group-hover:scale-105">
              <ExamIcon />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-purple-700 transition-colors">
                Đề thi thử
              </p>
              <p className="text-slate-500 text-xs sm:text-sm leading-tight mt-0.5">
                chuyên nghiệp
              </p>
            </div>
          </button>

          {/* Feature 4: Trò chơi tương tác hấp dẫn */}
          <button
            onClick={onOpenGames}
            className="flex items-center gap-3 p-2.5 lg:px-4 rounded-xl hover:bg-amber-50/60 transition-colors text-left group focus:outline-none"
          >
            <div className="transition-transform group-hover:scale-105">
              <GameIcon />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-amber-700 transition-colors">
                Trò chơi tương tác
              </p>
              <p className="text-slate-500 text-xs sm:text-sm leading-tight mt-0.5">
                hấp dẫn
              </p>
            </div>
          </button>

          {/* Feature 5: Theo dõi tiến độ học tập */}
          <button
            onClick={onOpenProgress}
            className="flex items-center gap-3 p-2.5 lg:px-4 rounded-xl hover:bg-sky-50/60 transition-colors text-left group focus:outline-none col-span-2 sm:col-span-1"
          >
            <div className="transition-transform group-hover:scale-105">
              <ProgressIcon />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-sky-700 transition-colors">
                Theo dõi tiến độ
              </p>
              <p className="text-slate-500 text-xs sm:text-sm leading-tight mt-0.5">
                học tập
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
