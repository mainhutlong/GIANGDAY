import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  Maximize2,
  FileSpreadsheet,
  Presentation,
  BookOpen,
} from 'lucide-react';

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx';
  fileSize: string;
  pages: number;
  updatedAt: string;
  category: string;
  description: string;
  contentPages: {
    pageNumber: number;
    title: string;
    body: React.ReactNode;
  }[];
}

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Escape shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !document) return null;

  const totalPages = document.contentPages.length || document.pages;
  const activePageData = document.contentPages.find((p) => p.pageNumber === currentPage) || document.contentPages[0];

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDownload = () => {
    alert(`Đang tải tệp: ${document.fileName} (${document.fileSize})...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1A202C] text-slate-200 select-none animate-fadeIn w-screen h-screen overflow-hidden">
      {/* Full Screen Reader Toolbar */}
      <div className="bg-[#111827] text-slate-200 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-md">
        {/* File Title and Badge */}
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs uppercase shrink-0 ${
              document.fileType === 'pdf'
                ? 'bg-red-500 text-white'
                : document.fileType === 'docx'
                ? 'bg-blue-500 text-white'
                : document.fileType === 'xlsx'
                ? 'bg-emerald-500 text-white'
                : 'bg-orange-500 text-white'
            }`}
          >
            {document.fileType}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md lg:max-w-xl">
              {document.fileName}
            </h3>
          </div>
        </div>

        {/* Controls: Page navigation + Zoom + Download + Close */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Page Navigator */}
          <div className="flex items-center gap-1 bg-[#2D3748] px-2.5 py-1.5 rounded-xl border border-slate-600 text-xs text-slate-300">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="p-1 hover:text-white disabled:opacity-30 transition-colors"
              title="Trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-medium px-1">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-1 hover:text-white disabled:opacity-30 transition-colors"
              title="Trang tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-[#2D3748] px-2 py-1.5 rounded-xl border border-slate-600 text-xs text-slate-300">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(50, prev - 15))}
              className="p-1 hover:text-white transition-colors"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="font-mono text-[11px] px-1.5 py-0.5 rounded hover:bg-slate-600/60 text-center font-medium transition-colors"
              title="Đặt lại 100%"
            >
              {zoomLevel}%
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(200, prev + 15))}
              className="p-1 hover:text-white transition-colors"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            title="Tải tệp về máy tính"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Tải về</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors hidden sm:block"
            title="In tài liệu"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition-colors ml-1"
            title="Đóng chế độ toàn màn hình (Esc)"
          >
            <X className="w-4 h-4" />
            <span>Đóng</span>
          </button>
        </div>
      </div>

      {/* Document Viewport - Virtual Page Rendering Full Screen with Natural Mouse Wheel Scroll */}
      <div className="flex-1 bg-[#374151] overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200 w-full max-w-4xl"
        >
          {/* Virtual A4 White Paper Container */}
          <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-14 min-h-[920px] text-slate-800 flex flex-col justify-between border border-slate-200">
            {/* Header of paper */}
            <div>
              <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-6 text-xs text-slate-500">
                <div className="font-semibold text-slate-700 uppercase tracking-wide">
                  HỆ THỐNG GIẢNG DẠY TIN HỌC
                </div>
                <div>
                  Mã tài liệu: <strong className="font-mono text-slate-800">{document.id}</strong>
                </div>
              </div>

              {/* Main Dynamic Page Content */}
              {activePageData ? (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pb-2">
                    {activePageData.title}
                  </h2>
                  <div className="text-sm leading-relaxed text-slate-700 space-y-3 font-serif">
                    {activePageData.body}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>Nội dung trang tài liệu đang tải...</p>
                </div>
              )}
            </div>

            {/* Footer of paper */}
            <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
              <span>Đào tạo chuẩn kỹ năng Tin học</span>
              <span className="font-mono font-medium">Trang {currentPage} / {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
