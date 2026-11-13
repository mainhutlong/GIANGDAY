import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Search, Play, FileText, Sparkles, BookOpen, KeyRound } from 'lucide-react';
import { WordIcon } from './OfficeIcons';

interface WordModuleProps {
  onBack: () => void;
  onUpdateProgress: (points: number) => void;
}

const lessons = [
  { id: 1, title: 'Bài 1: Giao diện Microsoft Word & Thao tác tệp', desc: 'Thanh Ribbon, Quick Access, tạo mới (Ctrl+N), lưu tệp (.docx, .pdf).' },
  { id: 2, title: 'Bài 2: Định dạng ký tự & Đoạn văn bản', desc: 'Font chữ, cỡ chữ, màu sắc, canh lề (Ctrl+L/E/R/J), khoảng cách dòng Line Spacing.' },
  { id: 3, title: 'Bài 3: Chèn Bảng biểu (Table) & Đồ họa', desc: 'Tạo bảng, gộp ô (Merge Cells), chèn cột/hàng, chèn hình ảnh, căn chỉnh văn bản trong ô.' },
  { id: 4, title: 'Bài 4: Trộn thư (Mail Merge) & Mục lục', desc: 'Tạo danh sách trộn thư, chèn trường dữ liệu, tạo mục lục tự động (Table of Contents).' },
  { id: 5, title: 'Bài 5: Định dạng trang in & Xuất bản', desc: 'Căn lề trang (Margins), khổ giấy A4, hướng giấy Portrait/Landscape, Header/Footer, Page Number.' },
];

const shortcuts = [
  { key: 'Ctrl + N', desc: 'Tạo một tài liệu trắng mới' },
  { key: 'Ctrl + O', desc: 'Mở tài liệu có sẵn trên máy tính' },
  { key: 'Ctrl + S', desc: 'Lưu tài liệu hiện hành' },
  { key: 'F12', desc: 'Lưu tài liệu với tên mới (Save As)' },
  { key: 'Ctrl + P', desc: 'In ấn tài liệu (Print Preview)' },
  { key: 'Ctrl + Z', desc: 'Hoàn tác thao tác trước đó (Undo)' },
  { key: 'Ctrl + Y', desc: 'Làm lại thao tác vừa hủy (Redo)' },
  { key: 'Ctrl + B', desc: 'Bật / tắt in đậm (Bold)' },
  { key: 'Ctrl + I', desc: 'Bật / tắt in nghiêng (Italic)' },
  { key: 'Ctrl + U', desc: 'Bật / tắt gạch chân (Underline)' },
  { key: 'Ctrl + E', desc: 'Căn giữa đoạn văn bản (Center)' },
  { key: 'Ctrl + L', desc: 'Căn lề trái đoạn văn bản (Align Left)' },
  { key: 'Ctrl + R', desc: 'Căn lề phải đoạn văn bản (Align Right)' },
  { key: 'Ctrl + J', desc: 'Căn đều hai bên đoạn văn bản (Justify)' },
  { key: 'Ctrl + F', desc: 'Mở cửa sổ tìm kiếm từ khóa (Find)' },
  { key: 'Ctrl + H', desc: 'Mở hộp thoại Tìm kiếm và Thay thế (Replace)' },
  { key: 'Ctrl + Enter', desc: 'Ngắt trang bắt buộc (Page Break)' },
  { key: 'Ctrl + K', desc: 'Chèn siêu liên kết (Insert Hyperlink)' },
];

const quizQuestions = [
  {
    question: 'Tổ hợp phím tắt nào dùng để căn đều hai bên đoạn văn bản trong Microsoft Word?',
    options: ['Ctrl + E', 'Ctrl + J', 'Ctrl + L', 'Ctrl + R'],
    correct: 1,
    explain: 'Ctrl + J (Justify) dùng để căn đều cả 2 bên lề trái và phải của đoạn văn bản.',
  },
  {
    question: 'Để ngắt trang văn bản sang một trang hoàn toàn mới, phím tắt chuẩn là gì?',
    options: ['Shift + Enter', 'Alt + Enter', 'Ctrl + Enter', 'Tab + Enter'],
    correct: 2,
    explain: 'Ctrl + Enter sẽ chèn một dấu ngắt trang (Page Break) ngay tại vị trí con trỏ.',
  },
  {
    question: 'Tính năng nào trong Microsoft Word cho phép tự động tạo hàng loạt thư mời, giấy báo điểm từ danh sách Excel?',
    options: ['Table of Contents', 'Mail Merge', 'Track Changes', 'WordArt'],
    correct: 1,
    explain: 'Mail Merge (Trộn thư) kết hợp tài liệu mẫu trong Word với nguồn dữ liệu (Excel/Access) để tạo hàng loạt tài liệu cá nhân hóa.',
  },
  {
    question: 'Định dạng tệp mặc định của văn bản Microsoft Word từ phiên bản 2007 trở về sau là gì?',
    options: ['.doc', '.docx', '.txt', '.rtf'],
    correct: 1,
    explain: 'Định dạng mặc định là .docx dựa trên cấu trúc chuẩn OpenXML.',
  },
  {
    question: 'Để chèn số trang tự động vào chân trang của tài liệu, ta truy cập thẻ nào trên thanh Ribbon?',
    options: ['Thẻ Home', 'Thẻ Insert -> Page Number', 'Thẻ Layout', 'Thẻ View'],
    correct: 1,
    explain: 'Thẻ Insert chứa nhóm công cụ Header & Footer, trong đó có Page Number.',
  },
];

export const WordModule: React.FC<WordModuleProps> = ({ onBack, onUpdateProgress }) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'shortcuts' | 'quiz' | 'simulator'>('theory');
  const [selectedLesson, setSelectedLesson] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  // Mini simulator state
  const [simText, setSimText] = useState<string>(
    'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nGIẤY XÁC NHẬN KẾT QUẢ HỌC TẬP\nKính gửi: Phòng Đào tạo Trường Đại học...'
  );
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [align, setAlign] = useState<'left' | 'center' | 'right' | 'justify'>('center');
  const [textColor, setTextColor] = useState<string>('#0F284B');
  const [fontSize, setFontSize] = useState<number>(16);

  const filteredShortcuts = shortcuts.filter(
    (s) =>
      s.key.toLowerCase().includes(searchKey.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchKey.toLowerCase())
  );

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (submittedQuiz) return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleGradeQuiz = () => {
    setSubmittedQuiz(true);
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) correctCount++;
    });
    const points = correctCount * 20;
    onUpdateProgress(points);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmittedQuiz(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Breadcrumb & Return Button */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D62D9] hover:text-[#0a4eb0] bg-blue-50 hover:bg-blue-100/80 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <span>Trang chủ</span>
          <span>&gt;</span>
          <span className="font-semibold text-blue-800">Word - Soạn thảo văn bản cơ bản</span>
        </div>
      </div>

      {/* Hero Header for Module */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <WordIcon className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-3 py-1 rounded-full">
                Mô-đun Kỹ năng IU03
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold mt-2 tracking-tight">
                Microsoft Word Căn Bản
              </h1>
              <p className="text-blue-100 text-sm sm:text-base mt-1">
                Kỹ năng soạn thảo, căn chỉnh văn bản hành chính theo Nghị định 30/2020/NĐ-CP
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white/15 p-1.5 rounded-2xl backdrop-blur-md border border-white/20">
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'theory' ? 'bg-white text-blue-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Lý thuyết
            </button>
            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'shortcuts' ? 'bg-white text-blue-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Phím tắt
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'quiz' ? 'bg-white text-blue-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Trắc nghiệm (5 câu)
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'simulator' ? 'bg-white text-blue-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Mô phỏng gõ &amp; căn lề
            </button>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: LÝ THUYẾT ================= */}
      {activeTab === 'theory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Lessons Index */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Chương trình học chuẩn</span>
            </h3>
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  selectedLesson === lesson.id
                    ? 'bg-blue-50/90 border-blue-400 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      selectedLesson === lesson.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Mục {lesson.id}
                  </span>
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      selectedLesson === lesson.id ? 'text-blue-600' : 'text-slate-300'
                    }`}
                  />
                </div>
                <h4 className="font-semibold text-slate-800 text-sm mt-2">{lesson.title}</h4>
                <p className="text-slate-500 text-xs mt-1 line-clamp-2">{lesson.desc}</p>
              </button>
            ))}
          </div>

          {/* Right Detail Pane */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            {selectedLesson === 1 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Chủ đề 1</span>
                <h2 className="text-2xl font-bold text-slate-900">Giao diện Microsoft Word & Thao tác tệp tin</h2>
                <div className="prose text-slate-700 text-sm sm:text-base space-y-3 leading-relaxed">
                  <p>
                    Microsoft Word là phần mềm soạn thảo văn bản phổ biến nhất hiện nay. Trong đề thi Chuẩn CNTT cơ bản,
                    các thao tác tệp và nhận diện thanh Ribbon luôn chiếm từ 3-4 câu trắc nghiệm.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2">Các thành phần then chốt trên màn hình:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                      <li><strong>Quick Access Toolbar:</strong> Nằm ở góc trên bên trái, chứa các lệnh nhanh như Save, Undo, Redo.</li>
                      <li><strong>Thanh Ribbon:</strong> Gồm các thẻ (Tabs) như Home, Insert, Layout, References, Mailings, Review, View.</li>
                      <li><strong>Thước đo (Ruler):</strong> Dùng để căn chỉnh lề thụt đầu dòng (First Line Indent) và đặt Tab.</li>
                      <li><strong>Thanh trạng thái (Status Bar):</strong> Nằm ở đáy, hiển thị số trang, tổng số từ và chế độ hiển thị.</li>
                    </ul>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mt-4">Quy tắc lưu tệp trong kỳ thi:</h4>
                  <p>
                    Luôn lưu bài với tên định dạng: <code>[SBD]_[Hovaten].docx</code>. Để đổi sang file PDF, vào
                    <strong> File &rarr; Export &rarr; Create PDF/XPS Document</strong> hoặc <strong>File &rarr; Save As</strong> chọn đuôi .pdf.
                  </p>
                </div>
              </div>
            )}

            {selectedLesson === 2 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Chủ đề 2</span>
                <h2 className="text-2xl font-bold text-slate-900">Định dạng Ký tự & Đoạn văn bản hành chính</h2>
                <div className="text-slate-700 text-sm sm:text-base space-y-3 leading-relaxed">
                  <p>
                    Theo Nghị định 30/2020/NĐ-CP về công tác văn thư, văn bản chuẩn phải tuân thủ nghiêm ngặt các quy tắc:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-800 text-sm">1. Phông chữ &amp; Cỡ chữ</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Sử dụng phông chữ tiếng Việt <strong>Times New Roman</strong>, bảng mã chuẩn Unicode.
                        Cỡ chữ nội dung thường từ 13 đến 14pt.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-800 text-sm">2. Khoảng cách dòng &amp; Đoạn</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Dãn dòng (Line spacing) tối thiểu 1.0 đến 1.5 lines.
                        Khoảng cách giữa các đoạn (Before/After) thường đặt 6pt.
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs sm:text-sm">
                    <strong>Mẹo thi thực hành:</strong> Khi đề bài yêu cầu chữ đầu dòng thụt vào 1.27cm, hãy vào
                    thẻ <strong>Home &rarr; Paragraph &rarr; Special: First Line &rarr; By: 1.27 cm (hoặc 0.5 inch)</strong>.
                  </div>
                </div>
              </div>
            )}

            {selectedLesson === 3 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Chủ đề 3</span>
                <h2 className="text-2xl font-bold text-slate-900">Xử lý Bảng biểu (Table) & Chèn Đối tượng</h2>
                <div className="text-slate-700 text-sm sm:text-base space-y-3 leading-relaxed">
                  <p>
                    Bảng biểu trong Word là phần kiểm tra bắt buộc trong phần thi thực hành Chuẩn CNTT cơ bản.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Chèn bảng:</strong> Thẻ Insert &rarr; Table &rarr; chọn số cột x số dòng cần tạo.</li>
                    <li><strong>Gộp ô (Merge Cells):</strong> Bôi đen các ô &rarr; chuột phải chọn Merge Cells hoặc vào Layout &rarr; Merge Cells.</li>
                    <li><strong>Tách ô (Split Cells):</strong> Chia một ô thành nhiều hàng hoặc cột theo yêu cầu.</li>
                    <li><strong>Căn chữ giữa ô theo chiều dọc:</strong> Vào thẻ Table Tools Layout &rarr; chọn biểu tượng Align Center.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedLesson === 4 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Chủ đề 4</span>
                <h2 className="text-2xl font-bold text-slate-900">Trộn thư (Mail Merge) & Mục lục tự động</h2>
                <div className="text-slate-700 text-sm sm:text-base space-y-3 leading-relaxed">
                  <p>
                    <strong>Quy trình 5 bước thực hiện Mail Merge:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <li>Vào thẻ <strong>Mailings</strong> &rarr; chọn <strong>Start Mail Merge</strong> &rarr; Letters.</li>
                    <li>Bấm <strong>Select Recipients</strong> &rarr; <strong>Use an Existing List...</strong> &rarr; trỏ tới file Excel danh sách.</li>
                    <li>Đặt con trỏ tại vị trí cần hiển thị &rarr; bấm <strong>Insert Merge Field</strong> &rarr; chọn trường tương ứng.</li>
                    <li>Bấm <strong>Preview Results</strong> để xem trước kết quả trộn thư cho từng bản ghi.</li>
                    <li>Bấm <strong>Finish &amp; Merge</strong> &rarr; <strong>Edit Individual Documents</strong> để xuất tài liệu hoàn chỉnh.</li>
                  </ol>
                </div>
              </div>
            )}

            {selectedLesson === 5 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Chủ đề 5</span>
                <h2 className="text-2xl font-bold text-slate-900">Định dạng trang in & Đánh số trang</h2>
                <div className="text-slate-700 text-sm sm:text-base space-y-3 leading-relaxed">
                  <p>
                    Quy định căn lề trang giấy A4 văn bản quản lý nhà nước:
                  </p>
                  <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-sm">
                    <div className="grid grid-cols-2 gap-2 text-slate-800">
                      <div>&bull; Lề trên (Top): <strong>20 - 25 mm (2.0 - 2.5 cm)</strong></div>
                      <div>&bull; Lề dưới (Bottom): <strong>20 - 25 mm (2.0 - 2.5 cm)</strong></div>
                      <div>&bull; Lề trái (Left): <strong>30 - 35 mm (3.0 - 3.5 cm)</strong></div>
                      <div>&bull; Lề phải (Right): <strong>15 - 20 mm (1.5 - 2.0 cm)</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PHÍM TẮT ================= */}
      {activeTab === 'shortcuts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Tìm phím tắt (vd: Ctrl+S, in đậm, căn lề...)"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Đang hiển thị {filteredShortcuts.length} phím tắt thông dụng
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShortcuts.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-slate-700 text-sm font-medium">{item.desc}</p>
                </div>
                <kbd className="shrink-0 bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-sm">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: TRẮC NGHIỆM ================= */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Trắc nghiệm nhanh kiểm tra kiến thức Word</h2>
              <p className="text-slate-500 text-xs sm:text-sm">5 câu hỏi trích từ ngân hàng đề thi chuẩn CNTT cơ bản</p>
            </div>
            {submittedQuiz && (
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                Làm lại
              </button>
            )}
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, qIndex) => {
              const isAnswered = userAnswers[qIndex] !== undefined;
              const isCorrect = userAnswers[qIndex] === q.correct;

              return (
                <div key={qIndex} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <h4 className="font-semibold text-slate-800 text-base">
                    Câu {qIndex + 1}: {q.question}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = userAnswers[qIndex] === optIndex;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300';

                      if (submittedQuiz) {
                        if (optIndex === q.correct) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-50 border-red-500 text-red-800';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-blue-600 border-blue-600 text-white font-semibold shadow-sm';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectAnswer(qIndex, optIndex)}
                          className={`text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submittedQuiz && optIndex === q.correct && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                          {submittedQuiz && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submittedQuiz && (
                    <div className="mt-2 text-xs text-blue-800 bg-blue-50 p-3 rounded-xl border border-blue-200">
                      <strong>Giải thích:</strong> {q.explain}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Đã trả lời {Object.keys(userAnswers).length}/{quizQuestions.length} câu hỏi
            </span>

            {!submittedQuiz ? (
              <button
                onClick={handleGradeQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
              >
                Nộp bài &amp; Chấm điểm
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800 text-sm sm:text-base">
                  Điểm số: {Object.values(userAnswers).filter((ans, idx) => ans === quizQuestions[idx].correct).length * 2} / 10
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                  +
                  {Object.values(userAnswers).filter((ans, idx) => ans === quizQuestions[idx].correct).length * 20}{' '}
                  điểm tích lũy
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: MÔ PHỎNG SOẠN THẢO ================= */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Mô phỏng Thanh công cụ &amp; Căn lề văn bản Word</h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Trải nghiệm thực hành căn lề, định dạng phông chữ, in đậm, in nghiêng và đổi màu văn bản trực tiếp
            </p>
          </div>

          {/* Mini Toolbar */}
          <div className="bg-slate-100 p-2.5 rounded-2xl flex flex-wrap items-center gap-2 border border-slate-200">
            {/* Bold */}
            <button
              onClick={() => setIsBold(!isBold)}
              className={`p-2 rounded-lg text-sm font-bold transition-colors ${
                isBold ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
              title="Ctrl + B (Bold)"
            >
              B
            </button>

            {/* Italic */}
            <button
              onClick={() => setIsItalic(!isItalic)}
              className={`p-2 rounded-lg text-sm italic font-serif transition-colors ${
                isItalic ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
              title="Ctrl + I (Italic)"
            >
              I
            </button>

            {/* Underline */}
            <button
              onClick={() => setIsUnderline(!isUnderline)}
              className={`p-2 rounded-lg text-sm underline transition-colors ${
                isUnderline ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
              title="Ctrl + U (Underline)"
            >
              U
            </button>

            <div className="h-6 w-px bg-slate-300 mx-1" />

            {/* Alignment buttons */}
            <button
              onClick={() => setAlign('left')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                align === 'left' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              Căn trái
            </button>
            <button
              onClick={() => setAlign('center')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                align === 'center' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              Căn giữa
            </button>
            <button
              onClick={() => setAlign('right')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                align === 'right' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              Căn phải
            </button>
            <button
              onClick={() => setAlign('justify')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                align === 'justify' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              Căn đều 2 bên
            </button>

            <div className="h-6 w-px bg-slate-300 mx-1" />

            {/* Font size */}
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs">
              <span>Cỡ:</span>
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                className="px-1.5 font-bold hover:text-blue-600"
              >
                -
              </button>
              <span className="font-semibold">{fontSize}pt</span>
              <button
                onClick={() => setFontSize(Math.min(28, fontSize + 1))}
                className="px-1.5 font-bold hover:text-blue-600"
              >
                +
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
              {['#0F284B', '#DC2626', '#2563EB', '#16A34A'].map((col) => (
                <button
                  key={col}
                  onClick={() => setTextColor(col)}
                  className={`w-5 h-5 rounded-full border ${textColor === col ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          {/* Editable Virtual A4 Paper */}
          <div className="bg-slate-200 p-4 sm:p-8 rounded-2xl flex justify-center">
            <div className="bg-white shadow-xl rounded-lg w-full max-w-2xl min-h-[380px] p-8 border border-slate-200 flex flex-col">
              <textarea
                value={simText}
                onChange={(e) => setSimText(e.target.value)}
                style={{
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: isUnderline ? 'underline' : 'none',
                  textAlign: align,
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.7',
                }}
                className="w-full h-full min-h-[320px] bg-transparent resize-none focus:outline-none font-serif"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
