import React, { useState, useEffect } from 'react';
import { X, Gamepad2, Trophy, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

interface InteractiveGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScore: (points: number) => void;
}

const shortcutPairs = [
  { id: '1', key: 'Ctrl + S', meaning: 'Lưu tệp tin' },
  { id: '2', key: 'Ctrl + B', meaning: 'In đậm (Bold)' },
  { id: '3', key: 'Ctrl + Z', meaning: 'Hoàn tác (Undo)' },
  { id: '4', key: 'Ctrl + E', meaning: 'Căn giữa (Center)' },
  { id: '5', key: 'F5', meaning: 'Trình chiếu slide' },
  { id: '6', key: '=SUM(...)', meaning: 'Tính tổng trong Excel' },
];

export const InteractiveGamesModal: React.FC<InteractiveGamesModalProps> = ({
  isOpen,
  onClose,
  onAddScore,
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>('Chọn 1 phím tắt và ghép với ý nghĩa tương ứng!');

  // Shuffled lists
  const [shuffledKeys, setShuffledKeys] = useState<{ id: string; key: string }[]>([]);
  const [shuffledMeanings, setShuffledMeanings] = useState<{ id: string; meaning: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      initGame();
    }
  }, [isOpen]);

  const initGame = () => {
    setMatchedPairs([]);
    setSelectedKey(null);
    setSelectedMeaning(null);
    setScore(0);
    setMessage('Chọn 1 phím tắt và ghép với ý nghĩa tương ứng!');
    setShuffledKeys([...shortcutPairs].sort(() => Math.random() - 0.5));
    setShuffledMeanings([...shortcutPairs].sort(() => Math.random() - 0.5));
  };

  const handleKeyClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedKey(id);

    if (selectedMeaning) {
      checkMatch(id, selectedMeaning);
    }
  };

  const handleMeaningClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedMeaning(id);

    if (selectedKey) {
      checkMatch(selectedKey, id);
    }
  };

  const checkMatch = (keyId: string, meaningId: string) => {
    if (keyId === meaningId) {
      setMatchedPairs((prev) => [...prev, keyId]);
      setScore((prev) => prev + 20);
      onAddScore(20);
      setMessage('Chính xác! +20 điểm');
      setSelectedKey(null);
      setSelectedMeaning(null);

      if (matchedPairs.length + 1 === shortcutPairs.length) {
        setMessage('Xuất sắc! Bạn đã vượt qua tất cả các cặp phím tắt!');
      }
    } else {
      setMessage('Chưa đúng! Thử lại nào.');
      setTimeout(() => {
        setSelectedKey(null);
        setSelectedMeaning(null);
      }, 700);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-[#F59E0B] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-600/30 rounded-xl">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Trò Chơi Nối Phím Tắt Thần Tốc</h2>
              <p className="text-amber-100 text-xs sm:text-sm">
                Rèn luyện phản xạ ghi nhớ phím tắt Word, Excel, PowerPoint
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-amber-100 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Game Area */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-slate-800 text-sm">Điểm số: {score}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-amber-900">{message}</p>
            <button
              onClick={initGame}
              className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Chơi lại</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Column 1: Shortcuts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                Phím tắt
              </h4>
              {shuffledKeys.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedKey === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleKeyClick(item.id)}
                    className={`w-full p-4 rounded-2xl border text-sm font-mono font-bold transition-all flex items-center justify-between ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60'
                        : isSelected
                        ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    <span>{item.key}</span>
                    {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {/* Column 2: Meanings */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                Chức năng
              </h4>
              {shuffledMeanings.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedMeaning === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleMeaningClick(item.id)}
                    className={`w-full p-4 rounded-2xl border text-sm font-medium transition-all flex items-center justify-between ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60'
                        : isSelected
                        ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    <span>{item.meaning}</span>
                    {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
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
