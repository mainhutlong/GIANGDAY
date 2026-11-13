import React, { useState, useEffect } from 'react';
import { X, Clock, Award, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface MockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateScore: (score: number) => void;
}

const mockQuestions = [
  { id: 1, q: 'Một Gigabyte (GB) tương đương với bao nhiêu Megabyte (MB)?', opts: ['1000 MB', '1024 MB', '1000 KB', '1024 KB'], ans: 1, exp: '1 GB = 1024 MB theo hệ thống số nhị phân.' },
  { id: 2, q: 'Thiết bị nào sau đây vừa là thiết bị vào (Input), vừa là thiết bị ra (Output)?', opts: ['Chuột máy tính', 'Bàn phím', 'Màn hình cảm ứng', 'Máy in'], ans: 2, exp: 'Màn hình cảm ứng vừa nhận thao tác chạm (Input) vừa hiển thị hình ảnh (Output).' },
  { id: 3, q: 'Trong hệ điều hành Windows, phím tắt nào dùng để chụp toàn bộ màn hình vào bộ nhớ đệm Clipboard?', opts: ['Print Screen (PrtScn)', 'Ctrl + C', 'Alt + P', 'F11'], ans: 0, exp: 'Phím PrtScn chụp toàn bộ màn hình hiện hành.' },
  { id: 4, q: 'Phần mềm Unikey là phần mềm thuộc loại nào?', opts: ['Phần mềm diệt virus', 'Phần mềm hỗ trợ gõ tiếng Việt', 'Phần mềm nén tệp tin', 'Hệ điều hành'], ans: 1, exp: 'Unikey là bộ gõ tiếng Việt mã nguồn mở phổ biến nhất.' },
  { id: 5, q: 'Để chuyển đổi qua lại nhanh chóng giữa các cửa sổ ứng dụng đang mở trong Windows, ta dùng tổ hợp phím nào?', opts: ['Ctrl + Tab', 'Alt + Tab', 'Shift + Tab', 'Windows + D'], ans: 1, exp: 'Alt + Tab mở trình chuyển tác vụ Task Switcher.' },
  { id: 6, q: 'Trong Microsoft Word, tổ hợp phím Ctrl + B dùng để làm gì?', opts: ['In đậm văn bản', 'In nghiêng văn bản', 'Gạch chân văn bản', 'Sao chép văn bản'], ans: 0, exp: 'Ctrl + B bật / tắt định dạng Bold (In đậm).' },
  { id: 7, q: 'Trong Word, để căn lề giữa cho đoạn văn bản, ta dùng phím tắt nào?', opts: ['Ctrl + L', 'Ctrl + R', 'Ctrl + E', 'Ctrl + J'], ans: 2, exp: 'Ctrl + E (Center) dùng để căn giữa đoạn văn bản.' },
  { id: 8, q: 'Trong Word, để tìm kiếm và thay thế một từ hoặc cụm từ, phím tắt là gì?', opts: ['Ctrl + F', 'Ctrl + H', 'Ctrl + K', 'Ctrl + G'], ans: 1, exp: 'Ctrl + H mở hộp thoại Find & Replace.' },
  { id: 9, q: 'Để tạo một bảng biểu (Table) trong Word, ta vào thẻ nào?', opts: ['Thẻ Home', 'Thẻ Insert', 'Thẻ Design', 'Thẻ Layout'], ans: 1, exp: 'Thẻ Insert chứa nhóm lệnh Tables để chèn bảng.' },
  { id: 10, q: 'Trong Word, để ngắt trang bắt buộc sang trang mới, phím tắt chuẩn là gì?', opts: ['Shift + Enter', 'Alt + Enter', 'Ctrl + Enter', 'Tab + Enter'], ans: 2, exp: 'Ctrl + Enter chèn một Page Break ngắt trang tức thì.' },
  { id: 11, q: 'Trong Excel, địa chỉ $C$5 được gọi là loại địa chỉ nào?', opts: ['Địa chỉ tương đối', 'Địa chỉ hỗn hợp', 'Địa chỉ tuyệt đối', 'Địa chỉ vùng'], ans: 2, exp: 'Dấu $ trước cả tên cột và chỉ số dòng là địa chỉ tuyệt đối cố định.' },
  { id: 12, q: 'Trong Excel, công thức =SUM(3, 5, 2) cho kết quả là bao nhiêu?', opts: ['10', '15', '30', 'Lỗi #VALUE!'], ans: 0, exp: 'Hàm SUM cộng 3 + 5 + 2 = 10.' },
  { id: 13, q: 'Để đếm số lượng học sinh có điểm thi >= 5 trong danh sách từ C2:C30, ta dùng hàm nào?', opts: ['=COUNT(C2:C30)', '=COUNTA(C2:C30)', '=COUNTIF(C2:C30, ">=5")', '=SUMIF(C2:C30, ">=5")'], ans: 2, exp: 'COUNTIF dùng để đếm theo một điều kiện cụ thể.' },
  { id: 14, q: 'Kết quả của công thức =LEFT("TINHOC", 3) trong Excel là gì?', opts: ['TIN', 'HOC', 'NHOC', 'T'], ans: 0, exp: 'LEFT trích xuất 3 ký tự đầu tiên từ bên trái chuỗi.' },
  { id: 15, q: 'Khi sao chép công thức chứa ô C4 xuống dưới 1 hàng, địa chỉ C4 sẽ đổi thành gì?', opts: ['C5', 'D4', 'C4', '$C$4'], ans: 0, exp: 'Địa chỉ tương đối tăng dần chỉ số dòng khi kéo xuống dưới.' },
  { id: 16, q: 'Trong PowerPoint, phím nào dùng để trình chiếu toàn màn hình từ slide đầu tiên?', opts: ['F1', 'F3', 'F5', 'Shift + F5'], ans: 2, exp: 'Phím F5 bắt đầu trình chiếu từ slide đầu.' },
  { id: 17, q: 'Muốn chèn thêm một slide mới vào bài thuyết trình PowerPoint, dùng phím tắt nào?', opts: ['Ctrl + N', 'Ctrl + M', 'Ctrl + S', 'Ctrl + Shift + N'], ans: 1, exp: 'Ctrl + M chèn New Slide, trong khi Ctrl + N tạo bài thuyết trình mới.' },
  { id: 18, q: 'Hiệu ứng chuyển động giữa các slide trong PowerPoint gọi là gì?', opts: ['Animations', 'Transitions', 'SmartArt', 'WordArt'], ans: 1, exp: 'Transitions là hiệu ứng chuyển tiếp giữa các slide.' },
  { id: 19, q: 'Trong PowerPoint, tính năng Slide Master dùng để làm gì?', opts: ['Chèn video từ Youtube', 'Định dạng chung cho toàn bộ các slide trong bài', 'Ghi âm giọng nói', 'In slide ra giấy'], ans: 1, exp: 'Slide Master giúp áp dụng bố cục, hình nền, phông chữ đồng bộ.' },
  { id: 20, q: 'Giao thức chuẩn nào dùng để truyền tải trang web an toàn có mã hóa?', opts: ['HTTP', 'HTTPS', 'FTP', 'SMTP'], ans: 1, exp: 'HTTPS (Hypertext Transfer Protocol Secure) mã hóa dữ liệu với chứng chỉ SSL/TLS.' },
  { id: 21, q: 'Tên miền nào sau đây thường dùng cho các cơ quan, tổ chức chính phủ tại Việt Nam?', opts: ['.edu.vn', '.gov.vn', '.com.vn', '.org.vn'], ans: 1, exp: '.gov.vn là tên miền quy định riêng cho cơ quan nhà nước.' },
  { id: 22, q: 'Trong thư điện tử Email, mục BCC (Blind Carbon Copy) có ý nghĩa gì?', opts: ['Gửi bản sao công khai cho mọi người cùng biết', 'Gửi bản sao ẩn danh, những người khác không thấy địa chỉ này', 'Chỉ gửi tệp đính kèm lớn', 'Đánh dấu thư quan trọng'], ans: 1, exp: 'BCC gửi bản sao ẩn danh bảo mật danh sách người nhận.' },
  { id: 23, q: 'Hành vi nào sau đây giúp phòng tránh nhiễm virus máy tính và mã độc tốt nhất?', opts: ['Không cài đặt mật khẩu cho máy tính', 'Không bao giờ quét virus USB', 'Cập nhật hệ điều hành và không mở tệp lạ từ email không rõ nguồn gốc', 'Tắt tường lửa Windows'], ans: 2, exp: 'Cập nhật bản vá bảo mật và cảnh giác trước tệp lạ là quy tắc hàng đầu.' },
  { id: 24, q: 'Trong Excel, hàm =AND(5 > 2, 3 < 1) trả về kết quả là gì?', opts: ['TRUE', 'FALSE', '#VALUE!', '1'], ans: 1, exp: 'Hàm AND chỉ trả về TRUE khi TẤT CẢ các điều kiện con đều đúng. Vì 3 < 1 là sai nên hàm trả về FALSE.' },
  { id: 25, q: 'Khi gõ tiếng Việt kiểu Telex, để được chữ "đ", ta gõ thế nào?', opts: ['dd', 'dw', 'd8', 'da'], ans: 0, exp: 'Gõ "dd" trong bảng mã Telex tạo thành chữ "đ".' },
  { id: 26, q: 'Trong Word, để bôi đen toàn bộ văn bản một cách nhanh nhất, ta dùng phím tắt nào?', opts: ['Ctrl + A', 'Ctrl + S', 'Ctrl + D', 'Ctrl + F'], ans: 0, exp: 'Ctrl + A (Select All) chọn toàn bộ nội dung tài liệu.' },
  { id: 27, q: 'Trong Excel, hàm VLOOKUP tìm kiếm giá trị ở cột nào của bảng tham chiếu?', opts: ['Cột cuối cùng', 'Cột đầu tiên bên trái', 'Bất kỳ cột nào', 'Cột ở chính giữa'], ans: 1, exp: 'VLOOKUP luôn tra cứu dữ liệu tại cột đầu tiên bên trái của bảng.' },
  { id: 28, q: 'Tệp tin có phần mở rộng .xlsx là tệp của phần mềm nào?', opts: ['Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint', 'Microsoft Access'], ans: 1, exp: '.xlsx là định dạng tệp chuẩn của Microsoft Excel từ bản 2007 trở lên.' },
  { id: 29, q: 'Trong PowerPoint, để kết thúc bài trình chiếu ngay lập tức, ta nhấn phím nào?', opts: ['Enter', 'Space', 'Esc', 'Tab'], ans: 2, exp: 'Phím Esc thoát khỏi chế độ toàn màn hình Slide Show.' },
  { id: 30, q: 'Thời gian thi chuẩn phần lý thuyết Chuẩn CNTT cơ bản quốc gia là bao nhiêu phút?', opts: ['15 phút', '30 phút', '45 phút', '60 phút'], ans: 1, exp: 'Quy chế thi lý thuyết quốc gia là 30 câu hỏi trắc nghiệm trong thời gian 30 phút.' },
];

export const MockExamModal: React.FC<MockExamModalProps> = ({ isOpen, onClose, onUpdateScore }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [id: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 mins
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (optIndex: number) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentIdx]: optIndex });
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    let correct = 0;
    mockQuestions.forEach((q, idx) => {
      if (answers[idx] === q.ans) correct++;
    });
    const finalScore = Number(((correct / 30) * 10).toFixed(1));
    onUpdateScore(finalScore);
  };

  const handleRetake = () => {
    setAnswers({});
    setTimeLeft(1800);
    setIsSubmitted(false);
    setCurrentIdx(0);
  };

  const currentQ = mockQuestions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const correctCount = mockQuestions.filter((q, i) => answers[i] === q.ans).length;
  const finalScore = ((correctCount / 30) * 10).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="bg-[#7C3AED] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Award className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Đề Thi Thử Chuẩn CNTT Cơ Bản</h2>
              <p className="text-purple-200 text-xs sm:text-sm">
                30 câu trắc nghiệm &bull; Thời gian: 30 phút &bull; Chuẩn Bộ Thông tin &amp; Truyền thông
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-900/60 px-4 py-2 rounded-2xl border border-purple-400/30">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="font-mono font-bold text-base text-amber-300">
                {formatTime(timeLeft)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-purple-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Exam Split Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Question Viewport (Left 8 cols) */}
          <div className="lg:col-span-8 p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full">
                  Câu hỏi {currentIdx + 1} / 30
                </span>
                <span className="text-xs text-slate-500">
                  {answers[currentIdx] !== undefined ? 'Đã trả lời' : 'Chưa trả lời'}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQ.q}
              </h3>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.opts.map((opt, oIdx) => {
                  const isSelected = answers[currentIdx] === oIdx;
                  let style = 'bg-white border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-300';

                  if (isSubmitted) {
                    if (oIdx === currentQ.ans) {
                      style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isSelected && oIdx !== currentQ.ans) {
                      style = 'bg-red-50 border-red-500 text-red-900';
                    }
                  } else if (isSelected) {
                    style = 'bg-purple-600 border-purple-600 text-white font-semibold shadow-sm';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(oIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base transition-all flex items-center justify-between ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSubmitted && oIdx === currentQ.ans && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isSubmitted && isSelected && oIdx !== currentQ.ans && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs sm:text-sm text-purple-900">
                  <strong>Giải thích đáp án:</strong> {currentQ.exp}
                </div>
              )}
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
              >
                &larr; Câu trước
              </button>

              <button
                onClick={() => setCurrentIdx(Math.min(29, currentIdx + 1))}
                disabled={currentIdx === 29}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40"
              >
                Câu tiếp theo &rarr;
              </button>
            </div>
          </div>

          {/* Right Navigation & Score (4 cols) */}
          <div className="lg:col-span-4 p-5 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-sm">Bảng câu hỏi</h4>
                <span className="text-xs text-slate-500 font-medium">
                  Đã làm {answeredCount}/30
                </span>
              </div>

              {/* Grid 30 buttons */}
              <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
                {mockQuestions.map((_, i) => {
                  const isCurrent = currentIdx === i;
                  const hasAnswer = answers[i] !== undefined;
                  const isCorrect = answers[i] === mockQuestions[i].ans;

                  let color = 'bg-white text-slate-700 border-slate-200';
                  if (isSubmitted) {
                    color = isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-red-500 text-white border-red-600';
                  } else if (hasAnswer) {
                    color = 'bg-purple-100 text-purple-900 border-purple-300 font-bold';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`h-9 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${color} ${
                        isCurrent ? 'ring-2 ring-purple-600 ring-offset-1 font-bold scale-105' : ''
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              {/* Result Summary if Submitted */}
              {isSubmitted && (
                <div className="p-4 bg-white rounded-2xl border border-purple-200 shadow-sm space-y-2 text-center">
                  <span className="text-xs uppercase font-bold text-purple-700">Kết quả bài thi</span>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {finalScore} <span className="text-base text-slate-500 font-normal">/ 10</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Số câu đúng: <strong className="text-emerald-600">{correctCount}</strong> / 30 câu
                  </p>
                  <div className="pt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        Number(finalScore) >= 5.0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {Number(finalScore) >= 5.0 ? 'ĐẠT CHUẨN KỸ NĂNG' : 'CHƯA ĐẠT (CẦN ÔN THÊM)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Submit / Retake Button */}
            <div className="pt-4 border-t border-slate-200">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitTest}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-all"
                >
                  Nộp bài thi ngay
                </button>
              ) : (
                <button
                  onClick={handleRetake}
                  className="w-full py-3 bg-[#0F284B] hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Làm lại đề thi</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
