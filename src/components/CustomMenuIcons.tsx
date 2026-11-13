import React from 'react';

// 1. Blue document with red stamp/seal (matches 3rd icon in reference image)
export const DocumentSealIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Back blue folder/paper */}
    <rect x="10" y="8" width="26" height="32" rx="4" fill="#60A5FA" />
    {/* Front paper sheet */}
    <rect x="13" y="11" width="22" height="28" rx="3" fill="#FFFFFF" />
    {/* Document lines */}
    <line x1="17" y1="16" x2="27" y2="16" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="21" x2="31" y2="21" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="26" x2="25" y2="26" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    {/* Blue verified checkmark seal on left bottom */}
    <circle cx="21" cy="32" r="5" fill="#3B82F6" />
    <path d="M19 32L20.5 33.5L23.5 30.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Red wax stamp on bottom right (3D look) */}
    <circle cx="29" cy="31" r="7" fill="#EF4444" />
    <circle cx="29" cy="31" r="5" fill="#DC2626" />
    <path d="M27 30L28.5 31.5L31 29" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 2. Hierarchy Tree with yellow folders (matches 10th icon in reference image)
export const FolderHierarchyIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Top root folder (Blue) */}
    <rect x="16" y="8" width="16" height="12" rx="2.5" fill="#2563EB" />
    <path d="M16 11H22L24 13H32V19C32 19.5 31.5 20 31 20H17C16.5 20 16 19.5 16 19V11Z" fill="#3B82F6" />
    <rect x="19" y="14" width="10" height="2" rx="1" fill="#FFFFFF" />

    {/* Connecting tree branches */}
    <path d="M24 20V27M12 27H36M12 27V31M24 27V31M36 27V31" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

    {/* Bottom sub-folders (Yellow/Gold) */}
    {/* Folder 1 */}
    <rect x="6" y="31" width="12" height="9" rx="2" fill="#D97706" />
    <rect x="6" y="33" width="12" height="7" rx="1.5" fill="#F59E0B" />
    {/* Folder 2 */}
    <rect x="18" y="31" width="12" height="9" rx="2" fill="#D97706" />
    <rect x="18" y="33" width="12" height="7" rx="1.5" fill="#F59E0B" />
    {/* Folder 3 */}
    <rect x="30" y="31" width="12" height="9" rx="2" fill="#D97706" />
    <rect x="30" y="33" width="12" height="7" rx="1.5" fill="#F59E0B" />
  </svg>
);

// 3. Clipboard with magnifying glass (matches 6th icon in reference image)
export const ClipboardReviewIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Orange/Brown clipboard board */}
    <rect x="11" y="10" width="24" height="30" rx="3.5" fill="#EA580C" />
    <rect x="17" y="7" width="12" height="5" rx="1.5" fill="#F59E0B" />
    <circle cx="23" cy="9.5" r="1.5" fill="#78350F" />
    {/* White sheet with blue notes */}
    <rect x="14" y="14" width="18" height="23" rx="2" fill="#FFFFFF" />
    <rect x="17" y="17" width="6" height="5" rx="1" fill="#FBBF24" />
    <line x1="17" y1="25" x2="28" y2="25" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="17" y1="29" x2="28" y2="29" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
    {/* 3D Magnifying glass on right */}
    <circle cx="30" cy="28" r="6" stroke="#2563EB" strokeWidth="2.5" fill="#EFF6FF" />
    <path d="M34 32L39 37" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 4. Test Paper with checks & target (matches 4th icon in reference image)
export const ExamPaperIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Back blue document layers */}
    <path d="M12 12C12 10.5 13.5 9 15 9H31L37 15V36C37 37.5 35.5 39 34 39H15C13.5 39 12 37.5 12 36V12Z" fill="#3B82F6" />
    {/* White front sheet */}
    <path d="M15 13H29L34 18V36H15V13Z" fill="#FFFFFF" />
    {/* Text lines */}
    <line x1="18" y1="18" x2="25" y2="18" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="18" y1="22" x2="31" y2="22" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="18" y1="26" x2="27" y2="26" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />

    {/* Green checkmark badge */}
    <circle cx="28" cy="31" r="5" fill="#10B981" />
    <path d="M26 31L27.5 32.5L30.5 29.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Red target circle badge */}
    <circle cx="20" cy="31" r="5" fill="#EF4444" />
    <circle cx="20" cy="31" r="3" fill="#FFFFFF" />
    <circle cx="20" cy="31" r="1.5" fill="#DC2626" />
  </svg>
);

// 5. 3D Calendar with Clock Timer (matches 8th & 9th icons in reference image)
export const CalendarTimerIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Desk Calendar in isometric 3D */}
    <rect x="11" y="11" width="25" height="26" rx="3.5" fill="#60A5FA" />
    {/* White sheet with calendar grid */}
    <rect x="13" y="15" width="21" height="20" rx="2" fill="#FFFFFF" />
    {/* Header strip */}
    <path d="M13 15H34V20H13V15Z" fill="#3B82F6" />
    {/* Binder spirals on top */}
    <rect x="16" y="9" width="2" height="4" rx="1" fill="#1E40AF" />
    <rect x="23" y="9" width="2" height="4" rx="1" fill="#1E40AF" />
    <rect x="30" y="9" width="2" height="4" rx="1" fill="#1E40AF" />
    {/* Calendar grid dots */}
    <circle cx="17" cy="24" r="1.2" fill="#94A3B8" />
    <circle cx="23" cy="24" r="1.2" fill="#94A3B8" />
    <circle cx="29" cy="24" r="1.2" fill="#94A3B8" />
    <circle cx="17" cy="29" r="1.2" fill="#94A3B8" />
    <circle cx="23" cy="29" r="1.2" fill="#10B981" />
    <circle cx="29" cy="29" r="1.2" fill="#EF4444" />

    {/* Clock badge on bottom right */}
    <circle cx="31" cy="32" r="6" fill="#F59E0B" />
    <circle cx="31" cy="32" r="5" fill="#FFFFFF" />
    <path d="M31 29.5V32L33 33" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
