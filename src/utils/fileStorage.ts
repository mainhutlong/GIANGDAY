import { DocumentItem } from '../components/DocumentViewerModal';

const DB_NAME = 'GiangDayFileStorage';
const DB_VERSION = 1;
const STORE_NAME = 'uploaded_documents';

export interface StoredFileRecord {
  id: string;
  fileName: string;
  fileType: string;
  blob: Blob;
  updatedAt: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Lưu trữ tệp nhị phân đầy đủ vào IndexedDB
 */
export async function saveFileToIndexedDB(
  id: string,
  file: File | Blob,
  fileName: string,
  fileType: string
): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: StoredFileRecord = {
        id,
        fileName,
        fileType,
        blob: file,
        updatedAt: new Date().toISOString(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Lỗi khi lưu tệp vào IndexedDB:', e);
  }
}

/**
 * Lấy tệp nhị phân từ IndexedDB theo ID
 */
export async function getFileFromIndexedDB(id: string): Promise<StoredFileRecord | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Lỗi khi lấy tệp từ IndexedDB:', e);
    return null;
  }
}

/**
 * Xóa 1 tệp khỏi IndexedDB
 */
export async function deleteFileFromIndexedDB(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Lỗi khi xóa tệp khỏi IndexedDB:', e);
  }
}

/**
 * Xóa nhiều tệp khỏi IndexedDB
 */
export async function deleteMultipleFilesFromIndexedDB(ids: string[]): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      ids.forEach((id) => store.delete(id));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('Lỗi khi xóa nhiều tệp khỏi IndexedDB:', e);
  }
}

/**
 * Chuyển Blob/File sang chuỗi Base64
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Mở tệp bằng Microsoft Office (Word, Excel, PowerPoint) hoặc Trình đọc PDF
 */
export async function openDocumentWithOffice(
  doc: DocumentItem,
  relativePath?: string,
  onFeedback?: (msg: string, status: 'loading' | 'success' | 'warning' | 'error') => void
): Promise<boolean> {
  let appName = 'Microsoft Office';
  let mimeType = 'application/octet-stream';

  if (doc.fileType === 'docx') {
    appName = 'Microsoft Word';
    mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  } else if (doc.fileType === 'xlsx') {
    appName = 'Microsoft Excel';
    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (doc.fileType === 'pptx') {
    appName = 'Microsoft PowerPoint';
    mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  } else if (doc.fileType === 'pdf') {
    appName = 'Trình đọc PDF';
    mimeType = 'application/pdf';
  }

  onFeedback?.(`Đang kết nối để mở "${doc.fileName}" bằng ${appName}...`, 'loading');

  let fileBlob: Blob | null = null;
  let fileBase64 = '';

  // 1. Kiểm tra nếu là tệp người dùng tải lên, lấy Blob từ IndexedDB
  if (doc.id.startsWith('UPLOAD-')) {
    const stored = await getFileFromIndexedDB(doc.id);
    if (stored && stored.blob) {
      fileBlob = stored.blob;
      try {
        fileBase64 = await blobToBase64(fileBlob);
      } catch (e) {
        console.warn('Không thể chuyển đổi blob sang base64', e);
      }
    }
  }

  // 2. Thử mở trực tiếp thông qua API hệ thống nội bộ (/api/open-office)
  try {
    const response = await fetch('/api/open-office', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: doc.fileName,
        base64: fileBase64,
        relativePath: relativePath,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        onFeedback?.(
          `Đã mở tệp "${doc.fileName}" thành công bằng ${appName} trên máy tính!`,
          'success'
        );
        return true;
      }
    }
  } catch (err) {
    console.info('Không thể kết nối API máy chủ nội bộ, chuyển sang cơ chế mở trình duyệt', err);
  }

  // 3. Fallback: Nếu không có kết nối backend hoặc chạy chế độ trình duyệt độc lập
  if (!fileBlob && doc.id.startsWith('UPLOAD-')) {
    if ((doc as any).fileUrl) {
      try {
        const res = await fetch((doc as any).fileUrl);
        fileBlob = await res.blob();
      } catch (e) {}
    }
  }

  if (!fileBlob && relativePath) {
    try {
      const res = await fetch(`/${relativePath}`);
      if (res.ok) fileBlob = await res.blob();
    } catch (e) {}
  }

  if (fileBlob) {
    const typedBlob = new Blob([fileBlob], { type: mimeType });
    const blobUrl = URL.createObjectURL(typedBlob);

    // Đối với PDF, mở trực tiếp trên tab mới
    if (doc.fileType === 'pdf') {
      window.open(blobUrl, '_blank');
      onFeedback?.(`Đang mở tệp PDF "${doc.fileName}" trên tab mới...`, 'success');
      return true;
    }

    // Đối với Word, Excel, PowerPoint: kích hoạt tải file về máy để người dùng nhấp mở bằng Office
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onFeedback?.(
      `Đã chuyển tệp "${doc.fileName}" sang máy tính. Bạn chỉ cần nhấp vào tệp tải xuống để mở ngay bằng ${appName}!`,
      'success'
    );
    return true;
  }

  onFeedback?.(
    `Không thể mở tệp "${doc.fileName}". Vui lòng kiểm tra lại tệp tin.`,
    'error'
  );
  return false;
}

