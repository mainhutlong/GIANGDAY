const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const url = require('url');

// Thư mục gốc của ứng dụng
const ROOT_DIR = __dirname;
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');

// MIME types thông dụng
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain; charset=utf-8',
};

// Hàm tìm tệp đệ quy trong thư mục
function findFileInDir(dir, targetName) {
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

// Hàm quét tự động thư mục public/TaiLieu
function scanTaiLieuDirectory() {
  const baseDir = path.resolve(PUBLIC_DIR, 'TaiLieu');
  const result = {};

  const subjectMap = {
    Word: 'word',
    Excel: 'excel',
    PPT: 'powerpoint',
    TimHieu: 'guide',
  };

  const customSubjectsFile = path.resolve(PUBLIC_DIR, 'data', 'custom_subjects.json');
  if (fs.existsSync(customSubjectsFile)) {
    try {
      const customList = JSON.parse(fs.readFileSync(customSubjectsFile, 'utf-8'));
      if (Array.isArray(customList)) {
        customList.forEach((s) => {
          if (s && s.dirName && s.id) {
            subjectMap[s.dirName] = s.id;
          }
        });
      }
    } catch (e) {}
  }

  const tabMap = {
    '1_GiaoTrinh': 'curriculum',
    '2_BaiGiang': 'lectures',
    '3_BaiTap': 'practice',
    '4_KiemTra': 'quiz',
    '5_DeThi': 'exam',
  };

  const customCategoriesFile = path.resolve(PUBLIC_DIR, 'data', 'custom_categories.json');
  const customCategoryMap = {};
  if (fs.existsSync(customCategoriesFile)) {
    try {
      const catList = JSON.parse(fs.readFileSync(customCategoriesFile, 'utf-8'));
      if (Array.isArray(catList)) {
        catList.forEach((c) => {
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

        const formatSize = (bytes) => {
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

// Helper đọc toàn bộ body request
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const str = Buffer.concat(chunks).toString('utf-8');
        resolve(str);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(data));
}

// Handler cho tất cả các API
async function handleApi(req, res, pathname) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return true;
  }

  // Health check
  if (pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok', time: Date.now() });
    return true;
  }

  // 1. Mở tệp trực tiếp bằng Microsoft Office / Phần mềm mặc định trên Windows
  if (pathname === '/api/open-office' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const data = JSON.parse(raw);
      const { fileName, base64, relativePath, targetPath } = data;

      let targetFilePath = '';
      if (targetPath) {
        targetFilePath = path.resolve(ROOT_DIR, targetPath);
      } else if (relativePath) {
        targetFilePath = path.resolve(PUBLIC_DIR, relativePath);
      }

      if ((!targetFilePath || !fs.existsSync(targetFilePath)) && fileName) {
        const found = findFileInDir(path.resolve(PUBLIC_DIR, 'TaiLieu'), fileName);
        if (found) targetFilePath = found;
      }

      if (fileName && base64) {
        if (targetFilePath) {
          const dir = path.dirname(targetFilePath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(targetFilePath, Buffer.from(base64, 'base64'));
        } else {
          const cacheDir = path.resolve(ROOT_DIR, '.office_cache');
          if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
          targetFilePath = path.resolve(cacheDir, fileName);
          fs.writeFileSync(targetFilePath, Buffer.from(base64, 'base64'));
        }
      }

      if (!targetFilePath || !fs.existsSync(targetFilePath)) {
        sendJson(res, 404, { success: false, error: 'Không tìm thấy tệp để mở' });
        return true;
      }

      const safePath = path.normalize(targetFilePath);
      const psCmd = `powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -Command "Start-Process -FilePath '${safePath.replace(/'/g, "''")}'"`;
      exec(psCmd, (err) => {
        if (err) {
          try {
            const child = spawn('explorer.exe', [safePath], { detached: true, stdio: 'ignore' });
            child.unref();
          } catch (e1) {
            exec(`cmd.exe /c "start "" "${safePath}"""`, () => {});
          }
        }
      });

      sendJson(res, 200, { success: true, path: targetFilePath });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 2. Lưu tệp tải lên
  if (pathname === '/api/save-uploaded-file' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const data = JSON.parse(raw);
      const { fileName, base64, folderPath } = data;

      const targetDir = folderPath
        ? path.resolve(ROOT_DIR, folderPath)
        : path.resolve(PUBLIC_DIR, 'TaiLieu', 'Uploads');

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const targetFilePath = path.resolve(targetDir, fileName);
      fs.writeFileSync(targetFilePath, Buffer.from(base64, 'base64'));

      sendJson(res, 200, { success: true, path: targetFilePath });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 3. Documents manifest
  if (pathname === '/api/documents-manifest') {
    const manifestFile = path.resolve(PUBLIC_DIR, 'TaiLieu', 'documents_manifest.json');
    if (req.method === 'GET') {
      try {
        let manifestData = {};
        if (fs.existsSync(manifestFile)) {
          try {
            manifestData = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
          } catch (e) {}
        }
        const scanned = scanTaiLieuDirectory();
        Object.keys(scanned).forEach((key) => {
          const existing = manifestData[key] || [];
          scanned[key].forEach((item) => {
            if (!existing.some((e) => e.fileName === item.fileName)) {
              existing.push(item);
            }
          });
          manifestData[key] = existing;
        });
        sendJson(res, 200, manifestData);
      } catch (err) {
        sendJson(res, 500, { error: err.message });
      }
      return true;
    }
    if (req.method === 'POST') {
      try {
        const raw = await readBody(req);
        const dir = path.dirname(manifestFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(manifestFile, raw, 'utf-8');
        sendJson(res, 200, { success: true });
      } catch (err) {
        sendJson(res, 500, { error: err.message });
      }
      return true;
    }
  }

  // 4. Attendance
  if (pathname === '/api/attendance-data' || pathname === '/api/save-attendance' || pathname === '/api/get-attendance') {
    const attendanceFile = path.resolve(PUBLIC_DIR, 'data', 'attendance_classes.json');
    if (req.method === 'GET' || pathname === '/api/get-attendance') {
      try {
        if (fs.existsSync(attendanceFile)) {
          const data = fs.readFileSync(attendanceFile, 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(data);
        } else {
          sendJson(res, 200, []);
        }
      } catch (err) {
        sendJson(res, 500, { error: err.message });
      }
      return true;
    }
    if (req.method === 'POST' || pathname === '/api/save-attendance') {
      try {
        const raw = await readBody(req);
        const dir = path.dirname(attendanceFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(attendanceFile, raw, 'utf-8');
        sendJson(res, 200, { success: true });
      } catch (err) {
        sendJson(res, 500, { error: err.message });
      }
      return true;
    }
  }

  // 5. Thùng rác dự án
  if (pathname === '/api/move-to-project-trash' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const data = JSON.parse(raw);
      const items = Array.isArray(data.items) ? data.items : [data];
      const trashDir = path.resolve(PUBLIC_DIR, 'ThungRac');

      if (!fs.existsSync(trashDir)) {
        fs.mkdirSync(trashDir, { recursive: true });
      }

      const manifestPath = path.resolve(trashDir, 'trash_manifest.json');
      let manifestList = [];
      if (fs.existsSync(manifestPath)) {
        try {
          manifestList = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        } catch (e) {
          manifestList = [];
        }
      }

      const movedFiles = [];
      for (const it of items) {
        const fileName = it.fileName || it.doc?.fileName;
        if (!fileName) continue;

        let sourcePath = '';
        if (it.relativePath) {
          sourcePath = path.resolve(PUBLIC_DIR, it.relativePath);
        }
        if ((!sourcePath || !fs.existsSync(sourcePath)) && fileName) {
          const found = findFileInDir(path.resolve(PUBLIC_DIR, 'TaiLieu'), fileName);
          if (found) sourcePath = found;
        }

        let destFileName = fileName;
        let destPath = path.resolve(trashDir, destFileName);

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
          originalPath: sourcePath ? path.relative(ROOT_DIR, sourcePath).replace(/\\/g, '/') : '',
          originalFolder: it.folderName || it.originalFolder || '',
          fileSize: it.doc?.fileSize || '',
          fileType: it.doc?.fileType || '',
        };

        manifestList.unshift(trashRecord);
        movedFiles.push(trashRecord);
      }

      fs.writeFileSync(manifestPath, JSON.stringify(manifestList, null, 2), 'utf-8');
      sendJson(res, 200, { success: true, count: movedFiles.length, moved: movedFiles });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 6. Mở thư mục Thùng rác
  if (pathname === '/api/open-trash-folder') {
    try {
      const trashDir = path.resolve(PUBLIC_DIR, 'ThungRac');
      if (!fs.existsSync(trashDir)) {
        fs.mkdirSync(trashDir, { recursive: true });
      }
      const safePath = path.normalize(trashDir);
      spawn('explorer.exe', [safePath], { detached: true, stdio: 'ignore' }).unref();
      sendJson(res, 200, { success: true, path: safePath });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 7. Custom Subjects
  if (pathname === '/api/subjects') {
    const customSubjectsFile = path.resolve(PUBLIC_DIR, 'data', 'custom_subjects.json');
    if (req.method === 'GET') {
      try {
        if (fs.existsSync(customSubjectsFile)) {
          const data = fs.readFileSync(customSubjectsFile, 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(data || '[]');
        } else {
          sendJson(res, 200, []);
        }
      } catch (err) {
        sendJson(res, 500, { error: err.message });
      }
      return true;
    }
    if (req.method === 'POST') {
      try {
        const raw = await readBody(req);
        const dir = path.dirname(customSubjectsFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(customSubjectsFile, raw, 'utf-8');
        sendJson(res, 200, { success: true });
      } catch (err) {
        sendJson(res, 500, { error: err.message });
      }
      return true;
    }
  }

  // 8. Create Subject
  if (pathname === '/api/create-subject' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const data = JSON.parse(raw);
      const { id, title, subtitle, dirName, colorScheme, iconType } = data;

      if (!title || !dirName) {
        sendJson(res, 400, { success: false, error: 'Thiếu tên danh mục hoặc tên thư mục' });
        return true;
      }

      const safeDirName = dirName.replace(/[/\\?%*:|"<>]/g, '_').trim();
      const subjectDir = path.resolve(PUBLIC_DIR, 'TaiLieu', safeDirName);

      if (!fs.existsSync(subjectDir)) {
        fs.mkdirSync(subjectDir, { recursive: true });
      }

      const subFolders = ['1_GiaoTrinh', '2_BaiGiang', '3_BaiTap', '4_KiemTra', '5_DeThi'];
      for (const sub of subFolders) {
        const subPath = path.resolve(subjectDir, sub);
        if (!fs.existsSync(subPath)) {
          fs.mkdirSync(subPath, { recursive: true });
        }
      }

      const customSubjectsFile = path.resolve(PUBLIC_DIR, 'data', 'custom_subjects.json');
      let subjectsList = [];
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

      const existingIndex = subjectsList.findIndex((s) => s.id === subjectId || s.dirName === safeDirName);
      if (existingIndex >= 0) {
        subjectsList[existingIndex] = { ...subjectsList[existingIndex], ...newSubject };
      } else {
        subjectsList.push(newSubject);
      }

      const dir = path.dirname(customSubjectsFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(customSubjectsFile, JSON.stringify(subjectsList, null, 2), 'utf-8');

      sendJson(res, 200, { success: true, subject: newSubject, path: subjectDir });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 9. Delete Subject
  if (pathname === '/api/delete-subject' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const data = JSON.parse(raw);
      const { id, dirName, moveToTrash } = data;

      const customSubjectsFile = path.resolve(PUBLIC_DIR, 'data', 'custom_subjects.json');
      if (fs.existsSync(customSubjectsFile)) {
        try {
          let subjectsList = JSON.parse(fs.readFileSync(customSubjectsFile, 'utf-8'));
          if (Array.isArray(subjectsList)) {
            subjectsList = subjectsList.filter((s) => s.id !== id && s.dirName !== dirName);
            fs.writeFileSync(customSubjectsFile, JSON.stringify(subjectsList, null, 2), 'utf-8');
          }
        } catch (e) {}
      }

      if (moveToTrash && dirName) {
        const safeDirName = dirName.replace(/[/\\?%*:|"<>]/g, '_').trim();
        const subjectDir = path.resolve(PUBLIC_DIR, 'TaiLieu', safeDirName);
        const trashDir = path.resolve(PUBLIC_DIR, 'ThungRac');
        if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir, { recursive: true });

        if (fs.existsSync(subjectDir)) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const destTrashFolder = path.resolve(trashDir, `${timestamp}_${safeDirName}`);
          try {
            fs.renameSync(subjectDir, destTrashFolder);
          } catch (e) {
            fs.cpSync(subjectDir, destTrashFolder, { recursive: true });
            fs.rmSync(subjectDir, { recursive: true, force: true });
          }
        }
      }

      sendJson(res, 200, { success: true });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 10. Open Subject Folder
  if (pathname === '/api/open-subject-folder') {
    try {
      let dirName = '';
      if (req.method === 'POST') {
        const raw = await readBody(req);
        const data = JSON.parse(raw);
        dirName = data.dirName || '';
      }
      const targetDir = dirName
        ? path.resolve(PUBLIC_DIR, 'TaiLieu', dirName)
        : path.resolve(PUBLIC_DIR, 'TaiLieu');

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const safePath = path.normalize(targetDir);
      spawn('explorer.exe', [safePath], { detached: true, stdio: 'ignore' }).unref();

      sendJson(res, 200, { success: true, path: safePath });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 11. Custom Categories (GET)
  if (pathname === '/api/custom-categories' && req.method === 'GET') {
    try {
      const customCategoriesFile = path.resolve(PUBLIC_DIR, 'data', 'custom_categories.json');
      if (fs.existsSync(customCategoriesFile)) {
        const data = fs.readFileSync(customCategoriesFile, 'utf-8');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(data || '[]');
      } else {
        sendJson(res, 200, []);
      }
    } catch (err) {
      sendJson(res, 500, { error: err.message });
    }
    return true;
  }

  // 12. Create Custom Category
  if (pathname === '/api/create-custom-category' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const data = JSON.parse(raw);
      const { subject, label, folderName, iconType } = data;

      if (!subject || !label || !folderName) {
        sendJson(res, 400, { success: false, error: 'Thiếu thông tin danh mục hoặc tên thư mục' });
        return true;
      }

      const subjectDirMap = {
        word: 'Word',
        excel: 'Excel',
        powerpoint: 'PPT',
        guide: 'TimHieu',
      };
      const subjDir = subjectDirMap[subject.toLowerCase()] || subject;
      const safeFolderName = folderName.replace(/[/\\?%*:|"<>]/g, '_').trim();
      const physicalCategoryDir = path.resolve(PUBLIC_DIR, 'TaiLieu', subjDir, safeFolderName);

      if (!fs.existsSync(physicalCategoryDir)) {
        fs.mkdirSync(physicalCategoryDir, { recursive: true });
      }

      const customCategoriesFile = path.resolve(PUBLIC_DIR, 'data', 'custom_categories.json');
      let categoriesList = [];
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
        (c) => c.subject === subject.toLowerCase() && c.folderName === safeFolderName
      );
      if (existingIndex >= 0) {
        categoriesList[existingIndex] = { ...categoriesList[existingIndex], ...newCategory };
      } else {
        categoriesList.push(newCategory);
      }

      const dir = path.dirname(customCategoriesFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(customCategoriesFile, JSON.stringify(categoriesList, null, 2), 'utf-8');

      sendJson(res, 200, { success: true, category: newCategory, path: physicalCategoryDir });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  // 13. Delete Custom Category
  if (pathname === '/api/delete-custom-category' && req.method === 'POST') {
    try {
      const raw = await readBody(req);
      const data = JSON.parse(raw);
      const { id, subject, folderName, moveToTrash } = data;

      const customCategoriesFile = path.resolve(PUBLIC_DIR, 'data', 'custom_categories.json');
      if (fs.existsSync(customCategoriesFile)) {
        try {
          let categoriesList = JSON.parse(fs.readFileSync(customCategoriesFile, 'utf-8'));
          if (Array.isArray(categoriesList)) {
            categoriesList = categoriesList.filter((c) => c.id !== id);
            fs.writeFileSync(customCategoriesFile, JSON.stringify(categoriesList, null, 2), 'utf-8');
          }
        } catch (e) {}
      }

      if (moveToTrash && subject && folderName) {
        const subjectDirMap = {
          word: 'Word',
          excel: 'Excel',
          powerpoint: 'PPT',
          guide: 'TimHieu',
        };
        const subjDir = subjectDirMap[subject.toLowerCase()] || subject;
        const sourceDir = path.resolve(PUBLIC_DIR, 'TaiLieu', subjDir, folderName);
        const trashDir = path.resolve(PUBLIC_DIR, 'ThungRac');
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

      sendJson(res, 200, { success: true });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return true;
  }

  return false;
}

// Phục vụ tệp tĩnh (Static files)
function serveStaticFile(res, filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stat.size);
    // Tắt cache cho file động, bật cache cho assets tĩnh
    if (filePath.includes('assets')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    return true;
  } catch (err) {
    return false;
  }
}

// Khởi tạo HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Xử lý API trước
  if (pathname.startsWith('/api/')) {
    const handled = await handleApi(req, res, pathname);
    if (handled) return;
  }

  // Xử lý tệp tĩnh
  // 1. Kiểm tra trong public/ nếu đường dẫn thuộc TaiLieu, ThungRac, data
  if (
    pathname.startsWith('/TaiLieu/') ||
    pathname.startsWith('/ThungRac/') ||
    pathname.startsWith('/data/')
  ) {
    const pubPath = path.resolve(PUBLIC_DIR, pathname.replace(/^\//, ''));
    if (serveStaticFile(res, pubPath)) return;
  }

  // 2. Kiểm tra trong dist/
  const distPath = path.resolve(DIST_DIR, pathname.replace(/^\//, ''));
  if (serveStaticFile(res, distPath)) return;

  // 3. Kiểm tra trong public/ nói chung
  const publicFallback = path.resolve(PUBLIC_DIR, pathname.replace(/^\//, ''));
  if (serveStaticFile(res, publicFallback)) return;

  // 4. SPA Fallback: Nếu không phải tệp tĩnh hoặc API, trả về dist/index.html
  const indexPath = path.resolve(DIST_DIR, 'index.html');
  if (serveStaticFile(res, indexPath)) return;

  res.statusCode = 404;
  res.end('Not Found');
});

// Lấy cổng từ tham số dòng lệnh hoặc biến môi trường hoặc tự động
const preferredPort = parseInt(process.env.PORT || process.argv[2] || '3899', 10);

server.listen(preferredPort, '127.0.0.1', () => {
  const address = server.address();
  const actualPort = address.port;
  console.log(`[GIANGDAY_SERVER_READY] PORT=${actualPort}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // Nếu cổng bận, thử cổng kế tiếp
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const actualPort = address.port;
      console.log(`[GIANGDAY_SERVER_READY] PORT=${actualPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

