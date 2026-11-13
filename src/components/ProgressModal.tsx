import React from 'react';
import { X, Award, CheckCircle2, TrendingUp, BookOpen, Clock, ShieldCheck } from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; id: string } | null;
  totalPoints: number;
  mockExamScore: number;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  user,
  totalPoints,
  mockExamScore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-[#0284C7] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-400/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Hồ Sơ &amp; Tiến Độ Học Tập</h2>
              <p className="text-sky-100 text-xs sm:text-sm">
                Theo dõi quá trình rèn luyện kỹ năng sử dụng CNTT cơ bản
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-sky-100 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User badge */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-[#0F284B] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {user ? user.name.charAt(0) : 'H'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {user ? user.name : 'Học viên vãng lai'}
              </h3>
              <p className="text-xs text-slate-500">
                Mã số học viên: <strong className="font-mono text-slate-700">{user ? user.id : 'HV-DEMO'}</strong>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  Đã kích hoạt khóa học
                </span>
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-100 text-center">
              <span className="text-xs text-sky-700 font-medium">Điểm tích lũy</span>
              <div className="text-2xl font-extrabold text-sky-900 mt-1">{totalPoints}</div>
            </div>
            <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-100 text-center">
              <span className="text-xs text-purple-700 font-medium">Điểm thi thử gần nhất</span>
              <div className="text-2xl font-extrabold text-purple-900 mt-1">
                {mockExamScore > 0 ? `${mockExamScore}/10` : 'Chưa thi'}
              </div>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 text-center">
              <span className="text-xs text-emerald-700 font-medium">Độ sẵn sàng thi</span>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">
                {mockExamScore >= 7.0 ? 'Rất cao (95%)' : mockExamScore >= 5.0 ? 'Khá (75%)' : 'Trung bình'}
              </div>
            </div>
          </div>

          {/* Module Progress */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tiến độ từng mô-đun
            </h4>

            {/* Word */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-blue-700">Microsoft Word (IU03)</span>
                <span className="text-slate-600">85% hoàn thành</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#0D62D9] h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Excel */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-700">Microsoft Excel (IU04)</span>
                <span className="text-slate-600">70% hoàn thành</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#107C41] h-full rounded-full" style={{ width: '70%' }} />
              </div>
            </div>

            {/* PowerPoint */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-orange-700">Microsoft PowerPoint (IU05)</span>
                <span className="text-slate-600">60% hoàn thành</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#D83B01] h-full rounded-full" style={{ width: '60%' }} />
              </div>
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
