import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Search, Play, ChevronLeft, ChevronRight, Monitor, Sparkles, BookOpen } from 'lucide-react';
import { PowerPointIcon } from './OfficeIcons';

interface PowerPointModuleProps {
  onBack: () => void;
  onUpdateProgress: (points: number) => void;
}

const pptShortcuts = [
  { key: 'F5', desc: 'Bắt đầu trình chiếu từ slide đầu tiên' },
  { key: 'Shift + F5', desc: 'Bắt đầu trình chiếu từ slide hiện hành' },
  { key: 'Esc', desc: 'Thoát khỏi chế độ trình chiếu (End Show)' },
  { key: 'B (hoặc .)', desc: 'Làm đen màn hình tạm thời (Black Screen)' },
  { key: 'W (hoặc ,)', desc: 'Làm trắng màn hình tạm thời (White Screen)' },
  { key: 'Ctrl + P', desc: 'Chuyển con trỏ chuột thành bút vẽ (Pen tool)' },
  { key: 'Ctrl + A', desc: 'Chuyển bút vẽ lại thành mũi tên con trỏ chuẩn' },
  { key: 'Ctrl + E', desc: 'Bật công cụ tẩy xóa nét vẽ (Eraser)' },
  { key: 'Ctrl + M', desc: 'Chèn một Slide trắng mới vào bài trình chiếu' },
  { key: 'Ctrl + D', desc: 'Nhân đôi slide đang chọn (Duplicate Slide)' },
];

const pptQuestions = [
  {
    question: 'Để bắt đầu trình chiếu bài thuyết trình ngay từ slide hiện hành đang chỉnh sửa, phím tắt là gì?',
    options: ['F5', 'Shift + F5', 'Ctrl + F5', 'Alt + F5'],
    correct: 1,
    explain: 'Phím F5 trình chiếu từ slide đầu tiên, còn Shift + F5 trình chiếu ngay từ slide đang chọn.',
  },
  {
    question: 'Sự khác biệt cơ bản giữa Transition và Animation trong PowerPoint là gì?',
    options: [
      'Transition là hiệu ứng giữa các slide, Animation là hiệu ứng cho các đối tượng trong slide',
      'Transition cho âm thanh, Animation cho hình ảnh',
      'Không có sự khác biệt',
      'Animation diễn ra trước khi đổi trang slide',
    ],
    correct: 0,
    explain: 'Transitions là hiệu ứng chuyển trang giữa các slide; Animations là hiệu ứng cho chữ, hình vẽ hoặc biểu đồ nằm bên trong slide.',
  },
  {
    question: 'Tính năng Slide Master trong PowerPoint dùng để làm gì?',
    options: [
      'Chơi video tự động',
      'Thiết lập định dạng chuẩn chung (font chữ, logo, màu sắc) áp dụng đồng bộ cho tất cả các slide',
      'Đếm ngược thời gian thuyết trình',
      'Chèn bảng tính Excel',
    ],
    correct: 1,
    explain: 'Slide Master lưu trữ thông tin về chủ đề, bố cục, màu sắc và định dạng chuẩn để quản lý toàn bộ slide đồng nhất.',
  },
  {
    question: 'Quy tắc 6 x 6 trong thiết kế slide thuyết trình có ý nghĩa gì?',
    options: [
      'Slide nên có tối đa 6 dòng, mỗi dòng tối đa 6 từ',
      'Trình chiếu trong 6 phút với 6 slide',
      'Kích thước chữ tối thiểu là 6pt',
      'Có 6 bức ảnh trên 6 trang slide',
    ],
    correct: 0,
    explain: 'Quy tắc 6x6 giúp giữ slide ngắn gọn, súc tích, tránh quá tải chữ khiến người nghe khó theo dõi.',
  },
  {
    question: 'Trong khi đang trình chiếu, muốn làm tối đen màn hình để thu hút sự tập trung của khán giả về phía diễn giả, bấm phím nào?',
    options: ['Phím D', 'Phím B (Black)', 'Phím N', 'Phím S'],
    correct: 1,
    explain: 'Phím B (viết tắt của Black) sẽ làm đen toàn bộ màn hình; bấm lại B để trở về slide.',
  },
];

export const PowerPointModule: React.FC<PowerPointModuleProps> = ({ onBack, onUpdateProgress }) => {
  const [activeTab, setActiveTab] = useState<'player' | 'principles' | 'shortcuts' | 'quiz'>('player');

  // Interactive slide presentation state
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [theme, setTheme] = useState<'blue' | 'dark' | 'sunset'>('blue');

  const slides = [
    {
      title: 'Báo cáo Khảo sát Kỹ năng CNTT Cơ bản',
      subtitle: 'Hệ thống hỗ trợ đào tạo & thi sát hạch chuẩn quốc gia',
      presenter: 'Giảng viên hướng dẫn: ThS. CNTT',
      date: 'Năm học 2024 - 2025',
    },
    {
      title: 'Cấu trúc bài thi Chuẩn CNTT cơ bản',
      points: [
        'Phần 1: Lý thuyết trắc nghiệm trên máy tính (30 câu / 30 phút)',
        'Phần 2: Thực hành soạn thảo văn bản Microsoft Word (3.0 điểm)',
        'Phần 3: Thực hành xử lý bảng tính Microsoft Excel (4.0 điểm)',
        'Phần 4: Thực hành thiết kế bài thuyết trình PowerPoint (3.0 điểm)',
      ],
      tip: 'Điều kiện đạt: Cả 2 phần Lý thuyết và Thực hành đều >= 5.0 điểm.',
    },
    {
      title: 'Các nguyên tắc thiết kế Slide chuẩn',
      points: [
        'Độ tương phản cao giữa chữ và nền (Contrast)',
        'Quy tắc 6x6: Không tham lam dán toàn bộ văn bản lên slide',
        'Sử dụng hình ảnh và biểu đồ trực quan hóa dữ liệu',
        'Hiệu ứng chuyển tiếp tinh tế, không lạm dụng gây rối mắt',
      ],
      tip: 'Mục đích của slide là hỗ trợ diễn giả truyền tải thông điệp.',
    },
  ];

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const handleGradeQuiz = () => {
    setSubmittedQuiz(true);
    let correctCount = 0;
    pptQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) correctCount++;
    });
    onUpdateProgress(correctCount * 20);
  };

  const getThemeClasses = () => {
    if (theme === 'dark') return 'bg-slate-900 text-white border-slate-700';
    if (theme === 'sunset') return 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-orange-400';
    return 'bg-gradient-to-br from-blue-900 to-indigo-950 text-white border-blue-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Breadcrumb & Return Button */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-orange-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#D83B01] hover:text-[#b03001] bg-orange-50 hover:bg-orange-100/80 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <span>Trang chủ</span>
          <span>&gt;</span>
          <span className="font-semibold text-orange-800">PowerPoint - Trình chiếu cơ bản</span>
        </div>
      </div>

      {/* Module Hero Header */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <PowerPointIcon className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-3 py-1 rounded-full">
                Mô-đun Kỹ năng IU05
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold mt-2 tracking-tight">
                Microsoft PowerPoint Căn Bản
              </h1>
              <p className="text-orange-100 text-sm sm:text-base mt-1">
                Kỹ thuật thiết kế bố cục slide, hiệu ứng tương tác &amp; làm chủ kỹ năng thuyết trình tự tin
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white/15 p-1.5 rounded-2xl backdrop-blur-md border border-white/20">
            <button
              onClick={() => setActiveTab('player')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'player' ? 'bg-white text-orange-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Trình chiếu mô phỏng
            </button>
            <button
              onClick={() => setActiveTab('principles')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'principles' ? 'bg-white text-orange-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Nguyên tắc thiết kế
            </button>
            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'shortcuts' ? 'bg-white text-orange-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Phím tắt trình chiếu
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'quiz' ? 'bg-white text-orange-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Trắc nghiệm (5 câu)
            </button>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: SLIDE PLAYER MÔ PHỎNG ================= */}
      {activeTab === 'player' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-orange-600" />
                <span>Trình phát bài thuyết trình tương tác</span>
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Trải nghiệm chuyển trang, quan sát bố cục và thay đổi giao diện bài thuyết trình
              </p>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Chủ đề mẫu:</span>
              <button
                onClick={() => setTheme('blue')}
                className={`w-6 h-6 rounded-full bg-blue-900 border-2 ${theme === 'blue' ? 'border-orange-500 scale-110' : 'border-white'}`}
                title="Chủ đề Xanh học thuật"
              />
              <button
                onClick={() => setTheme('sunset')}
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 border-2 ${theme === 'sunset' ? 'border-orange-500 scale-110' : 'border-white'}`}
                title="Chủ đề Hoàng hôn năng động"
              />
              <button
                onClick={() => setTheme('dark')}
                className={`w-6 h-6 rounded-full bg-slate-900 border-2 ${theme === 'dark' ? 'border-orange-500 scale-110' : 'border-white'}`}
                title="Chủ đề Tối hiện đại"
              />
            </div>
          </div>

          {/* 16:9 Virtual Presentation Slide Viewport */}
          <div className="flex justify-center">
            <div className={`w-full max-w-4xl aspect-[16/9] rounded-2xl p-6 sm:p-12 shadow-2xl border flex flex-col justify-between transition-all duration-500 ${getThemeClasses()}`}>
              {/* Slide Content */}
              {currentSlide === 0 && (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-4 animate-fadeIn">
                  <span className="text-xs sm:text-sm tracking-widest uppercase font-semibold text-amber-300">
                    BÀI THUYẾT TRÌNH MẪU
                  </span>
                  <h3 className="text-xl sm:text-4xl font-extrabold max-w-2xl leading-tight">
                    {slides[0].title}
                  </h3>
                  <p className="text-sm sm:text-lg opacity-90 max-w-xl">
                    {slides[0].subtitle}
                  </p>
                  <div className="pt-6 text-xs sm:text-sm opacity-75 border-t border-white/20 w-48">
                    <p>{slides[0].presenter}</p>
                    <p>{slides[0].date}</p>
                  </div>
                </div>
              )}

              {currentSlide === 1 && (
                <div className="h-full flex flex-col justify-between animate-fadeIn">
                  <div>
                    <h3 className="text-lg sm:text-3xl font-extrabold pb-3 border-b border-white/20">
                      {slides[1].title}
                    </h3>
                    <ul className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3 text-xs sm:text-base">
                      {slides[1].points?.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">&bull;</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl text-xs sm:text-sm text-amber-200 border border-white/15">
                    <strong>Lưu ý:</strong> {slides[1].tip}
                  </div>
                </div>
              )}

              {currentSlide === 2 && (
                <div className="h-full flex flex-col justify-between animate-fadeIn">
                  <div>
                    <h3 className="text-lg sm:text-3xl font-extrabold pb-3 border-b border-white/20">
                      {slides[2].title}
                    </h3>
                    <ul className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3 text-xs sm:text-base">
                      {slides[2].points?.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">&bull;</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl text-xs sm:text-sm text-amber-200 border border-white/15">
                    <strong>Châm ngôn:</strong> {slides[2].tip}
                  </div>
                </div>
              )}

              {/* Slide Footer */}
              <div className="flex items-center justify-between text-[11px] sm:text-xs opacity-60 pt-4">
                <span>Khoa Công nghệ thông tin</span>
                <span>Slide {currentSlide + 1} / {slides.length}</span>
              </div>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-between max-w-4xl mx-auto pt-2">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Slide trước</span>
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === i ? 'w-8 bg-orange-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-40 transition-colors"
            >
              <span>Slide tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: NGUYÊN TẮC THIẾT KẾ ================= */}
      {activeTab === 'principles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Quy tắc 6 x 6</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Mỗi slide không nên có quá 6 gạch đầu dòng và mỗi dòng không quá 6 từ.
              Slide là công cụ nhắc nhở ý chính, không phải tài liệu phát tay (Handout) để khán giả đọc thụ động.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Độ tương phản &amp; Phông chữ</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dùng phông chữ không chân (Sans-serif) như Arial, Calibri, Segoe UI để dễ đọc từ xa qua máy chiếu.
              Luôn đảm bảo chữ sáng trên nền tối hoặc chữ tối trên nền sáng. Tránh dùng chữ vàng trên nền trắng.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Thiết lập Slide Master chuẩn</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Vào <strong>View &rarr; Slide Master</strong> để chèn logo trường, số trang tự động và định dạng tiêu đề.
              Tất cả các slide con sẽ tự động kế thừa mà không cần chỉnh sửa thủ công từng trang.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Hiệu ứng tinh tế (Animations)</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Chỉ dùng hiệu ứng xuất hiện đơn giản (Fade, Wipe, Appear) để dẫn dắt sự chú ý của người nghe.
              Tuyệt đối tránh các hiệu ứng xoay tròn, lộn nhào (Spin, Bounce) gây mất tập trung trong các bài báo cáo chuyên nghiệp.
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB 3: PHÍM TẮT ================= */}
      {activeTab === 'shortcuts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pptShortcuts.map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-slate-700 text-sm font-medium">{s.desc}</p>
              </div>
              <kbd className="shrink-0 bg-orange-50 text-orange-700 border border-orange-200 font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 4: TRẮC NGHIỆM ================= */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Trắc nghiệm kiểm tra kiến thức PowerPoint</h2>
              <p className="text-slate-500 text-xs sm:text-sm">5 câu hỏi thường gặp trong đề thi chuẩn CNTT cơ bản</p>
            </div>
            {submittedQuiz && (
              <button
                onClick={() => {
                  setUserAnswers({});
                  setSubmittedQuiz(false);
                }}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
              >
                Làm lại
              </button>
            )}
          </div>

          <div className="space-y-6">
            {pptQuestions.map((q, qIndex) => {
              const isAnswered = userAnswers[qIndex] !== undefined;
              const isCorrect = userAnswers[qIndex] === q.correct;

              return (
                <div key={qIndex} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <h4 className="font-semibold text-slate-800 text-base">
                    Câu {qIndex + 1}: {q.question}
                  </h4>
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = userAnswers[qIndex] === optIndex;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-300';

                      if (submittedQuiz) {
                        if (optIndex === q.correct) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-50 border-red-500 text-red-800';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-orange-600 border-orange-600 text-white font-semibold shadow-sm';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => !submittedQuiz && setUserAnswers({ ...userAnswers, [qIndex]: optIndex })}
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
                    <div className="mt-2 text-xs text-orange-800 bg-orange-50 p-3 rounded-xl border border-orange-200">
                      <strong>Giải thích:</strong> {q.explain}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Đã trả lời {Object.keys(userAnswers).length}/{pptQuestions.length} câu hỏi
            </span>

            {!submittedQuiz ? (
              <button
                onClick={handleGradeQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
              >
                Nộp bài &amp; Chấm điểm
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800 text-sm sm:text-base">
                  Điểm số: {Object.values(userAnswers).filter((ans, idx) => ans === pptQuestions[idx].correct).length * 2} / 10
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                  +
                  {Object.values(userAnswers).filter((ans, idx) => ans === pptQuestions[idx].correct).length * 20}{' '}
                  điểm tích lũy
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
