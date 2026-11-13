import React, { useEffect, useState } from 'react';
import {
  X,
  Trash2,
  RotateCcw,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  Layers,
  FolderOpen,
  CheckSquare,
} from 'lucide-react';
import { DocumentItem } from './DocumentViewerModal';
import { SubjectType, TabType } from './SubjectWorkspace';

export interface TrashItem {
  id: string;
  doc: DocumentItem;
  deletedAt: string;
  originalSubject: SubjectType;
  originalTab: TabType;
  folderName: string;
  isUploaded: boolean;
}

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  trashItems: TrashItem[];
  onRestore: (item: TrashItem) => void;
  onPermanentDelete: (item: TrashItem) => void;
  onRestoreAll: () => void;
  onEmptyTrash: () => void;
  onRestoreMultiple?: (items: TrashItem[]) => void;
  onPermanentDeleteMultiple?: (items: TrashItem[]) => void;
}

export const TrashModal: React.FC<TrashModalProps> = ({
  isOpen,
  onClose,
  trashItems,
  onRestore,
  onPermanentDelete,
  onRestoreAll,
  onEmptyTrash,
  onRestoreMultiple,
  onPermanentDeleteMultiple,
}) => {
  const [selectedTrashIds, setSelectedTrashIds] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clean up selected ids when modal closes or trashItems change
  useEffect(() => {
    if (!isOpen) {
      setSelectedTrashIds([]);
    } else {
      setSelectedTrashIds((prev) =>
        prev.filter((id) => trashItems.some((t) => t.id === id))
      );
    }
  }, [isOpen, trashItems]);

  if (!isOpen) return null;

  const handleToggleSelect = (id: string) => {
    setSelectedTrashIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTrashIds.length === trashItems.length) {
      setSelectedTrashIds([]);
    } else {
      setSelectedTrashIds(trashItems.map((t) => t.id));
    }
  };

  const handleRestoreSelected = () => {
    const itemsToRestore = trashItems.filter((t) => selectedTrashIds.includes(t.id));
    if (itemsToRestore.length === 0) return;

    if (onRestoreMultiple) {
      onRestoreMultiple(itemsToRestore);
    } else {
      itemsToRestore.forEach((item) => onRestore(item));
    }
    setSelectedTrashIds([]);
  };

  const handlePermanentDeleteSelected = () => {
    const itemsToDelete = trashItems.filter((t) => selectedTrashIds.includes(t.id));
    if (itemsToDelete.length === 0) return;

    if (
      !window.confirm(
        `Xóa vĩnh viễn ${itemsToDelete.length} tệp đã chọn? Hành động này không thể hoàn tác.`
      )
    ) {
      return;
    }

    if (onPermanentDeleteMultiple) {
      onPermanentDeleteMultiple(itemsToDelete);
    } else {
      itemsToDelete.forEach((item) => onPermanentDelete(item));
    }
    setSelectedTrashIds([]);
  };

  const isAllSelected = trashItems.length > 0 && selectedTrashIds.length === trashItems.length;
  const isIndeterminate = selectedTrashIds.length > 0 && selectedTrashIds.length < trashItems.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <span>Thùng rác</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                  {trashItems.length} tệp
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Các tệp đã xóa được lưu trữ an toàn trong thư mục dự án <span className="font-mono bg-slate-100 px-1 rounded">public/ThungRac/</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetch('/api/open-trash-folder', { method: 'POST' }).catch(() => {});
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
              title="Mở thư mục Thùng rác trên máy tính bằng Windows Explorer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Mở thư mục Thùng rác trên máy</span>
              <span className="sm:hidden">Mở thư mục</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar / Stick box Bulk Actions */}
        {trashItems.length > 0 && (
          <div className="px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Select All Checkbox */}
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-slate-900 select-none">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
              <span>
                Chọn tất cả ({selectedTrashIds.length}/{trashItems.length})
              </span>
            </label>

            {/* Actions for Selected Items OR Global Actions */}
            <div className="flex items-center gap-2">
              {selectedTrashIds.length > 0 ? (
                <>
                  <button
                    onClick={handleRestoreSelected}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-xs"
                    title="Khôi phục các tệp đã chọn về vị trí ban đầu"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục đã chọn ({selectedTrashIds.length})</span>
                  </button>

                  <button
                    onClick={handlePermanentDeleteSelected}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors shadow-xs"
                    title="Xóa vĩnh viễn các tệp đã chọn"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa vĩnh viễn ({selectedTrashIds.length})</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onRestoreAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors border border-blue-200"
                    title="Khôi phục toàn bộ tệp về vị trí ban đầu"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục tất cả</span>
                  </button>
                  <button
                    onClick={onEmptyTrash}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg transition-colors border border-rose-200"
                    title="Xóa sạch toàn bộ tệp trong thùng rác"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Dọn sạch thùng rác</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Body File List */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100">
          {trashItems.length > 0 ? (
            trashItems.map((item) => {
              const isSelected = selectedTrashIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`py-3.5 flex items-center justify-between gap-3 group px-3 -mx-3 rounded-xl transition-colors ${
                    isSelected ? 'bg-blue-50/70 border border-blue-200' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Stick box (Checkbox) */}
                  <div className="shrink-0 flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(item.id)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                      title="Chọn tệp này"
                    />
                  </div>

                  {/* Left: Icon & Details */}
                  <div
                    onClick={() => handleToggleSelect(item.id)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        item.doc.fileType === 'pdf'
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : item.doc.fileType === 'docx'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : item.doc.fileType === 'xlsx'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}
                    >
                      {item.doc.fileType === 'pdf' && <FileText className="w-4 h-4 text-red-600" />}
                      {item.doc.fileType === 'docx' && <FileText className="w-4 h-4 text-blue-600" />}
                      {item.doc.fileType === 'xlsx' && <FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
                      {item.doc.fileType === 'pptx' && <Layers className="w-4 h-4 text-orange-600" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 text-sm truncate" title={item.doc.fileName}>
                        {item.doc.fileName}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="truncate max-w-[200px]" title={item.folderName}>
                          {item.folderName}
                        </span>
                        <span>&bull;</span>
                        <span>Đã xóa: {item.deletedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Restore & Permanent Delete single item) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onRestore(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-semibold transition-all border border-blue-200 hover:border-blue-600"
                      title="Khôi phục tệp này về lại danh mục"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Khôi phục</span>
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Xóa vĩnh viễn tệp "${item.doc.fileName}"? Hành động này không thể hoàn tác.`
                          )
                        ) {
                          onPermanentDelete(item);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Xóa vĩnh viễn tệp này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-slate-400">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Trash2 className="w-7 h-7 text-slate-300" />
              </div>
              <p className="font-semibold text-slate-700 text-sm">Thùng rác đang trống</p>
              <p className="text-xs text-slate-400 mt-1">
                Các tệp sau khi xóa sẽ xuất hiện ở đây để bạn có thể khôi phục lại khi cần.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};


