import React from 'react';
import { X, BookOpen, CheckCircle2, AlertTriangle, FileText, HelpCircle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
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
              <h2 className="text-xl sm:text-2xl font-bold">Hướng Dẫn Học Tập &amp; Thi Sát Hạch</h2>
              <p className="text-blue-200 text-xs sm:text-sm">
                Quy chế thi Chuẩn kỹ năng sử dụng Công nghệ thông tin cơ bản
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Cơ cấu bài thi chuẩn quốc gia</span>
            </h3>
            <p>
              Theo quy định của Bộ Giáo dục &amp; Đào tạo và Bộ Thông tin &amp; Truyền thông, kỳ thi đánh giá chuẩn kỹ năng CNTT cơ bản gồm 2 phần thi bắt buộc:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-blue-900 mb-1">Phần 1: Lý thuyết trắc nghiệm</h4>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-1">
                  <li>&bull; Số lượng: 30 câu hỏi ngẫu nhiên từ ngân hàng đề</li>
                  <li>&bull; Thời gian: 30 phút</li>
                  <li>&bull; Hình thức: Thi trực tiếp trên phần mềm máy tính</li>
                  <li>&bull; Điểm đạt: Tối thiểu 5.0 / 10 điểm (đúng từ 15 câu trở lên)</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-emerald-900 mb-1">Phần 2: Thực hành máy tính</h4>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-1">
                  <li>&bull; Microsoft Word: 3.0 điểm (Soạn thảo văn bản)</li>
                  <li>&bull; Microsoft Excel: 4.0 điểm (Xử lý bảng tính &amp; hàm)</li>
                  <li>&bull; Microsoft PowerPoint: 3.0 điểm (Thiết kế trình chiếu)</li>
                  <li>&bull; Thời gian: 60 - 90 phút</li>
                  <li>&bull; Điểm đạt: Tối thiểu 5.0 / 10 điểm</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Lộ trình ôn thi 3 bước hiệu quả</span>
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-sm">Bước 1: Nắm chắc lý thuyết và phím tắt</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Học các thẻ lệnh trên Ribbon, cách quản lý thư mục trong Windows và các phím tắt cốt lõi như Ctrl+S, Ctrl+Z, Ctrl+C, Ctrl+V, F5.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-sm">Bước 2: Luyện giải các dạng bài tập thực hành mẫu</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Thực hành định dạng văn bản chuẩn, bảng lương Excel sử dụng các hàm IF, VLOOKUP, SUMIF và tạo slide với Slide Master.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-sm">Bước 3: Thi thử trực tuyến bấm giờ</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Vào mục "Đề thi thử chuyên nghiệp" để làm quen với áp lực thời gian 30 phút và rà soát các câu hỏi hay bị bẫy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Lưu ý phòng thi */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Lưu ý quan trọng khi vào phòng thi:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              <li>Lưu bài thi liên tục bằng phím tắt <strong>Ctrl + S</strong> để tránh sự cố mất điện đột ngột.</li>
              <li>Đặt tên thư mục bài làm và tệp đúng cú pháp quy định (ví dụ: <code>SBD_HoVaTen</code>).</li>
              <li>Kiểm tra bộ gõ tiếng Việt UniKey (Bảng mã Unicode, Kiểu gõ Telex) trước khi bắt đầu làm bài.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0F284B] hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Đã hiểu, quay lại học
          </button>
        </div>
      </div>
    </div>
  );
};
