import React, { useState, useEffect } from 'react';
import {
  X,
  FolderPlus,
  BookOpen,
  Video,
  FileText,
  Sparkles,
  Layers,
  Code2,
  Folder,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { CustomCategory } from '../types/category';

interface CreateCategoryModalProps {
  isOpen: boolean;
  subject: string;
  subjectTitle: string;
  existingCount: number;
  existingFolderNames: string[];
  onClose: () => void;
  onCategoryCreated: (newCat: CustomCategory) => void;
}

const CATEGORY_ICONS: {
  id: 'folder' | 'book' | 'video' | 'fileText' | 'sparkles' | 'layers' | 'code';
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'folder', label: 'Thư mục', icon: <Folder className="w-5 h-5 text-amber-500" /> },
  { id: 'book', label: 'Tài liệu', icon: <BookOpen className="w-5 h-5 text-blue-500" /> },
  { id: 'video', label: 'Video bài giảng', icon: <Video className="w-5 h-5 text-rose-500" /> },
  { id: 'fileText', label: 'Văn bản', icon: <FileText className="w-5 h-5 text-emerald-500" /> },
  { id: 'sparkles', label: 'Chuyên đề', icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
  { id: 'layers', label: 'Bài tập mở rộng', icon: <Layers className="w-5 h-5 text-indigo-500" /> },
  { id: 'code', label: 'Thực hành', icon: <Code2 className="w-5 h-5 text-cyan-500" /> },
];

function removeVietnameseTones(str: string): string {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
}

function sanitizeFolderName(name: string, nextIndex: number): string {
  const withoutTones = removeVietnameseTones(name);
  const clean = withoutTones
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return clean ? `${nextIndex}_${clean}` : '';
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  subject,
  subjectTitle,
  existingCount,
  existingFolderNames,
  onClose,
  onCategoryCreated,
}) => {
  const [label, setLabel] = useState('');
  const [folderName, setFolderName] = useState('');
  const [isFolderEdited, setIsFolderEdited] = useState(false);
  const [iconType, setIconType] = useState<
    'folder' | 'book' | 'video' | 'fileText' | 'sparkles' | 'layers' | 'code'
  >('folder');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextIndex = existingCount + 1;

  useEffect(() => {
    if (isOpen) {
      setLabel('');
      setFolderName('');
      setIsFolderEdited(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLabel(val);
    if (!isFolderEdited) {
      setFolderName(sanitizeFolderName(val, nextIndex));
    }
    setError(null);
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value.replace(/[/\\?%*:|"<>]/g, ''));
    setIsFolderEdited(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLabel = label.trim();
    const cleanFolder = folderName.trim();

    if (!cleanLabel) {
      setError('Vui lòng nhập tên danh mục học tập.');
      return;
    }
    if (!cleanFolder) {
      setError('Vui lòng nhập tên thư mục lưu trữ trên máy.');
      return;
    }

    if (existingFolderNames.some((f) => f.toLowerCase() === cleanFolder.toLowerCase())) {
      setError(`Thư mục "${cleanFolder}" đã tồn tại trong môn này. Vui lòng chọn tên thư mục khác.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/create-custom-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          label: cleanLabel,
          folderName: cleanFolder,
          iconType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể tạo thư mục danh mục');
      }

      onCategoryCreated(data.category);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tạo thư mục trên máy');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
                Tạo danh mục học tập mới
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Môn: <strong className="text-blue-600">{subjectTitle}</strong> &bull; Tự tạo thư mục trên máy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Tên danh mục */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
              Tên danh mục học tập <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={handleLabelChange}
              placeholder="Ví dụ: Tài liệu tham khảo, Video bài giảng, Đề cương ôn tập..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold text-slate-800"
              required
              autoFocus
            />
          </div>

          {/* 2. Tên thư mục vật lý */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
              Tên thư mục lưu trữ trên máy tính <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-mono text-slate-400 select-none">
                public/TaiLieu/.../
              </span>
              <input
                type="text"
                value={folderName}
                onChange={handleFolderChange}
                placeholder={`${nextIndex}_TaiLieuThamKhao`}
                className="w-full pl-36 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs sm:text-sm font-bold text-blue-800"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Hệ thống sẽ tự động tạo thư mục này trên ổ đĩa để bạn kéo thả hoặc lưu tệp vào.
            </p>
          </div>

          {/* 3. Chọn biểu tượng */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
              Chọn biểu tượng hiển thị
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORY_ICONS.map((ico) => {
                const isSelected = iconType === ico.id;
                return (
                  <button
                    key={ico.id}
                    type="button"
                    onClick={() => setIconType(ico.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-400/40 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{ico.icon}</span>
                    <span className="truncate">{ico.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tạo thư mục...</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  <span>Tạo danh mục & Thư mục</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

