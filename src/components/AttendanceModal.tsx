import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  X,
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  Upload,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Search,
  CheckCheck,
  Save,
  RotateCcw,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  birthDate?: string;
  note?: string;
}

export type AttendanceStatus = 'present' | 'excused' | 'absent' | 'late';

export interface AttendanceRecord {
  date: string;
  sessionName: string;
  records: Record<string, AttendanceStatus>;
  notes?: Record<string, string>;
}

export interface ClassItem {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  room?: string;
  students: Student[];
  attendanceHistory: AttendanceRecord[];
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CLASSES: ClassItem[] = [
  {
    id: 'CLASS-01',
    name: 'Lớp Tin học K20A - Ca Sáng',
    subject: 'Microsoft Word & Excel Căn Bản',
    createdAt: '10/11/2024',
    room: 'Phòng Máy 01',
    students: [
      { id: 'S1', studentCode: '2100101', fullName: 'Nguyễn Văn An', birthDate: '15/05/2003' },
      { id: 'S2', studentCode: '2100102', fullName: 'Trần Thị Mai', birthDate: '22/08/2003' },
      { id: 'S3', studentCode: '2100103', fullName: 'Lê Hoàng Long', birthDate: '10/12/2003' },
      { id: 'S4', studentCode: '2100104', fullName: 'Phạm Minh Tuấn', birthDate: '03/01/2003' },
      { id: 'S5', studentCode: '2100105', fullName: 'Võ Thị Thu Hà', birthDate: '18/09/2003' },
    ],
    attendanceHistory: [],
  },
  {
    id: 'CLASS-02',
    name: 'Lớp Tin học Thực hành K21B',
    subject: 'Microsoft PowerPoint & Báo cáo',
    createdAt: '08/11/2024',
    room: 'Phòng Máy 03',
    students: [
      { id: 'S6', studentCode: '2100201', fullName: 'Đỗ Đức Trọng', birthDate: '12/04/2003' },
      { id: 'S7', studentCode: '2100202', fullName: 'Hoàng Lan Anh', birthDate: '05/11/2003' },
      { id: 'S8', studentCode: '2100203', fullName: 'Bùi Gia Huy', birthDate: '27/07/2003' },
    ],
    attendanceHistory: [],
  },
];

export const AttendanceModal: React.FC<AttendanceModalProps> = ({ isOpen, onClose }) => {
  const [classes, setClasses] = useState<ClassItem[]>(() => {
    try {
      const saved = localStorage.getItem('giangday_attendance_classes');
      return saved ? JSON.parse(saved) : DEFAULT_CLASSES;
    } catch {
      return DEFAULT_CLASSES;
    }
  });

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isCreatingClass, setIsCreatingClass] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>('');
  const [newClassSubject, setNewClassSubject] = useState<string>('Microsoft Word');
  const [newClassRoom, setNewClassRoom] = useState<string>('Phòng máy 01');

  // Attendance Sheet state for active class
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [sessionName, setSessionName] = useState<string>('Buổi 1');
  const [currentRecords, setCurrentRecords] = useState<Record<string, AttendanceStatus>>({});
  const [currentNotes, setCurrentNotes] = useState<Record<string, string>>({});
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [importTargetClassId, setImportTargetClassId] = useState<string | null>(null);

  const excelInputRef = useRef<HTMLInputElement>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('giangday_attendance_classes', JSON.stringify(classes));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [classes]);

  // Load attendance records when selected class or date changes
  const activeClass = classes.find((c) => c.id === selectedClassId) || null;

  useEffect(() => {
    if (activeClass) {
      const existing = activeClass.attendanceHistory.find(
        (h) => h.date === selectedDate && h.sessionName === sessionName
      );
      if (existing) {
        setCurrentRecords(existing.records);
        setCurrentNotes(existing.notes || {});
      } else {
        // Default all to 'present'
        const initial: Record<string, AttendanceStatus> = {};
        activeClass.students.forEach((s) => {
          initial[s.id] = 'present';
        });
        setCurrentRecords(initial);
        setCurrentNotes({});
      }
    }
  }, [selectedClassId, selectedDate, sessionName, activeClass]);

  if (!isOpen) return null;

  // Create new class
  const handleCreateClass = () => {
    if (!newClassName.trim()) {
      alert('Vui lòng nhập tên lớp học!');
      return;
    }

    const newClass: ClassItem = {
      id: `CLASS-${Date.now()}`,
      name: newClassName.trim(),
      subject: newClassSubject,
      room: newClassRoom,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      students: [],
      attendanceHistory: [],
    };

    setClasses([newClass, ...classes]);
    setNewClassName('');
    setIsCreatingClass(false);
    setSelectedClassId(newClass.id);
  };

  // Delete class
  const handleDeleteClass = (classId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này và toàn bộ danh sách sinh viên?')) {
      const updated = classes.filter((c) => c.id !== classId);
      setClasses(updated);
      if (selectedClassId === classId) setSelectedClassId(null);
    }
  };

  // Import Excel File for specific class
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !importTargetClassId) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rows.length === 0) {
          alert('File Excel không có dữ liệu!');
          return;
        }

        // Find header row (search first 10 rows for columns)
        let headerRowIdx = 0;
        for (let i = 0; i < Math.min(10, rows.length); i++) {
          const rowStr = (rows[i] || []).join(' ').toLowerCase();
          if (rowStr.includes('mã') || rowStr.includes('tên') || rowStr.includes('mssv') || rowStr.includes('họ')) {
            headerRowIdx = i;
            break;
          }
        }

        const headers = (rows[headerRowIdx] || []).map((h) => String(h || '').trim().toLowerCase());
        const codeIdx = headers.findIndex((h) => h.includes('mã') || h.includes('mssv') || h.includes('code'));
        const nameIdx = headers.findIndex((h) => h.includes('họ') || h.includes('tên') || h.includes('name'));
        const birthIdx = headers.findIndex((h) => h.includes('sinh') || h.includes('ngày') || h.includes('birth'));
        const noteIdx = headers.findIndex((h) => h.includes('chú') || h.includes('lớp') || h.includes('note'));

        const parsedStudents: Student[] = [];
        for (let r = headerRowIdx + 1; r < rows.length; r++) {
          const row = rows[r];
          if (!row || row.length === 0) continue;

          const code = codeIdx >= 0 ? String(row[codeIdx] || '').trim() : '';
          const name = nameIdx >= 0 ? String(row[nameIdx] || '').trim() : (row[1] ? String(row[1]).trim() : '');
          const birth = birthIdx >= 0 ? String(row[birthIdx] || '').trim() : '';
          const note = noteIdx >= 0 ? String(row[noteIdx] || '').trim() : '';

          if (!name && !code) continue;

          parsedStudents.push({
            id: `STU-${Date.now()}-${r}`,
            studentCode: code || `SV${String(parsedStudents.length + 1).padStart(3, '0')}`,
            fullName: name || code,
            birthDate: birth,
            note,
          });
        }

        if (parsedStudents.length === 0) {
          alert('Không tìm thấy danh sách sinh viên hợp lệ trong file!');
          return;
        }

        // Update class
        setClasses((prev) =>
          prev.map((c) => {
            if (c.id === importTargetClassId) {
              return { ...c, students: parsedStudents };
            }
            return c;
          })
        );

        alert(`Đã import thành công ${parsedStudents.length} sinh viên từ file Excel!`);
      } catch (err) {
        console.error(err);
        alert('Có lỗi khi đọc file Excel. Vui lòng kiểm tra lại định dạng file!');
      }
    };
    reader.readAsArrayBuffer(file);
    if (e.target) e.target.value = '';
  };

  // Download sample Excel template
  const handleDownloadTemplate = () => {
    const wsData: any[][] = [
      ['STT', 'Mã Sinh Viên', 'Họ Và Tên', 'Ngày Sinh', 'Lớp Sinh Hoạt', 'Ghi Chú'],
      [1, '2100101', 'Nguyễn Văn An', '15/05/2003', 'K20-CNTT', ''],
      [2, '2100102', 'Trần Thị Mai', '22/08/2003', 'K20-CNTT', ''],
      [3, '2100103', 'Lê Hoàng Long', '10/12/2003', 'K20-CNTT', ''],
      [4, '2100104', 'Phạm Minh Tuấn', '03/01/2003', 'K20-CNTT', ''],
      [5, '2100105', 'Võ Thị Thu Hà', '18/09/2003', 'K20-CNTT', ''],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachSinhVien');
    XLSX.writeFile(wb, 'Mau_Danh_Sach_Sinh_Vien.xlsx');
  };

  // Save current attendance session
  const handleSaveAttendance = () => {
    if (!activeClass) return;

    const newRecord: AttendanceRecord = {
      date: selectedDate,
      sessionName,
      records: currentRecords,
      notes: currentNotes,
    };

    const updatedHistory = [
      ...activeClass.attendanceHistory.filter(
        (h) => !(h.date === selectedDate && h.sessionName === sessionName)
      ),
      newRecord,
    ];

    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === activeClass.id) {
          return { ...c, attendanceHistory: updatedHistory };
        }
        return c;
      })
    );

    alert(`Đã lưu bảng điểm danh ngày ${selectedDate} (${sessionName}) thành công!`);
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    if (!activeClass) return;
    const updated: Record<string, AttendanceStatus> = {};
    activeClass.students.forEach((s) => {
      updated[s.id] = 'present';
    });
    setCurrentRecords(updated);
  };

  // Export attendance sheet to Excel
  const handleExportAttendanceExcel = () => {
    if (!activeClass) return;

    const wsData: any[][] = [
      [`BẢNG ĐIỂM DANH SINH VIÊN - ${activeClass.name.toUpperCase()}`],
      [`Môn học: ${activeClass.subject}`, `Ngày: ${selectedDate}`, `Buổi học: ${sessionName}`],
      [],
      ['STT', 'Mã Sinh Viên', 'Họ Và Tên', 'Ngày Sinh', 'Trạng Thái', 'Ghi Chú'],
    ];

    activeClass.students.forEach((stu, idx) => {
      const status = currentRecords[stu.id] || 'present';
      const statusText =
        status === 'present'
          ? 'Có mặt'
          : status === 'excused'
          ? 'Vắng có phép'
          : status === 'absent'
          ? 'Vắng không phép'
          : 'Đi trễ';
      const note = currentNotes[stu.id] || '';
      wsData.push([idx + 1, stu.studentCode, stu.fullName, stu.birthDate || '', statusText, note]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DiemDanh');
    XLSX.writeFile(wb, `DiemDanh_${activeClass.name.replace(/\s+/g, '_')}_${selectedDate}.xlsx`);
  };

  // Stats calculation
  const totalStudents = activeClass ? activeClass.students.length : 0;
  const presentCount = Object.values(currentRecords).filter((v) => v === 'present').length;
  const excusedCount = Object.values(currentRecords).filter((v) => v === 'excused').length;
  const absentCount = Object.values(currentRecords).filter((v) => v === 'absent').length;
  const lateCount = Object.values(currentRecords).filter((v) => v === 'late').length;

  const filteredStudents = activeClass
    ? activeClass.students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(searchStudent.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(searchStudent.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn select-none">
      {/* Hidden Excel File Input */}
      <input
        ref={excelInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleImportExcel}
        className="hidden"
      />

      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0F284B] to-[#1E3A8A] text-white p-5 sm:p-6 flex items-center justify-between gap-4 shrink-0 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Quản Lý Điểm Danh Sinh Viên
              </h2>
              <p className="text-sky-200 text-xs sm:text-sm mt-0.5">
                Tạo lớp học &bull; Import Excel danh sách sinh viên &bull; Điểm danh &amp; Thống kê chuyên cần
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-colors"
              title="Tải tệp Excel mẫu để điền danh sách sinh viên"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Tải mẫu Excel</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {!selectedClassId ? (
            /* ================= VIEW 1: CLASS LIST & CREATION ================= */
            <div className="space-y-6">
              {/* Header Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                    Danh Sách Các Lớp Học
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                    Chọn một lớp để tiến hành điểm danh hoặc import file danh sách sinh viên
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadTemplate}
                    className="sm:hidden flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Mẫu Excel</span>
                  </button>

                  <button
                    onClick={() => setIsCreatingClass(true)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tạo lớp mới</span>
                  </button>
                </div>
              </div>

              {/* Class Creation Form (Collapsible) */}
              {isCreatingClass && (
                <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-blue-200 shadow-md animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      <span>Thêm lớp học mới</span>
                    </h4>
                    <button
                      onClick={() => setIsCreatingClass(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Tên lớp học *
                      </label>
                      <input
                        type="text"
                        placeholder="vd: Lớp Tin học K20A..."
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phân môn giảng dạy
                      </label>
                      <select
                        value={newClassSubject}
                        onChange={(e) => setNewClassSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Microsoft Word">Microsoft Word</option>
                        <option value="Microsoft Excel">Microsoft Excel</option>
                        <option value="Microsoft PowerPoint">Microsoft PowerPoint</option>
                        <option value="Tin học căn bản tổng hợp">Tin học căn bản tổng hợp</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phòng máy / Ca học
                      </label>
                      <input
                        type="text"
                        placeholder="vd: Phòng Máy 02 - Ca sáng"
                        value={newClassRoom}
                        onChange={(e) => setNewClassRoom(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 mt-5">
                    <button
                      onClick={() => setIsCreatingClass(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleCreateClass}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
                    >
                      Xác nhận tạo lớp
                    </button>
                  </div>
                </div>
              )}

              {/* Class Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {classes.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all p-5 flex flex-col justify-between gap-4 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {c.subject}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClass(c.id);
                          }}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa lớp học này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-lg mt-3 group-hover:text-blue-700 transition-colors">
                        {c.name}
                      </h4>

                      <div className="text-xs text-slate-500 space-y-1 mt-2">
                        <p>📍 {c.room || 'Chưa xếp phòng'}</p>
                        <p>
                          👥 Sĩ số:{' '}
                          <strong className="text-slate-800 text-sm">
                            {c.students.length} sinh viên
                          </strong>
                        </p>
                        <p>
                          📅 Lịch sử điểm danh: <strong>{c.attendanceHistory.length} buổi</strong>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      {/* Button: Import Excel */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImportTargetClassId(c.id);
                          excelInputRef.current?.click();
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 transition-colors"
                        title="Tải file Excel danh sách sinh viên lên cho lớp này"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Import Excel</span>
                      </button>

                      {/* Button: Vào điểm danh */}
                      <button
                        onClick={() => setSelectedClassId(c.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
                      >
                        <span>Điểm danh</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ================= VIEW 2: DETAILED ATTENDANCE SHEET FOR CLASS ================= */
            <div className="space-y-5">
              {/* Top Navigation & Class Info */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedClassId(null)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Quay lại danh sách lớp"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {activeClass?.subject}
                      </span>
                      <span className="text-xs text-slate-500">{activeClass?.room}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                      {activeClass?.name}
                    </h3>
                  </div>
                </div>

                {/* Session Config: Date & Session selector */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <select
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Buổi 1">Buổi 1</option>
                    <option value="Buổi 2">Buổi 2</option>
                    <option value="Buổi 3">Buổi 3</option>
                    <option value="Buổi 4">Buổi 4</option>
                    <option value="Buổi 5">Buổi 5</option>
                    <option value="Buổi 6">Buổi 6</option>
                    <option value="Buổi 7">Buổi 7</option>
                    <option value="Buổi 8">Buổi 8</option>
                    <option value="Buổi 9">Buổi 9</option>
                    <option value="Buổi 10">Buổi 10</option>
                  </select>

                  <button
                    onClick={(e) => {
                      if (activeClass) {
                        setImportTargetClassId(activeClass.id);
                        excelInputRef.current?.click();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs sm:text-sm font-bold border border-emerald-200 transition-colors"
                    title="Import danh sách sinh viên từ file Excel"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import Excel</span>
                  </button>

                  <button
                    onClick={handleExportAttendanceExcel}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 transition-colors"
                    title="Xuất bảng điểm danh ra file Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Xuất Excel</span>
                  </button>

                  <button
                    onClick={handleSaveAttendance}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-[1.02]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu buổi này</span>
                  </button>
                </div>
              </div>

              {/* Attendance Statistics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Sĩ số</p>
                    <p className="text-2xl font-black text-slate-800 mt-0.5">{totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-slate-400" />
                </div>

                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-700 font-semibold uppercase">Có mặt</p>
                    <p className="text-2xl font-black text-emerald-800 mt-0.5">
                      {presentCount}{' '}
                      <span className="text-xs font-normal">
                        ({totalStudents ? Math.round((presentCount / totalStudents) * 100) : 0}%)
                      </span>
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>

                <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-rose-700 font-semibold uppercase">Vắng</p>
                    <p className="text-2xl font-black text-rose-800 mt-0.5">
                      {absentCount + excusedCount}{' '}
                      <span className="text-xs font-normal text-rose-600">
                        (Phép: {excusedCount})
                      </span>
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-rose-500" />
                </div>

                <div className="bg-sky-50 p-3.5 rounded-2xl border border-sky-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-sky-700 font-semibold uppercase">Đi trễ</p>
                    <p className="text-2xl font-black text-sky-800 mt-0.5">{lateCount}</p>
                  </div>
                  <Clock className="w-8 h-8 text-sky-500" />
                </div>
              </div>

              {/* Controls bar: Search & Quick Mark */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Tìm sinh viên theo tên hoặc mã SV..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleMarkAllPresent}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Đánh dấu tất cả có mặt</span>
                  </button>
                </div>
              </div>

              {/* Student Attendance Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredStudents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-100/80 text-slate-700 font-bold text-xs uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4 w-12 text-center">STT</th>
                          <th className="py-3 px-4 w-32">Mã SV</th>
                          <th className="py-3 px-4">Họ và Tên</th>
                          <th className="py-3 px-4 w-28 hidden sm:table-cell">Ngày sinh</th>
                          <th className="py-3 px-4 text-center w-72">Trạng thái điểm danh</th>
                          <th className="py-3 px-4 w-48">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((stu, idx) => {
                          const status = currentRecords[stu.id] || 'present';
                          const note = currentNotes[stu.id] || '';

                          return (
                            <tr
                              key={stu.id}
                              className={`hover:bg-slate-50 transition-colors ${
                                status === 'absent'
                                  ? 'bg-rose-50/30'
                                  : status === 'excused'
                                  ? 'bg-amber-50/30'
                                  : status === 'late'
                                  ? 'bg-sky-50/30'
                                  : ''
                              }`}
                            >
                              <td className="py-3 px-4 text-center font-mono text-slate-400 text-xs">
                                {idx + 1}
                              </td>

                              <td className="py-3 px-4 font-mono font-bold text-slate-700 text-xs">
                                {stu.studentCode}
                              </td>

                              <td className="py-3 px-4 font-semibold text-slate-900">
                                {stu.fullName}
                              </td>

                              <td className="py-3 px-4 text-slate-500 text-xs hidden sm:table-cell">
                                {stu.birthDate || '—'}
                              </td>

                              {/* 4 Attendance Status Buttons */}
                              <td className="py-2 px-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() =>
                                      setCurrentRecords({ ...currentRecords, [stu.id]: 'present' })
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                      status === 'present'
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700'
                                    }`}
                                  >
                                    Có mặt
                                  </button>

                                  <button
                                    onClick={() =>
                                      setCurrentRecords({ ...currentRecords, [stu.id]: 'excused' })
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                      status === 'excused'
                                        ? 'bg-amber-500 text-white shadow-sm'
                                        : 'bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700'
                                    }`}
                                  >
                                    Phép
                                  </button>

                                  <button
                                    onClick={() =>
                                      setCurrentRecords({ ...currentRecords, [stu.id]: 'absent' })
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                      status === 'absent'
                                        ? 'bg-rose-600 text-white shadow-sm'
                                        : 'bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700'
                                    }`}
                                  >
                                    Vắng
                                  </button>

                                  <button
                                    onClick={() =>
                                      setCurrentRecords({ ...currentRecords, [stu.id]: 'late' })
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                      status === 'late'
                                        ? 'bg-sky-600 text-white shadow-sm'
                                        : 'bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700'
                                    }`}
                                  >
                                    Trễ
                                  </button>
                                </div>
                              </td>

                              {/* Student Note Input */}
                              <td className="py-2 px-4">
                                <input
                                  type="text"
                                  placeholder="Ghi chú..."
                                  value={note}
                                  onChange={(e) =>
                                    setCurrentNotes({ ...currentNotes, [stu.id]: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-400">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700 text-base">
                      Lớp học chưa có danh sách sinh viên
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Hãy bấm nút <strong>"Import Excel"</strong> ở góc trên để tải danh sách sinh viên từ file Excel lên lớp học này.
                    </p>
                    <button
                      onClick={() => {
                        if (activeClass) {
                          setImportTargetClassId(activeClass.id);
                          excelInputRef.current?.click();
                        }
                      }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Chọn file Excel danh sách</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
