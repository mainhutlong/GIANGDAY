import React, { useState } from 'react';
import { X, CheckCircle, Download, FileSpreadsheet, FileText, Presentation, Eye } from 'lucide-react';

interface PracticeExercisesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const exercises = [
  {
    id: 'W01',
    subject: 'word',
    title: 'Bài tập Word 01: Soạn thảo Quyết định khen thưởng chuẩn Nghị định 30',
    difficulty: 'Cơ bản',
    time: '25 phút',
    requirements: [
      'Khổ giấy A4, lề trên 2cm, dưới 2cm, trái 3cm, phải 2cm.',
      'Quốc hiệu & Tiêu ngữ: Chữ in hoa đứng, đậm, có đường kẻ chỉ bằng 1/3 độ dài dòng chữ.',
      'Tạo bảng danh sách khen thưởng có định dạng viền ngoài đôi, viền trong đơn.',
      'Căn chỉnh chữ trong ô giữa trang theo cả chiều dọc và ngang.',
    ],
    hint: 'Sử dụng phím tắt Ctrl+E căn giữa, vào Paragraph thiết lập Before/After 6pt.',
  },
  {
    id: 'W02',
    subject: 'word',
    title: 'Bài tập Word 02: Trộn thư (Mail Merge) Giấy báo điểm thi tốt nghiệp',
    difficulty: 'Nâng cao',
    time: '30 phút',
    requirements: [
      'Tạo tệp mẫu Giấy báo dự thi.',
      'Kết nối với file nguồn DanhSachHocVien.xlsx.',
      'Chèn các trường: Họ và tên, Ngày sinh, Điểm LT, Điểm TH, Kết quả.',
      'Xuất bản tệp hoàn chỉnh cho 20 thí sinh.',
    ],
    hint: 'Thẻ Mailings -> Start Mail Merge -> Letters -> Select Recipients.',
  },
  {
    id: 'E01',
    subject: 'excel',
    title: 'Bài tập Excel 01: Bảng thanh toán lương nhân viên & trích nộp bảo hiểm',
    difficulty: 'Trung bình',
    time: '30 phút',
    requirements: [
      'Tính Phụ cấp chức vụ dùng hàm IF lồng hoặc VLOOKUP từ Bảng 2.',
      'Tính Lương chính = Lương cơ bản * Hệ số.',
      'Tính Bảo hiểm xã hội = 8% * Lương chính.',
      'Tính Thực lĩnh = Lương chính + Phụ cấp - Bảo hiểm.',
      'Thống kê tổng tiền lương bằng hàm SUM, người có lương cao nhất bằng hàm MAX.',
    ],
    hint: 'Dùng địa chỉ tuyệt đối $ cho ô chứa tỷ lệ bảo hiểm.',
  },
  {
    id: 'E02',
    subject: 'excel',
    title: 'Bài tập Excel 02: Bảng thống kê nhập xuất kho hàng hóa & vẽ đồ thị',
    difficulty: 'Nâng cao',
    time: '35 phút',
    requirements: [
      'Lấy tên mặt hàng từ mã hàng sử dụng hàm VLOOKUP kết hợp LEFT.',
      'Tính Thành tiền = Số lượng * Đơn giá, nếu số lượng > 50 thì giảm giá 5%.',
      'Tính tổng tiền xuất kho theo từng ngành hàng dùng hàm SUMIF.',
      'Vẽ biểu đồ hình cột (Column Chart) thể hiện doanh số từng mặt hàng.',
    ],
    hint: '=VLOOKUP(LEFT(A3,2), $F$2:$H$8, 2, 0).',
  },
  {
    id: 'P01',
    subject: 'powerpoint',
    title: 'Bài tập PowerPoint 01: Thiết kế Slide báo cáo chuyển đổi số (5 slides)',
    difficulty: 'Cơ bản',
    time: '20 phút',
    requirements: [
      'Slide 1: Trang tiêu đề với hiệu ứng Fade.',
      'Slide 2: Mục tiêu dự án sử dụng SmartArt dạng Vertical Process.',
      'Slide 3: Bảng số liệu kinh phí với hiệu ứng Appear theo từng dòng.',
      'Slide 4: Biểu đồ tăng trưởng người dùng liên kết từ bảng Excel.',
      'Slide 5: Trang kết luận và cảm ơn.',
    ],
    hint: 'Vào View -> Slide Master để đặt logo và chân trang đồng bộ.',
  },
];

export const PracticeExercisesModal: React.FC<PracticeExercisesModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'word' | 'excel' | 'powerpoint'>('all');
  const [selectedEx, setSelectedEx] = useState<string>(exercises[0].id);

  if (!isOpen) return null;

  const currentExercise = exercises.find((e) => e.id === selectedEx) || exercises[0];

  const filtered = exercises.filter((e) => filter === 'all' || e.subject === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="bg-[#107C41] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl">
              <FileSpreadsheet className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Ngân Hàng Bài Tập Thực Hành</h2>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Bài tập bám sát cấu trúc đề thi thực hành CNTT cơ bản các trường đại học
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-100 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-500 font-medium mr-2">Bộ môn:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('word')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'word' ? 'bg-[#0D62D9] text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Microsoft Word
          </button>
          <button
            onClick={() => setFilter('excel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'excel' ? 'bg-[#107C41] text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Microsoft Excel
          </button>
          <button
            onClick={() => setFilter('powerpoint')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'powerpoint' ? 'bg-[#D83B01] text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Microsoft PowerPoint
          </button>
        </div>

        {/* Content split */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* List column */}
          <div className="md:col-span-5 p-4 overflow-y-auto space-y-2.5 border-r border-slate-200 bg-slate-50/50">
            {filtered.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setSelectedEx(ex.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  selectedEx === ex.id
                    ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span
                    className={`px-2 py-0.5 rounded font-mono ${
                      ex.subject === 'word'
                        ? 'bg-blue-100 text-blue-800'
                        : ex.subject === 'excel'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {ex.id}
                  </span>
                  <span className="text-slate-500 font-normal">{ex.time}</span>
                </div>
                <h4 className="font-semibold text-slate-800 text-xs sm:text-sm line-clamp-2">
                  {ex.title}
                </h4>
              </button>
            ))}
          </div>

          {/* Details column */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 bg-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {currentExercise.difficulty}
                </span>
                <span className="text-xs text-slate-500">Thời gian làm bài: {currentExercise.time}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                {currentExercise.title}
              </h3>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Yêu cầu đề bài:
              </h4>
              <ul className="space-y-2">
                {currentExercise.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900">
              <strong>Gợi ý giải nhanh:</strong> {currentExercise.hint}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => alert(`Đang tải file đề bài mẫu ${currentExercise.id}.zip...`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Tải dữ liệu bài thực hành (.zip)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
