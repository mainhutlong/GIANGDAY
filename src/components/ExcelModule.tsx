import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Search, Calculator, Table, BookOpen } from 'lucide-react';
import { ExcelIcon } from './OfficeIcons';

interface ExcelModuleProps {
  onBack: () => void;
  onUpdateProgress: (points: number) => void;
}

const excelFunctions = [
  { name: 'SUM', syntax: '=SUM(number1, [number2], ...)', desc: 'Tính tổng tất cả các số trong phạm vi ô được chỉ định', example: '=SUM(C2:C10)' },
  { name: 'AVERAGE', syntax: '=AVERAGE(number1, [number2], ...)', desc: 'Tính trung bình cộng các giá trị số trong danh sách', example: '=AVERAGE(D2:D10)' },
  { name: 'MIN / MAX', syntax: '=MIN(range) / =MAX(range)', desc: 'Tìm giá trị nhỏ nhất / lớn nhất trong một vùng dữ liệu', example: '=MAX(E2:E20)' },
  { name: 'COUNT / COUNTA', syntax: '=COUNT(range) / =COUNTA(range)', desc: 'COUNT: Đếm các ô chứa số. COUNTA: Đếm các ô không rỗng', example: '=COUNT(B2:B50)' },
  { name: 'IF', syntax: '=IF(logical_test, value_if_true, value_if_false)', desc: 'Kiểm tra một điều kiện logic, trả về giá trị nếu đúng hoặc sai', example: '=IF(G2>=5, "Đậu", "Rớt")' },
  { name: 'SUMIF', syntax: '=SUMIF(range, criteria, [sum_range])', desc: 'Tính tổng các ô thỏa mãn một điều kiện nhất định', example: '=SUMIF(B2:B20, "Nhập", D2:D20)' },
  { name: 'COUNTIF', syntax: '=COUNTIF(range, criteria)', desc: 'Đếm số lượng ô thỏa mãn một điều kiện cho trước', example: '=COUNTIF(E2:E30, ">=8")' },
  { name: 'VLOOKUP', syntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])', desc: 'Tìm kiếm một giá trị theo cột đầu tiên của bảng và lấy dữ liệu tương ứng', example: '=VLOOKUP(A2, $H$2:$J$10, 2, 0)' },
  { name: 'LEFT / RIGHT / MID', syntax: '=LEFT(text, num_chars) / RIGHT(...) / MID(...)', desc: 'Cắt chuỗi ký tự từ bên trái, bên phải hoặc ở giữa văn bản', example: '=LEFT(A2, 2)' },
];

const excelQuestions = [
  {
    question: 'Để cố định tuyệt đối cả dòng và cột của ô A1 khi sao chép công thức trong Excel, ta viết địa chỉ như thế nào?',
    options: ['$A1', 'A$1', '$A$1', '#A#1'],
    correct: 2,
    explain: '$A$1 là địa chỉ tuyệt đối, dùng phím F4 để chuyển đổi nhanh giữa các dạng địa chỉ.',
  },
  {
    question: 'Công thức nào sau đây dùng để đếm số ô chứa dữ liệu là SỐ trong vùng từ A1 đến A10?',
    options: ['=COUNTA(A1:A10)', '=COUNT(A1:A10)', '=COUNTBLANK(A1:A10)', '=SUM(A1:A10)'],
    correct: 1,
    explain: 'Hàm COUNT chỉ đếm các ô chứa giá trị số (Number), còn COUNTA đếm tất cả các ô không rỗng.',
  },
  {
    question: 'Trong bảng tính Excel, kết quả của công thức =IF(7 > 5, "Đúng", "Sai") là gì?',
    options: ['Đúng', 'Sai', '#VALUE!', 'TRUE'],
    correct: 0,
    explain: 'Vì biểu thức điều kiện 7 > 5 trả về kết quả Đúng (TRUE), nên hàm trả về đối số thứ hai là "Đúng".',
  },
  {
    question: 'Trong hàm VLOOKUP(lookup_value, table_array, col_index_num, range_lookup), tham số range_lookup bằng 0 mang ý nghĩa gì?',
    options: ['Tìm kiếm tương đối', 'Tìm kiếm chính xác tuyệt đối', 'Bỏ qua lỗi tìm kiếm', 'Tìm giá trị lớn nhất'],
    correct: 1,
    explain: 'Tham số range_lookup = 0 (hoặc FALSE) quy định tìm kiếm chính xác 100%.',
  },
  {
    question: 'Khi ô tính hiển thị lỗi #####, nguyên nhân chính thường là gì?',
    options: ['Sai cú pháp hàm', 'Độ rộng cột hẹp hơn nội dung số/ngày tháng', 'Chia cho số 0', 'Tên hàm bị sai chính tả'],
    correct: 1,
    explain: 'Lỗi ##### xuất hiện khi độ rộng của cột không đủ để hiển thị hết chữ số hoặc ngày tháng.',
  },
];

interface StudentRow {
  id: string;
  name: string;
  wordScore: number;
  excelScore: number;
  pptScore: number;
}

export const ExcelModule: React.FC<ExcelModuleProps> = ({ onBack, onUpdateProgress }) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'functions' | 'quiz'>('sheet');
  const [searchFn, setSearchFn] = useState<string>('');

  // Interactive spreadsheet state
  const [students, setStudents] = useState<StudentRow[]>([
    { id: 'HV01', name: 'Nguyễn Văn An', wordScore: 8.5, excelScore: 7.0, pptScore: 9.0 },
    { id: 'HV02', name: 'Trần Thị Bình', wordScore: 6.0, excelScore: 8.0, pptScore: 7.5 },
    { id: 'HV03', name: 'Lê Hoàng Cường', wordScore: 9.0, excelScore: 9.5, pptScore: 8.5 },
    { id: 'HV04', name: 'Phạm Thu Dung', wordScore: 4.5, excelScore: 5.0, pptScore: 6.0 },
    { id: 'HV05', name: 'Vũ Quốc Hùng', wordScore: 7.0, excelScore: 6.5, pptScore: 7.0 },
  ]);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const handleScoreChange = (index: number, field: 'wordScore' | 'excelScore' | 'pptScore', val: number) => {
    const updated = [...students];
    updated[index][field] = Math.max(0, Math.min(10, val));
    setStudents(updated);
  };

  const handleGradeQuiz = () => {
    setSubmittedQuiz(true);
    let correctCount = 0;
    excelQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) correctCount++;
    });
    onUpdateProgress(correctCount * 20);
  };

  const filteredFunctions = excelFunctions.filter(
    (f) =>
      f.name.toLowerCase().includes(searchFn.toLowerCase()) ||
      f.desc.toLowerCase().includes(searchFn.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Breadcrumb & Return Button */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#107C41] hover:text-[#0b5c30] bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <span>Trang chủ</span>
          <span>&gt;</span>
          <span className="font-semibold text-emerald-800">Excel - Bảng tính điện tử cơ bản</span>
        </div>
      </div>

      {/* Module Hero Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <ExcelIcon className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-3 py-1 rounded-full">
                Mô-đun Kỹ năng IU04
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold mt-2 tracking-tight">
                Microsoft Excel Căn Bản
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base mt-1">
                Làm chủ công thức, hàm thống kê, phân tích dữ liệu &amp; quản lý bảng tính chuyên nghiệp
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white/15 p-1.5 rounded-2xl backdrop-blur-md border border-white/20">
            <button
              onClick={() => setActiveTab('sheet')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'sheet' ? 'bg-white text-emerald-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Bảng tính tương tác
            </button>
            <button
              onClick={() => setActiveTab('functions')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'functions' ? 'bg-white text-emerald-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Cú pháp &amp; Hàm thường gặp
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'quiz' ? 'bg-white text-emerald-900 shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              Trắc nghiệm (5 câu)
            </button>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: BẢNG TÍNH EXCEL TƯƠNG TÁC ================= */}
      {activeTab === 'sheet' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-5 h-5 text-emerald-600" />
                <span>Bảng điểm mô phỏng công thức Excel</span>
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Bạn có thể sửa đổi điểm của các học viên để quan sát các hàm SUM, AVERAGE, IF tự động tính toán lại
              </p>
            </div>
            <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-200 self-start sm:self-auto">
              Công thức tự động kích hoạt
            </div>
          </div>

          {/* Interactive Spreadsheet Grid */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-emerald-700 text-white font-semibold">
                  <th className="p-3 border-r border-emerald-600 text-center w-12">#</th>
                  <th className="p-3 border-r border-emerald-600">Mã HV</th>
                  <th className="p-3 border-r border-emerald-600">Họ và tên</th>
                  <th className="p-3 border-r border-emerald-600 text-center">Word (0-10)</th>
                  <th className="p-3 border-r border-emerald-600 text-center">Excel (0-10)</th>
                  <th className="p-3 border-r border-emerald-600 text-center">PowerPoint (0-10)</th>
                  <th className="p-3 border-r border-emerald-600 text-center bg-emerald-800">
                    Tổng điểm (=SUM)
                  </th>
                  <th className="p-3 border-r border-emerald-600 text-center bg-emerald-800">
                    Điểm TB (=AVERAGE)
                  </th>
                  <th className="p-3 text-center bg-emerald-900">
                    Xếp loại (=IF)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((st, idx) => {
                  const total = (st.wordScore + st.excelScore + st.pptScore).toFixed(1);
                  const avg = ((st.wordScore + st.excelScore + st.pptScore) / 3).toFixed(1);
                  const avgNum = parseFloat(avg);
                  let rank = 'Yếu';
                  let rankColor = 'bg-red-100 text-red-800';

                  if (avgNum >= 8.0) {
                    rank = 'Giỏi';
                    rankColor = 'bg-emerald-100 text-emerald-800';
                  } else if (avgNum >= 6.5) {
                    rank = 'Khá';
                    rankColor = 'bg-blue-100 text-blue-800';
                  } else if (avgNum >= 5.0) {
                    rank = 'Trung bình';
                    rankColor = 'bg-amber-100 text-amber-800';
                  }

                  return (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-center text-slate-400 font-mono text-xs border-r border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="p-3 font-mono font-medium text-slate-600 border-r border-slate-200">
                        {st.id}
                      </td>
                      <td className="p-3 font-medium text-slate-800 border-r border-slate-200">
                        {st.name}
                      </td>

                      {/* Word Score Input */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          value={st.wordScore}
                          onChange={(e) => handleScoreChange(idx, 'wordScore', parseFloat(e.target.value) || 0)}
                          className="w-16 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </td>

                      {/* Excel Score Input */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          value={st.excelScore}
                          onChange={(e) => handleScoreChange(idx, 'excelScore', parseFloat(e.target.value) || 0)}
                          className="w-16 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </td>

                      {/* PPT Score Input */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          value={st.pptScore}
                          onChange={(e) => handleScoreChange(idx, 'pptScore', parseFloat(e.target.value) || 0)}
                          className="w-16 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </td>

                      {/* Total */}
                      <td className="p-3 text-center font-bold text-slate-900 bg-emerald-50/50 border-r border-slate-200 font-mono">
                        {total}
                      </td>

                      {/* Average */}
                      <td className="p-3 text-center font-bold text-emerald-700 bg-emerald-50/50 border-r border-slate-200 font-mono">
                        {avg}
                      </td>

                      {/* Rank */}
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${rankColor}`}>
                          {rank}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Công thức SUM</span>
              <p className="font-mono text-sm text-emerald-950 font-bold mt-1">=SUM(D2:F2)</p>
              <p className="text-xs text-emerald-700 mt-1">Cộng dồn điểm 3 môn Word, Excel và PowerPoint</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Công thức AVERAGE</span>
              <p className="font-mono text-sm text-emerald-950 font-bold mt-1">=AVERAGE(D2:F2)</p>
              <p className="text-xs text-emerald-700 mt-1">Tính điểm trung bình cộng của học viên</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Công thức IF lồng</span>
              <p className="font-mono text-xs text-emerald-950 font-bold mt-1">=IF(H2&gt;=8,"Giỏi",IF(H2&gt;=6.5,"Khá",...))</p>
              <p className="text-xs text-emerald-700 mt-1">Xếp loại học lực tự động theo chuẩn quy chế</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TRA CỨU HÀM ================= */}
      {activeTab === 'functions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Tra cứu hàm (vd: IF, VLOOKUP, SUMIF...)"
                value={searchFn}
                onChange={(e) => setSearchFn(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Đang hiển thị {filteredFunctions.length} hàm trọng tâm kỳ thi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFunctions.map((fn, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    {fn.name}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Hàm chuẩn</span>
                </div>
                <p className="text-slate-700 text-sm font-medium pt-1">{fn.desc}</p>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto">
                  <strong>Cú pháp:</strong> {fn.syntax}
                </div>
                <div className="text-xs text-emerald-800">
                  <strong>Ví dụ thực tế:</strong> <code className="bg-emerald-50 px-1.5 py-0.5 rounded font-mono">{fn.example}</code>
                </div>
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
              <h2 className="text-xl font-bold text-slate-900">Trắc nghiệm kiểm tra kiến thức Excel</h2>
              <p className="text-slate-500 text-xs sm:text-sm">5 câu hỏi then chốt về công thức và địa chỉ ô trong Excel</p>
            </div>
            {submittedQuiz && (
              <button
                onClick={() => {
                  setUserAnswers({});
                  setSubmittedQuiz(false);
                }}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
              >
                Làm lại
              </button>
            )}
          </div>

          <div className="space-y-6">
            {excelQuestions.map((q, qIndex) => {
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
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300';

                      if (submittedQuiz) {
                        if (optIndex === q.correct) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-50 border-red-500 text-red-800';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-semibold shadow-sm';
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
                    <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <strong>Giải thích:</strong> {q.explain}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Đã trả lời {Object.keys(userAnswers).length}/{excelQuestions.length} câu hỏi
            </span>

            {!submittedQuiz ? (
              <button
                onClick={handleGradeQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
              >
                Nộp bài &amp; Chấm điểm
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800 text-sm sm:text-base">
                  Điểm số: {Object.values(userAnswers).filter((ans, idx) => ans === excelQuestions[idx].correct).length * 2} / 10
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
                  +
                  {Object.values(userAnswers).filter((ans, idx) => ans === excelQuestions[idx].correct).length * 20}{' '}
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
