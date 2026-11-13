import React from 'react';
import { X, BookOpen, Clock, FileText, CheckCircle2 } from 'lucide-react';

interface CourseCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: 'word' | 'excel' | 'powerpoint') => void;
}

const modules = [
  {
    id: 'IU01',
    title: 'Hiểu biết về CNTT cơ bản',
    lessons: 6,
    hours: 15,
    desc: 'Kiến thức phần cứng, phần mềm, mạng máy tính, an toàn thông tin và khía cạnh pháp lý trong ứng dụng CNTT.',
    type: 'general',
  },
  {
    id: 'IU02',
    title: 'Sử dụng máy tính cơ bản',
    lessons: 8,
    hours: 20,
    desc: 'Hệ điều hành Windows, thao tác cửa sổ, quản lý tệp và thư mục (File Explorer), gõ tiếng Việt UniKey.',
    type: 'general',
  },
  {
    id: 'IU03',
    title: 'Xử lý văn bản cơ bản (Microsoft Word)',
    lessons: 10,
    hours: 30,
    desc: 'Định dạng ký tự, đoạn văn bản, chèn bảng biểu, đồ họa, trộn thư Mail Merge và xuất bản tài liệu chuẩn.',
    type: 'word',
  },
  {
    id: 'IU04',
    title: 'Sử dụng bảng tính cơ bản (Microsoft Excel)',
    lessons: 12,
    hours: 35,
    desc: 'Nhập liệu, định dạng ô, công thức toán học, hàm logic IF, thống kê, tìm kiếm VLOOKUP và vẽ biểu đồ.',
    type: 'excel',
  },
  {
    id: 'IU05',
    title: 'Sử dụng trình chiếu cơ bản (Microsoft PowerPoint)',
    lessons: 8,
    hours: 20,
    desc: 'Thiết kế bố cục slide, chèn đối tượng, Slide Master, hiệu ứng chuyển trang Transitions & Animation.',
    type: 'powerpoint',
  },
  {
    id: 'IU06',
    title: 'Sử dụng Internet cơ bản',
    lessons: 6,
    hours: 15,
    desc: 'Duyệt web an toàn (Chrome/Edge), tìm kiếm thông tin, sử dụng thư điện tử Email và lưu trữ đám mây.',
    type: 'general',
  },
];

export const CourseCatalogModal: React.FC<CourseCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="bg-[#0F284B] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Khung Chương Trình Đào Tạo</h2>
              <p className="text-blue-200 text-xs sm:text-sm">
                Chuẩn kỹ năng sử dụng CNTT cơ bản theo Thông tư 03/2014/TT-BTTTT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m) => (
              <div
                key={m.id}
                className="bg-slate-50 hover:bg-blue-50/50 p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-lg font-mono">
                      {m.id}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {m.lessons} bài
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {m.hours} tiết
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-2.5">{m.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">{m.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đầy đủ giáo trình &amp; đề thi
                  </span>

                  {(m.type === 'word' || m.type === 'excel' || m.type === 'powerpoint') && (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectModule(m.type as 'word' | 'excel' | 'powerpoint');
                      }}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 underline"
                    >
                      Vào học ngay &rarr;
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0F284B] hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
