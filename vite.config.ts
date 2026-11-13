import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { spawn, exec } from 'child_process';
import { defineConfig, Plugin } from 'vite';

// Hàm tìm tệp đệ quy trong thư mục (giúp tìm đúng tệp trên mọi máy tính)
function findFileInDir(dir: string, targetName: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findFileInDir(full, targetName);
      if (found) return found;
    } else if (entry.name.toLowerCase() === targetName.toLowerCase()) {
      return full;
    }
  }
  return null;
}

// Hàm quét tự động thư mục public/TaiLieu để tìm tất cả các file đã có trong source
function scanTaiLieuDirectory(): Record<string, any[]> {
  const baseDir = path.resolve(__dirname, 'public', 'TaiLieu');
  const result: Record<string, any[]> = {};

  const subjectMap: Record<string, string> = {
    Word: 'word',
    Excel: 'excel',
    PPT: 'powerpoint',
    TimHieu: 'guide',
  };

  // Đọc thêm danh sách môn học tự tạo từ public/data/custom_subjects.json
  const customSubjectsFile = path.resolve(__dirname, 'public', 'data', 'custom_subjects.json');
  if (fs.existsSync(customSubjectsFile)) {
    try {
      const customList = JSON.parse(fs.readFileSync(customSubjectsFile, 'utf-8'));
      if (Array.isArray(customList)) {
        customList.forEach((s: any) => {
          if (s && s.dirName && s.id) {
            subjectMap[s.dirName] = s.id;
          }
        });
      }
    } catch (e) {}
  }

  const tabMap: Record<string, string> = {
    '1_GiaoTrinh': 'curriculum',
    '2_BaiGiang': 'lectures',
    '3_BaiTap': 'practice',
    '4_KiemTra': 'quiz',
    '5_DeThi': 'exam',
  };

  // Đọc thêm danh mục học tập con tự tạo từ public/data/custom_categories.json
  const customCategoriesFile = path.resolve(__dirname, 'public', 'data', 'custom_categories.json');
  const customCategoryMap: Record<string, string> = {};
  if (fs.existsSync(customCategoriesFile)) {
    try {
      const catList = JSON.parse(fs.readFileSync(customCategoriesFile, 'utf-8'));
      if (Array.isArray(catList)) {
        catList.forEach((c: any) => {
          if (c && c.folderName && c.id) {
            customCategoryMap[`${(c.subject || '').toLowerCase()}_${c.folderName}`] = c.id;
          }
        });
      }
    } catch (e) {}
  }

  const defaultFileNames = new Set([
    'Giao_trinh_Microsoft_Word.docx',
    'Bai_giang_Word_Can_ban.docx',
    'Bai_tap_thuc_hanh_Word.docx',
    'Trac_nghiem_Word_15_phut.docx',
    'De_thi_thuc_hanh_Word.docx',
    'Giao_trinh_Microsoft_Excel.xlsx',
    'Bai_giang_Excel_Cong_thuc.xlsx',
    'Bai_tap_thuc_hanh_Excel.xlsx',
    'Trac_nghiem_Excel_15_phut.xlsx',
    'De_thi_thuc_hanh_Excel.xlsx',
    'Giao_trinh_Microsoft_PowerPoint.pptx',
    'Bai_giang_PowerPoint_Chuan.pptx',
    'Bai_tap_thuc_hanh_PowerPoint.pptx',
    'Trac_nghiem_PowerPoint_15_phut.pptx',
    'De_thi_thuc_hanh_PowerPoint.pptx',
    'Giao_trinh_Tin_hoc_Dai_cuong.pdf',
    'documents_manifest.json',
  ]);

  if (!fs.existsSync(baseDir)) return result;

  const subjects = fs.readdirSync(baseDir);
  for (const subj of subjects) {
    const subjPath = path.resolve(baseDir, subj);
    if (!fs.statSync(subjPath).isDirectory()) continue;
    const mappedSubj = subjectMap[subj] || subj.toLowerCase();

    const tabs = fs.readdirSync(subjPath);
    for (const tab of tabs) {
      const tabPath = path.resolve(subjPath, tab);
      if (!fs.statSync(tabPath).isDirectory()) continue;
      let mappedTab = tabMap[tab];
      if (!mappedTab) {
        const lookupKey = `${mappedSubj.toLowerCase()}_${tab}`;
        mappedTab = customCategoryMap[lookupKey] || tab.toLowerCase();
      }
      const key = `${mappedSubj}_${mappedTab}`;

      const files = fs.readdirSync(tabPath);
      for (const file of files) {
        if (defaultFileNames.has(file)) continue;
        const filePath = path.resolve(tabPath, file);
        const stat = fs.statSync(filePath);
        if (!stat.isFile()) continue;

        const ext = file.split('.').pop()?.toLowerCase();
        let fileType = 'docx';
        if (ext === 'pdf') fileType = 'pdf';
        else if (ext === 'xlsx' || ext === 'xls') fileType = 'xlsx';
        else if (ext === 'pptx' || ext === 'ppt') fileType = 'pptx';

        const formatSize = (bytes: number) => {
          if (bytes < 1024) return bytes + ' B';
          if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
          return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        };

        if (!result[key]) result[key] = [];
        result[key].push({
          id: `UPLOAD-DISK-${file.replace(/[^a-zA-Z0-9]/g, '_')}`,
          title: file.replace(/\.[^/.]+$/, ''),
          fileName: file,
          fileType,
          fileSize: formatSize(stat.size),
          pages: 1,
          updatedAt: new Date(stat.mtime).toLocaleDateString('vi-VN'),
          category: 'Tệp tải lên',
          description: `Tệp lưu tại TaiLieu/${subj}/${tab}/${file}`,
          contentPages: [],
        });
      }
    }
  }

  return result;
}

function officeOpenerPlugin(): Plugin {
  const handleRequest = async (req: any, res: any, next: any) => {
    const url = req.url?.split('?')[0];

    // 1. API: Mở tệp trực tiếp bằng Microsoft Office / Phần mềm mặc định trên máy tính
    if (url === '/api/open-office' && req.method === 'POST') {
      try {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf-8');
            const data = JSON.parse(raw);
            const { fileName, base64, relativePath, targetPath } = data;

            let targetFilePath = '';

            if (targetPath) {
              targetFilePath = path.resolve(__dirname, targetPath);
            } else if (relativePath) {
              targetFilePath = path.resolve(__dirname, 'public', relativePath);
            }

            // Nếu không thấy file ở đường dẫn trực tiếp, quét toàn bộ thư mục public/TaiLieu
            if ((!targetFilePath || !fs.existsSync(targetFilePath)) && fileName) {
              const found = findFileInDir(path.resolve(__dirname, 'public', 'TaiLieu'), fileName);
              if (found) targetFilePath = found;
            }

            // Nếu có dữ liệu base64 được gửi kèm, đảm bảo ghi đè nội dung file thật vào đĩa
            if (fileName && base64) {
              if (targetFilePath) {
                const dir = path.dirname(targetFilePath);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(targetFilePath, Buffer.from(base64, 'base64'));
              } else {
                const cacheDir = path.resolve(__dirname, '.office_cache');
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
                targetFilePath = path.resolve(cacheDir, fileName);
                fs.writeFileSync(targetFilePath, Buffer.from(base64, 'base64'));
              }
            }

            if (!targetFilePath || !fs.existsSync(targetFilePath)) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Không tìm thấy tệp để mở' }));
              return;
            }

            // Chuẩn hóa đường dẫn Windows
            const safePath = path.normalize(targetFilePath);

            // Mở file an toàn trên Windows không bị lỗi khoảng trắng ("D:\PHONG CNTT")
            // Sử dụng PowerShell Start-Process với chuỗi nháy đơn để bảo toàn 100% đường dẫn
            const psCmd = `powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -Command "Start-Process -FilePath '${safePath.replace(/'/g, "''")}'"`;
            exec(psCmd, (err) => {
              if (err) {
                // Dự phòng 1: explorer.exe trực tiếp
                try {
                  const child = spawn('explorer.exe', [safePath], { detached: true, stdio: 'ignore' });
                  child.unref();
                } catch (e1) {
                  // Dự phòng 2: cmd.exe bọc kín 2 tầng ngoặc kép tránh bị cmd strip quotes
                  exec(`cmd.exe /c "start "" "${safePath}"""`, () => {});
                }
              }
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, path: targetFilePath }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
        return;
      }
    }

    // 2. API: Lưu tệp khi người dùng tải tệp lên vào thư mục mã nguồn
    if (url === '/api/save-uploaded-file' && req.method === 'POST') {
      try {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf-8');
            const data = JSON.parse(raw);
            const { fileName, base64, folderPath } = data;

            const targetDir = folderPath
              ? path.resolve(__dirname, folderPath)
              : path.resolve(__dirname, 'public', 'TaiLieu', 'Uploads');

            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }

            const targetFilePath = path.resolve(targetDir, fileName);
            fs.writeFileSync(targetFilePath, Buffer.from(base64, 'base64'));

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, path: targetFilePath }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
        return;
      }
    }

    // 3. API: Đồng bộ danh mục tệp tin (Manifest) để mang sang máy khác không bị mất danh sách
    if (url === '/api/documents-manifest') {
      const manifestFile = path.resolve(__dirname, 'public', 'TaiLieu', 'documents_manifest.json');

      if (req.method === 'GET') {
        try {
          let manifestData: Record<string, any[]> = {};
          if (fs.existsSync(manifestFile)) {
            try {
              manifestData = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
            } catch (e) {}
          }

          // Tự động quét các tệp thực tế trên đĩa và hợp nhất vào manifest
          const scanned = scanTaiLieuDirectory();
          Object.keys(scanned).forEach((key) => {
            const existing = manifestData[key] || [];
            scanned[key].forEach((item) => {
              if (!existing.some((e: any) => e.fileName === item.fileName)) {
                existing.push(item);
              }
            });
            manifestData[key] = existing;
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(manifestData));
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }

      if (req.method === 'POST') {
        try {
          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const raw = Buffer.concat(chunks).toString('utf-8');
              const dir = path.dirname(manifestFile);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(manifestFile, raw, 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }
    }

    // 4. API: Đồng bộ dữ liệu điểm danh và lớp học (Attendance)
    if (url === '/api/attendance-data' || url === '/api/save-attendance' || url === '/api/get-attendance') {
      const attendanceFile = path.resolve(__dirname, 'public', 'data', 'attendance_classes.json');

      if (req.method === 'GET' || url === '/api/get-attendance') {
        try {
          if (fs.existsSync(attendanceFile)) {
            const data = fs.readFileSync(attendanceFile, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify([]));
          }
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }

      if (req.method === 'POST' || url === '/api/save-attendance') {
        try {
          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const raw = Buffer.concat(chunks).toString('utf-8');
              const dir = path.dirname(attendanceFile);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(attendanceFile, raw, 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }
    }

    // 5. API: Di chuyển tệp bị xóa vĩnh viễn vào thư mục Thùng rác trong dự án (public/ThungRac)
    if (url === '/api/move-to-project-trash' && req.method === 'POST') {
      try {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf-8');
            const data = JSON.parse(raw);
            const items = Array.isArray(data.items) ? data.items : [data];
            const trashDir = path.resolve(__dirname, 'public', 'ThungRac');
            if (!fs.existsSync(trashDir)) {
              fs.mkdirSync(trashDir, { recursive: true });
            }

            const manifestPath = path.resolve(trashDir, 'trash_manifest.json');
            let manifestList: any[] = [];
            if (fs.existsSync(manifestPath)) {
              try {
                manifestList = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
              } catch (e) {
                manifestList = [];
              }
            }

            const movedFiles: any[] = [];

            for (const it of items) {
              const fileName = it.fileName || it.doc?.fileName;
              if (!fileName) continue;

              let sourcePath = '';
              if (it.relativePath) {
                sourcePath = path.resolve(__dirname, 'public', it.relativePath);
              }
              if ((!sourcePath || !fs.existsSync(sourcePath)) && fileName) {
                const found = findFileInDir(path.resolve(__dirname, 'public', 'TaiLieu'), fileName);
                if (found) sourcePath = found;
              }

              let destFileName = fileName;
              let destPath = path.resolve(trashDir, destFileName);

              // Nếu tệp đã tồn tại trong Thùng rác, đặt thêm tiền tố timestamp tránh ghi đè
              if (fs.existsSync(destPath)) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                destFileName = `${timestamp}_${fileName}`;
                destPath = path.resolve(trashDir, destFileName);
              }

              if (sourcePath && fs.existsSync(sourcePath)) {
                try {
                  fs.renameSync(sourcePath, destPath);
                } catch (err) {
                  fs.copyFileSync(sourcePath, destPath);
                  try {
                    fs.unlinkSync(sourcePath);
                  } catch (e) {}
                }
              }

              const trashRecord = {
                id: it.id || `TRASH-${Date.now()}`,
                fileName: fileName,
                storedTrashFile: destFileName,
                deletedAt: new Date().toLocaleString('vi-VN'),
                originalPath: sourcePath ? path.relative(__dirname, sourcePath).replace(/\\/g, '/') : '',
                originalFolder: it.folderName || it.originalFolder || '',
                fileSize: it.doc?.fileSize || '',
                fileType: it.doc?.fileType || '',
              };

              manifestList.unshift(trashRecord);
              movedFiles.push(trashRecord);
            }

            fs.writeFileSync(manifestPath, JSON.stringify(manifestList, null, 2), 'utf-8');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, count: movedFiles.length, moved: movedFiles }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
        return;
      }
    }

    // 6. API: Mở thư mục Thùng rác trong dự án trực tiếp bằng File Explorer của Windows
    if (url === '/api/open-trash-folder' && (req.method === 'POST' || req.method === 'GET')) {
      try {
        const trashDir = path.resolve(__dirname, 'public', 'ThungRac');
        if (!fs.existsSync(trashDir)) {
          fs.mkdirSync(trashDir, { recursive: true });
        }
        const safePath = path.normalize(trashDir);

        spawn('explorer.exe', [safePath], { detached: true, stdio: 'ignore' }).unref();

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, path: safePath }));
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
        return;
      }
    }

    // 7. API: Quản lý danh mục môn học tự tạo (Custom Subjects)
    if (url === '/api/subjects') {
      const customSubjectsFile = path.resolve(__dirname, 'public', 'data', 'custom_subjects.json');

      if (req.method === 'GET') {
        try {
          if (fs.existsSync(customSubjectsFile)) {
            const data = fs.readFileSync(customSubjectsFile, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data || '[]');
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end('[]');
          }
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }

      if (req.method === 'POST') {
        try {
          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const raw = Buffer.concat(chunks).toString('utf-8');
              const dir = path.dirname(customSubjectsFile);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(customSubjectsFile, raw, 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }
    }

    // 8. API: Tạo danh mục học tập mới & Tự động tạo thư mục vật lý trên ổ cứng
    if (url === '/api/create-subject' && req.method === 'POST') {
      try {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf-8');
            const data = JSON.parse(raw);
            const { id, title, subtitle, dirName, colorScheme, iconType } = data;

            if (!title || !dirName) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Thiếu tên danh mục hoặc tên thư mục' }));
              return;
            }

            // Chuẩn hóa tên thư mục (loại bỏ ký tự cấm trên Windows)
            const safeDirName = dirName.replace(/[/\\?%*:|"<>]/g, '_').trim();
            const subjectDir = path.resolve(__dirname, 'public', 'TaiLieu', safeDirName);

            // 1. Tạo thư mục gốc của môn học
            if (!fs.existsSync(subjectDir)) {
              fs.mkdirSync(subjectDir, { recursive: true });
            }

            // 2. Tạo đầy đủ 5 thư mục con chuẩn như các môn học khác
            const subFolders = ['1_GiaoTrinh', '2_BaiGiang', '3_BaiTap', '4_KiemTra', '5_DeThi'];
            for (const sub of subFolders) {
              const subPath = path.resolve(subjectDir, sub);
              if (!fs.existsSync(subPath)) {
                fs.mkdirSync(subPath, { recursive: true });
              }
            }

            // 3. Cập nhật vào tệp cấu hình public/data/custom_subjects.json
            const customSubjectsFile = path.resolve(__dirname, 'public', 'data', 'custom_subjects.json');
            let subjectsList: any[] = [];
            if (fs.existsSync(customSubjectsFile)) {
              try {
                subjectsList = JSON.parse(fs.readFileSync(customSubjectsFile, 'utf-8'));
                if (!Array.isArray(subjectsList)) subjectsList = [];
              } catch (e) {
                subjectsList = [];
              }
            }

            const subjectId = id || `sub_${safeDirName.toLowerCase()}_${Date.now()}`;
            const newSubject = {
              id: subjectId,
              title: title.trim(),
              subtitle: (subtitle || '').trim(),
              dirName: safeDirName,
              colorScheme: colorScheme || 'blue',
              iconType: iconType || 'book',
              createdAt: new Date().toISOString(),
            };

            // Nếu đã tồn tại id này thì cập nhật, ngược lại thêm mới
            const existingIndex = subjectsList.findIndex((s: any) => s.id === subjectId || s.dirName === safeDirName);
            if (existingIndex >= 0) {
              subjectsList[existingIndex] = { ...subjectsList[existingIndex], ...newSubject };
            } else {
              subjectsList.push(newSubject);
            }

            const dir = path.dirname(customSubjectsFile);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(customSubjectsFile, JSON.stringify(subjectsList, null, 2), 'utf-8');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, subject: newSubject, path: subjectDir }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
        return;
      }
    }

    // 9. API: Xóa danh mục học tập tự tạo (và chuyển thư mục vào Thùng rác dự án nếu cần)
    if (url === '/api/delete-subject' && req.method === 'POST') {
      try {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf-8');
            const data = JSON.parse(raw);
            const { id, dirName, moveToTrash } = data;

            // Xóa khỏi danh sách custom_subjects.json
            const customSubjectsFile = path.resolve(__dirname, 'public', 'data', 'custom_subjects.json');
            let subjectsList: any[] = [];
            if (fs.existsSync(customSubjectsFile)) {
              try {
                subjectsList = JSON.parse(fs.readFileSync(customSubjectsFile, 'utf-8'));
                if (Array.isArray(subjectsList)) {
                  subjectsList = subjectsList.filter((s: any) => s.id !== id && s.dirName !== dirName);
                  fs.writeFileSync(customSubjectsFile, JSON.stringify(subjectsList, null, 2), 'utf-8');
                }
              } catch (e) {}
            }

            // Nếu người dùng chọn chuyển thư mục vào Thùng rác dự án
            if (moveToTrash && dirName) {
              const safeDirName = dirName.replace(/[/\\?%*:|"<>]/g, '_').trim();
              const subjectDir = path.resolve(__dirname, 'public', 'TaiLieu', safeDirName);
              const trashDir = path.resolve(__dirname, 'public', 'ThungRac');
              if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir, { recursive: true });

              if (fs.existsSync(subjectDir)) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const destTrashFolder = path.resolve(trashDir, `${timestamp}_${safeDirName}`);
                try {
                  fs.renameSync(subjectDir, destTrashFolder);
                } catch (e) {
                  // Fallback copy & remove
                  fs.cpSync(subjectDir, destTrashFolder, { recursive: true });
                  fs.rmSync(subjectDir, { recursive: true, force: true });
                }
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
        return;
      }
    }

    // 10. API: Mở trực tiếp thư mục môn học trên Windows File Explorer
    if (url === '/api/open-subject-folder' && (req.method === 'POST' || req.method === 'GET')) {
      try {
        let dirName = '';
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk: Buffer) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const raw = Buffer.concat(chunks).toString('utf-8');
              const data = JSON.parse(raw);
              dirName = data.dirName || '';
              const targetDir = dirName
                ? path.resolve(__dirname, 'public', 'TaiLieu', dirName)
                : path.resolve(__dirname, 'public', 'TaiLieu');

              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }
              const safePath = path.normalize(targetDir);
              spawn('explorer.exe', [safePath], { detached: true, stdio: 'ignore' }).unref();

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, path: safePath }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
        return;
      }
    }

    // 11. API: Quản lý danh mục học tập tùy chỉnh bên trong mỗi môn (Custom Categories)
    if (url === '/api/custom-categories') {
      const customCategoriesFile = path.resolve(__dirname, 'public', 'data', 'custom_categories.json');

      if (req.method === 'GET') {
        try {
          if (fs.existsSync(customCategoriesFile)) {
            const data = fs.readFileSync(customCategoriesFile, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data || '[]');
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end('[]');
          }
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
        return;
      }
    }

    // 12. API: Tạo danh mục học tập con mới bên trong môn học & tự động tạo thư mục vật lý
    if (url === '/api/create-custom-category' && req.method === 'POST') {
      try {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf-8');
            const data = JSON.parse(raw);
            const { subject, label, folderName, iconType } = data;

            if (!subject || !label || !folderName) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Thiếu thông tin danh mục hoặc tên thư mục' }));
              return;
            }

            const subjectDirMap: Record<string, string> = {
              word: 'Word',
              excel: 'Excel',
              powerpoint: 'PPT',
              guide: 'TimHieu',
            };
            const subjDir = subjectDirMap[subject.toLowerCase()] || subject;

            // Chuẩn hóa tên thư mục
            const safeFolderName = folderName.replace(/[/\\?%*:|"<>]/g, '_').trim();
            const physicalCategoryDir = path.resolve(__dirname, 'public', 'TaiLieu', subjDir, safeFolderName);

            // Tạo thư mục vật lý trên đĩa
            if (!fs.existsSync(physicalCategoryDir)) {
              fs.mkdirSync(physicalCategoryDir, { recursive: true });
            }

            const customCategoriesFile = path.resolve(__dirname, 'public', 'data', 'custom_categories.json');
            let categoriesList: any[] = [];
            if (fs.existsSync(customCategoriesFile)) {
              try {
                categoriesList = JSON.parse(fs.readFileSync(customCategoriesFile, 'utf-8'));
                if (!Array.isArray(categoriesList)) categoriesList = [];
              } catch (e) {
                categoriesList = [];
              }
            }

            const categoryId = `cat_${subject.toLowerCase()}_${safeFolderName.toLowerCase()}_${Date.now()}`;
            const newCategory = {
              id: categoryId,
              subject: subject.toLowerCase(),
              label: label.trim(),
              folderName: safeFolderName,
              iconType: iconType || 'folder',
              createdAt: new Date().toISOString(),
            };

            const existingIndex = categoriesList.findIndex(
              (c: any) => c.subject === subject.toLowerCase() && c.folderName === safeFolderName
            );
            if (existingIndex >= 0) {
              categoriesList[existingIndex] = { ...categoriesList[existingIndex], ...newCategory };
            } else {
              categoriesList.push(newCategory);
            }

            const dir = path.dirname(customCategoriesFile);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(customCategoriesFile, JSON.stringify(categoriesList, null, 2), 'utf-8');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, category: newCategory, path: physicalCategoryDir }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
        return;
      }
    }

    // 13. API: Xóa danh mục học tập con & chuyển thư mục vật lý vào Thùng rác
    if (url === '/api/delete-custom-category' && req.method === 'POST') {
      try {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf-8');
            const data = JSON.parse(raw);
            const { id, subject, folderName, moveToTrash } = data;

            const customCategoriesFile = path.resolve(__dirname, 'public', 'data', 'custom_categories.json');
            let categoriesList: any[] = [];
            if (fs.existsSync(customCategoriesFile)) {
              try {
                categoriesList = JSON.parse(fs.readFileSync(customCategoriesFile, 'utf-8'));
                if (Array.isArray(categoriesList)) {
                  categoriesList = categoriesList.filter((c: any) => c.id !== id);
                  fs.writeFileSync(customCategoriesFile, JSON.stringify(categoriesList, null, 2), 'utf-8');
                }
              } catch (e) {}
            }

            if (moveToTrash && subject && folderName) {
              const subjectDirMap: Record<string, string> = {
                word: 'Word',
                excel: 'Excel',
                powerpoint: 'PPT',
                guide: 'TimHieu',
              };
              const subjDir = subjectDirMap[subject.toLowerCase()] || subject;
              const sourceDir = path.resolve(__dirname, 'public', 'TaiLieu', subjDir, folderName);
              const trashDir = path.resolve(__dirname, 'public', 'ThungRac');
              if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir, { recursive: true });

              if (fs.existsSync(sourceDir)) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const destTrashFolder = path.resolve(trashDir, `${timestamp}_${subjDir}_${folderName}`);
                try {
                  fs.renameSync(sourceDir, destTrashFolder);
                } catch (e) {
                  fs.cpSync(sourceDir, destTrashFolder, { recursive: true });
                  fs.rmSync(sourceDir, { recursive: true, force: true });
                }
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
        return;
      }
    }

    next();
  };

  return {
    name: 'office-opener-plugin',
    configureServer(server) {
      server.middlewares.use(handleRequest);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleRequest);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), officeOpenerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      // Bỏ qua các thư mục dữ liệu động để tránh việc ghi file làm reload trang web
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: [
          '**/public/data/**',
          '**/public/TaiLieu/**',
          '**/public/ThungRac/**',
          '**/.office_cache/**',
          '**/documents_manifest.json',
          '**/attendance_classes.json',
          '**/trash_manifest.json',
          '**/custom_subjects.json',
          '**/custom_categories.json',
        ],
      },
    },
  };
});
