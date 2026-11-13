import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Eye,
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  ChevronRight,
  Filter,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  UploadCloud,
  Trash2,
  FolderOpen,
  ExternalLink,
  Loader2,
  AlertCircle,
  X,
  FolderPlus,
  BookOpen,
  Video,
  Folder,
  Code2,
} from 'lucide-react';
import { WordIcon, ExcelIcon, PowerPointIcon, ExploreIcon } from './OfficeIcons';
import {
  DocumentSealIcon,
  FolderHierarchyIcon,
  ClipboardReviewIcon,
  ExamPaperIcon,
  CalendarTimerIcon,
} from './CustomMenuIcons';
import { DocumentViewerModal, DocumentItem } from './DocumentViewerModal';
import { TrashModal, TrashItem } from './TrashModal';
import {
  saveFileToIndexedDB,
  deleteFileFromIndexedDB,
  deleteMultipleFilesFromIndexedDB,
  blobToBase64,
  openDocumentWithOffice,
} from '../utils/fileStorage';
import { CustomCategory } from '../types/category';
import { CreateCategoryModal } from './CreateCategoryModal';

export type SubjectType = 'word' | 'excel' | 'powerpoint' | 'guide';
export type TabType = 'curriculum' | 'lectures' | 'practice' | 'quiz' | 'exam' | string;

interface SubjectWorkspaceProps {
  subject: SubjectType;
  onBack: () => void;
  onAddScore: (points: number) => void;
}

export const SubjectWorkspace: React.FC<SubjectWorkspaceProps> = ({
  subject,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<string>('curriculum');
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState<boolean>(false);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => {
    try {
      const data = localStorage.getItem('giangday_custom_categories');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetch('/api/custom-categories')
      .then((res) => res.json())
      .then((list) => {
        if (Array.isArray(list)) {
          setCustomCategories(list);
          try {
            localStorage.setItem('giangday_custom_categories', JSON.stringify(list));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const currentSubjectCategories = customCategories.filter(
    (c) => c.subject.toLowerCase() === subject.toLowerCase()
  );

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [isTrashOpen, setIsTrashOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'loading' | 'success' | 'warning' | 'error';
    visible: boolean;
  }>({
    message: '',
    type: 'success',
    visible: false,
  });

  // Tự động ẩn thông báo sau 5 giây (nếu không phải đang tải)
  useEffect(() => {
    if (toast.visible && toast.type !== 'loading') {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, toast.type]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    setSelectedDocIds([]);
  }, [activeTab, subject]);

  const [customDocs, setCustomDocs] = useState<Record<string, DocumentItem[]>>(() => {
    try {
      const data = localStorage.getItem('giangday_user_uploaded_files');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  });

  // Tự động nạp danh sách tệp từ thư mục mã nguồn khi chạy trên máy mới
  useEffect(() => {
    fetch('/api/documents-manifest')
      .then((res) => res.json())
      .then((manifest) => {
        if (manifest && typeof manifest === 'object') {
          setCustomDocs(manifest);
          try {
            localStorage.setItem('giangday_user_uploaded_files', JSON.stringify(manifest));
          } catch (e) {}
        }
      })
      .catch(() => {});

    // Đồng bộ danh mục thùng rác từ tệp vật lý trên máy
    fetch('/ThungRac/trash_manifest.json')
      .then((res) => res.json())
      .then((trashList) => {
        if (Array.isArray(trashList)) {
          setTrashItems(trashList);
          try {
            localStorage.setItem('giangday_trash_items', JSON.stringify(trashList));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const isFirstDocsRender = useRef(true);

  // Lưu manifest vào tệp mã nguồn khi người dùng thay đổi dữ liệu
  useEffect(() => {
    try {
      localStorage.setItem('giangday_user_uploaded_files', JSON.stringify(customDocs));
      if (isFirstDocsRender.current) {
        isFirstDocsRender.current = false;
        return;
      }
      if (Object.keys(customDocs).length > 0) {
        fetch('/api/documents-manifest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customDocs),
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('LocalStorage limit reached', e);
    }
  }, [customDocs]);

  const [deletedDocIds, setDeletedDocIds] = useState<string[]>(() => {
    try {
      const data = localStorage.getItem('giangday_deleted_doc_ids');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [trashItems, setTrashItems] = useState<TrashItem[]>(() => {
    try {
      const data = localStorage.getItem('giangday_trash_items');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const getCategoryFolder = (subj: string, tabId: string): { dir: string; tabFolder: string } => {
    let dir = 'Word';
    if (subj === 'excel') dir = 'Excel';
    else if (subj === 'powerpoint') dir = 'PPT';
    else if (subj === 'guide') dir = 'TimHieu';

    const standardTabs: Record<string, string> = {
      curriculum: '1_GiaoTrinh',
      lectures: '2_BaiGiang',
      practice: '3_BaiTap',
      quiz: '4_KiemTra',
      exam: '5_DeThi',
    };
    if (standardTabs[tabId]) {
      return { dir, tabFolder: standardTabs[tabId] };
    }

    // Kiểm tra danh mục con tự tạo
    const customCat = customCategories.find((c) => c.id === tabId);
    if (customCat) {
      return { dir, tabFolder: customCat.folderName };
    }

    return { dir, tabFolder: tabId };
  };

  const currentCategoryFolder = getCategoryFolder(subject, activeTab);
  const currentFolderKey = `${subject}_${activeTab}`;
  const currentFolderPath = `public/TaiLieu/${currentCategoryFolder.dir}/${currentCategoryFolder.tabFolder}/`;

  const handleCategoryCreated = (newCat: CustomCategory) => {
    setCustomCategories((prev) => {
      const updated = [...prev.filter((c) => c.id !== newCat.id), newCat];
      try {
        localStorage.setItem('giangday_custom_categories', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setActiveTab(newCat.id);
    setToast({
      message: `Đã tạo thành công danh mục "${newCat.label}" và thư mục "${newCat.folderName}"!`,
      type: 'success',
      visible: true,
    });
  };

  const handleDeleteCustomCategory = async (catId: string, folderName: string, label: string) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa danh mục "${label}"?\nThư mục "${folderName}" sẽ được chuyển an toàn vào Thùng rác của dự án.`
      )
    ) {
      return;
    }

    try {
      await fetch('/api/delete-custom-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: catId, subject, folderName, moveToTrash: true }),
      });
    } catch (e) {}

    setCustomCategories((prev) => {
      const updated = prev.filter((c) => c.id !== catId);
      try {
        localStorage.setItem('giangday_custom_categories', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (activeTab === catId) {
      setActiveTab('curriculum');
    }

    setToast({
      message: `Đã xóa danh mục "${label}". Thư mục đã được chuyển vào Thùng rác.`,
      type: 'success',
      visible: true,
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newDocs: DocumentItem[] = [];
    const filesArray = Array.from(files);

    setToast({
      message: `Đang xử lý và lưu trữ ${filesArray.length} tệp tin...`,
      type: 'loading',
      visible: true,
    });

    for (let index = 0; index < filesArray.length; index++) {
      const file = filesArray[index];
      const ext = file.name.split('.').pop()?.toLowerCase();
      let fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' = 'docx';
      if (ext === 'pdf') fileType = 'pdf';
      else if (ext === 'xlsx' || ext === 'xls') fileType = 'xlsx';
      else if (ext === 'pptx' || ext === 'ppt') fileType = 'pptx';

      const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      };

      const docId = `UPLOAD-${Date.now()}-${index}`;
      const docItem: DocumentItem = {
        id: docId,
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileType,
        fileSize: formatSize(file.size),
        pages: 1,
        updatedAt: new Date().toLocaleDateString('vi-VN'),
        category: 'Tệp tải lên',
        description: `Tệp tải lên lưu tại ${currentFolderPath}`,
        contentPages: [
          {
            pageNumber: 1,
            title: file.name,
            body: (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="font-bold text-blue-900">Chi tiết tệp tin đã tải lên:</p>
                  <ul className="text-sm text-blue-800 list-disc list-inside mt-2 space-y-1">
                    <li>Tên tệp: <strong className="font-mono">{file.name}</strong></li>
                    <li>Dung lượng: {formatSize(file.size)}</li>
                    <li>Vị trí phân mục: <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded">{currentFolderPath}</span></li>
                  </ul>
                </div>
                <p className="text-slate-600 text-sm italic">
                  Tệp tin đã được lưu trữ trong danh mục và sẵn sàng để mở bằng Microsoft Office hoặc tải về.
                </p>
              </div>
            ),
          },
        ],
      };

      // 1. Lưu nội dung nhị phân vào IndexedDB để lưu trữ vĩnh viễn trên trình duyệt
      await saveFileToIndexedDB(docId, file, file.name, fileType);

      // 2. Tạo blob URL hỗ trợ tải về hoặc xem ngay trong phiên hiện tại
      try {
        const blobUrl = URL.createObjectURL(file);
        (docItem as any).fileUrl = blobUrl;
      } catch (e) {
        console.warn('Could not create blob URL for file', e);
      }

      // 3. Gửi tệp lên API cục bộ để ghi trực tiếp vào thư mục mã nguồn
      try {
        const base64 = await blobToBase64(file);
        await fetch('/api/save-uploaded-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            base64,
            folderPath: currentFolderPath,
          }),
        });
      } catch (e) {
        // Bỏ qua nếu chạy môi trường tĩnh
      }

      newDocs.push(docItem);
    }

    const updated = {
      ...customDocs,
      [currentFolderKey]: [...(customDocs[currentFolderKey] || []), ...newDocs],
    };

    setCustomDocs(updated);
    try {
      localStorage.setItem('giangday_user_uploaded_files', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage limit reached', e);
    }

    setToast({
      message: `Đã nhập thành công ${filesArray.length} tệp tin! Bạn có thể nhấp để mở trực tiếp bằng Microsoft Office.`,
      type: 'success',
      visible: true,
    });
  };

  const handleDeleteFile = (doc: DocumentItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn chuyển tệp "${doc.fileName}" vào Thùng rác?`)) {
      return;
    }

    // Đưa tệp vào danh sách thùng rác
    const trashEntry: TrashItem = {
      id: `TRASH-${Date.now()}-${doc.id}`,
      doc,
      deletedAt: `${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${new Date().toLocaleDateString('vi-VN')}`,
      originalSubject: subject,
      originalTab: activeTab,
      folderName: `${config?.title || subject} • ${navItems.find((n) => n.id === activeTab)?.label || 'Giáo trình'}`,
      isUploaded: doc.id.startsWith('UPLOAD-'),
    };

    const newTrash = [trashEntry, ...trashItems];
    setTrashItems(newTrash);
    try {
      localStorage.setItem('giangday_trash_items', JSON.stringify(newTrash));
    } catch (e) {
      console.warn(e);
    }

    if (doc.id.startsWith('UPLOAD-')) {
      // Ẩn tệp do người dùng tải lên
      const updated = {
        ...customDocs,
        [currentFolderKey]: (customDocs[currentFolderKey] || []).filter((d) => d.id !== doc.id),
      };
      setCustomDocs(updated);
      try {
        localStorage.setItem('giangday_user_uploaded_files', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
    } else {
      // Ẩn tệp mặc định khỏi danh mục
      const updatedDeleted = [...deletedDocIds, doc.id];
      setDeletedDocIds(updatedDeleted);
      try {
        localStorage.setItem('giangday_deleted_doc_ids', JSON.stringify(updatedDeleted));
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
    }
  };

  const handleRestoreTrashItem = (item: TrashItem) => {
    const key = `${item.originalSubject}_${item.originalTab}`;
    if (item.isUploaded) {
      const updated = {
        ...customDocs,
        [key]: [...(customDocs[key] || []), item.doc],
      };
      setCustomDocs(updated);
      try {
        localStorage.setItem('giangday_user_uploaded_files', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
    } else {
      const updatedDeleted = deletedDocIds.filter((id) => id !== item.doc.id);
      setDeletedDocIds(updatedDeleted);
      try {
        localStorage.setItem('giangday_deleted_doc_ids', JSON.stringify(updatedDeleted));
      } catch (e) {
        console.warn(e);
      }
    }

    const updatedTrash = trashItems.filter((t) => t.id !== item.id);
    setTrashItems(updatedTrash);
    try {
      localStorage.setItem('giangday_trash_items', JSON.stringify(updatedTrash));
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePermanentDeleteTrashItem = async (item: TrashItem) => {
    if (item.isUploaded) {
      await deleteFileFromIndexedDB(item.doc.id);
    }

    // Di chuyển tệp vật lý vào thư mục Thùng rác trong dự án (public/ThungRac)
    try {
      fetch('/api/move-to-project-trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              id: item.id,
              fileName: item.doc.fileName,
              relativePath: `TaiLieu/${getCategoryFolder(item.originalSubject, item.originalTab).dir}/${getCategoryFolder(item.originalSubject, item.originalTab).tabFolder}/${item.doc.fileName}`,
              folderName: item.folderName,
              doc: item.doc,
            },
          ],
        }),
      }).catch(() => {});
    } catch (e) {}

    const updatedTrash = trashItems.filter((t) => t.id !== item.id);
    setTrashItems(updatedTrash);
    try {
      localStorage.setItem('giangday_trash_items', JSON.stringify(updatedTrash));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleRestoreMultipleTrashItems = (itemsToRestore: TrashItem[]) => {
    let updatedCustom = { ...customDocs };
    let updatedDeleted = [...deletedDocIds];
    const restoredIds = itemsToRestore.map((i) => i.id);

    itemsToRestore.forEach((item) => {
      const key = `${item.originalSubject}_${item.originalTab}`;
      if (item.isUploaded) {
        updatedCustom[key] = [...(updatedCustom[key] || []), item.doc];
      } else {
        updatedDeleted = updatedDeleted.filter((id) => id !== item.doc.id);
      }
    });

    setCustomDocs(updatedCustom);
    setDeletedDocIds(updatedDeleted);
    const updatedTrash = trashItems.filter((t) => !restoredIds.includes(t.id));
    setTrashItems(updatedTrash);
    try {
      localStorage.setItem('giangday_user_uploaded_files', JSON.stringify(updatedCustom));
      localStorage.setItem('giangday_deleted_doc_ids', JSON.stringify(updatedDeleted));
      localStorage.setItem('giangday_trash_items', JSON.stringify(updatedTrash));
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePermanentDeleteMultipleTrashItems = async (itemsToDelete: TrashItem[]) => {
    const uploadedIds = itemsToDelete.filter((i) => i.isUploaded).map((i) => i.doc.id);
    if (uploadedIds.length > 0) {
      await deleteMultipleFilesFromIndexedDB(uploadedIds);
    }

    // Di chuyển các tệp vật lý vào thư mục Thùng rác trong dự án (public/ThungRac)
    try {
      const itemsPayload = itemsToDelete.map((item) => ({
        id: item.id,
        fileName: item.doc.fileName,
        relativePath: `TaiLieu/${getCategoryFolder(item.originalSubject, item.originalTab).dir}/${getCategoryFolder(item.originalSubject, item.originalTab).tabFolder}/${item.doc.fileName}`,
        folderName: item.folderName,
        doc: item.doc,
      }));
      fetch('/api/move-to-project-trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPayload }),
      }).catch(() => {});
    } catch (e) {}

    const deleteIds = itemsToDelete.map((i) => i.id);
    const updatedTrash = trashItems.filter((t) => !deleteIds.includes(t.id));
    setTrashItems(updatedTrash);
    try {
      localStorage.setItem('giangday_trash_items', JSON.stringify(updatedTrash));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleRestoreAllTrash = () => {
    let updatedCustom = { ...customDocs };
    let updatedDeleted = [...deletedDocIds];

    trashItems.forEach((item) => {
      const key = `${item.originalSubject}_${item.originalTab}`;
      if (item.isUploaded) {
        updatedCustom[key] = [...(updatedCustom[key] || []), item.doc];
      } else {
        updatedDeleted = updatedDeleted.filter((id) => id !== item.doc.id);
      }
    });

    setCustomDocs(updatedCustom);
    setDeletedDocIds(updatedDeleted);
    setTrashItems([]);
    try {
      localStorage.setItem('giangday_user_uploaded_files', JSON.stringify(updatedCustom));
      localStorage.setItem('giangday_deleted_doc_ids', JSON.stringify(updatedDeleted));
      localStorage.removeItem('giangday_trash_items');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleEmptyTrash = async () => {
    if (
      !window.confirm(
        'Bạn có chắc chắn muốn dọn sạch thùng rác? Tất cả tệp sẽ được lưu an toàn vào Thư mục Thùng rác trong dự án.'
      )
    ) {
      return;
    }

    // Di chuyển toàn bộ các tệp vật lý vào thư mục Thùng rác trong dự án
    try {
      const itemsPayload = trashItems.map((item) => ({
        id: item.id,
        fileName: item.doc.fileName,
        relativePath: `TaiLieu/${getCategoryFolder(item.originalSubject, item.originalTab).dir}/${getCategoryFolder(item.originalSubject, item.originalTab).tabFolder}/${item.doc.fileName}`,
        folderName: item.folderName,
        doc: item.doc,
      }));
      await fetch('/api/move-to-project-trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsPayload }),
      });
    } catch (e) {}

    setTrashItems([]);
    try {
      localStorage.removeItem('giangday_trash_items');
    } catch (e) {
      console.warn(e);
    }
  };

  // Chọn hoặc bỏ chọn 1 tệp (Stick box)
  const handleToggleSelectDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  // Chọn hoặc bỏ chọn tất cả tệp đang hiển thị
  const handleSelectAll = () => {
    const allFilteredIds = filteredDocuments.map((d) => d.id);
    const isAllSelected =
      allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedDocIds.includes(id));

    if (isAllSelected) {
      setSelectedDocIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedDocIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  // Xóa đồng loạt các tệp đã được tick chọn (Chuyển vào Thùng rác)
  const handleDeleteSelectedDocs = () => {
    const selectedInView = selectedDocIds.filter((id) =>
      filteredDocuments.some((d) => d.id === id)
    );
    if (selectedInView.length === 0) return;

    if (
      !window.confirm(
        `Bạn có chắc chắn muốn chuyển ${selectedInView.length} tệp đã chọn vào Thùng rác?`
      )
    ) {
      return;
    }

    const docsToDelete = filteredDocuments.filter((d) => selectedInView.includes(d.id));

    // Tạo danh sách mục thùng rác
    const newTrashEntries: TrashItem[] = docsToDelete.map((doc) => ({
      id: `TRASH-${Date.now()}-${doc.id}-${Math.random().toString(36).substring(2, 6)}`,
      doc,
      deletedAt: `${new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })} ${new Date().toLocaleDateString('vi-VN')}`,
      originalSubject: subject,
      originalTab: activeTab,
      folderName: `${config?.title || subject} • ${
        navItems.find((n) => n.id === activeTab)?.label || 'Giáo trình'
      }`,
      isUploaded: doc.id.startsWith('UPLOAD-'),
    }));

    const updatedTrash = [...newTrashEntries, ...trashItems];
    setTrashItems(updatedTrash);
    try {
      localStorage.setItem('giangday_trash_items', JSON.stringify(updatedTrash));
    } catch (e) {
      console.warn(e);
    }

    // Tách tệp upload và tệp mặc định
    const uploadedIds = selectedInView.filter((id) => id.startsWith('UPLOAD-'));
    const defaultIds = selectedInView.filter((id) => !id.startsWith('UPLOAD-'));

    if (uploadedIds.length > 0) {
      const updated = {
        ...customDocs,
        [currentFolderKey]: (customDocs[currentFolderKey] || []).filter(
          (d) => !uploadedIds.includes(d.id)
        ),
      };
      setCustomDocs(updated);
      try {
        localStorage.setItem('giangday_user_uploaded_files', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
    }

    if (defaultIds.length > 0) {
      const updatedDeleted = Array.from(new Set([...deletedDocIds, ...defaultIds]));
      setDeletedDocIds(updatedDeleted);
      try {
        localStorage.setItem('giangday_deleted_doc_ids', JSON.stringify(updatedDeleted));
      } catch (e) {
        console.warn(e);
      }
    }

    setSelectedDocIds((prev) => prev.filter((id) => !selectedInView.includes(id)));
  };

  const handleDownloadFile = (doc: DocumentItem) => {
    if ((doc as any).fileUrl) {
      const link = document.createElement('a');
      link.href = (doc as any).fileUrl;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const localPath = `/TaiLieu/${currentCategoryFolder.dir}/${currentCategoryFolder.tabFolder}/${doc.fileName}`;
    const link = document.createElement('a');
    link.href = localPath;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Subject Branding Configuration
  const getSubjectConfig = () => {
    switch (subject) {
      case 'excel':
        return {
          title: 'Microsoft Excel',
          code: 'Mô-đun Kỹ năng IU04',
          sub: 'Kho tài liệu & tệp tin học tập: Bảng tính điện tử & công thức',
          color: '#107C41',
          bgHeader: 'from-emerald-700 via-emerald-600 to-teal-700',
          icon: <ExcelIcon className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" />,
          dirName: 'Excel',
        };
      case 'powerpoint':
        return {
          title: 'Microsoft PowerPoint',
          code: 'Mô-đun Kỹ năng IU05',
          sub: 'Kho tài liệu & tệp tin học tập: Thiết kế bài trình chiếu chuyên nghiệp',
          color: '#D83B01',
          bgHeader: 'from-orange-600 via-orange-500 to-amber-600',
          icon: <PowerPointIcon className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" />,
          dirName: 'PPT',
        };
      case 'guide':
        return {
          title: 'Tìm hiểu Tin học',
          code: 'Mô-đun Kiến thức Tổng quan',
          sub: 'Kho tài liệu giáo trình & cẩm nang học tập Tin học',
          color: '#6D28D9',
          bgHeader: 'from-purple-700 via-indigo-600 to-violet-700',
          icon: <ExploreIcon className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" />,
          dirName: 'TimHieu',
        };
      case 'word':
      default:
        return {
          title: 'Microsoft Word',
          code: 'Mô-đun Kỹ năng IU03',
          sub: 'Kho tài liệu & tệp tin học tập: Soạn thảo văn bản chuẩn',
          color: '#0D62D9',
          bgHeader: 'from-blue-700 via-blue-600 to-indigo-700',
          icon: <WordIcon className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" />,
          dirName: 'Word',
        };
    }
  };

  const config = getSubjectConfig();

  const handleOpenSubjectFolder = () => {
    fetch('/api/open-subject-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dirName: config.dirName }),
    }).catch(() => {});
  };

  // Left Menu Items: If subject === 'guide', only 1 item 'Giáo trình' per user request; otherwise 5 standard items
  const defaultNavItems: {
    id: string;
    label: string;
    icon: React.ReactNode;
    folderName?: string;
    isCustom?: boolean;
  }[] =
    subject === 'guide'
      ? [
          {
            id: 'curriculum',
            label: 'Giáo trình',
            icon: <DocumentSealIcon className="w-8 h-8 sm:w-9 sm:h-9" />,
          },
        ]
      : [
          {
            id: 'curriculum',
            label: 'Giáo trình',
            icon: <DocumentSealIcon className="w-8 h-8 sm:w-9 sm:h-9" />,
          },
          {
            id: 'lectures',
            label: 'Quản lý bài giảng',
            icon: <FolderHierarchyIcon className="w-8 h-8 sm:w-9 sm:h-9" />,
          },
          {
            id: 'practice',
            label: 'Bài tập thực hành',
            icon: <ClipboardReviewIcon className="w-8 h-8 sm:w-9 sm:h-9" />,
          },
          {
            id: 'quiz',
            label: 'Bài kiểm tra lý thuyết',
            icon: <ExamPaperIcon className="w-8 h-8 sm:w-9 sm:h-9" />,
          },
          {
            id: 'exam',
            label: 'Bài thi',
            icon: <CalendarTimerIcon className="w-8 h-8 sm:w-9 sm:h-9" />,
          },
        ];

  const renderCustomCategoryIcon = (iconType?: string) => {
    const iconClass = 'w-7 h-7 sm:w-8 sm:h-8';
    switch (iconType) {
      case 'book':
        return <BookOpen className={`${iconClass} text-blue-500`} />;
      case 'video':
        return <Video className={`${iconClass} text-rose-500`} />;
      case 'fileText':
        return <FileText className={`${iconClass} text-emerald-500`} />;
      case 'sparkles':
        return <Sparkles className={`${iconClass} text-purple-500`} />;
      case 'layers':
        return <Layers className={`${iconClass} text-indigo-500`} />;
      case 'code':
        return <Code2 className={`${iconClass} text-cyan-500`} />;
      case 'folder':
      default:
        return <Folder className={`${iconClass} text-amber-500`} />;
    }
  };

  const customNavItems = currentSubjectCategories.map((c) => ({
    id: c.id,
    label: c.label,
    folderName: c.folderName,
    icon: renderCustomCategoryIcon(c.iconType),
    isCustom: true,
  }));

  const navItems = [...defaultNavItems, ...customNavItems];

  // Kho tài liệu tệp tin: Không chứa tài liệu mẫu giả lập, chỉ hiển thị tài liệu thật do người dùng tải lên hoặc có trong thư mục
  const getDocuments = (): DocumentItem[] => {
    return [];
  };

  const currentCustomDocs = customDocs[currentFolderKey] || [];
  const defaultDocs = getDocuments().filter((doc) => !deletedDocIds.includes(doc.id));
  const allDocuments = [...currentCustomDocs, ...defaultDocs];
  const filteredDocuments = allDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenFile = async (doc: DocumentItem) => {
    const relativePath = `TaiLieu/${currentCategoryFolder.dir}/${currentCategoryFolder.tabFolder}/${doc.fileName}`;
    await openDocumentWithOffice(doc, relativePath, (msg, status) => {
      setToast({
        message: msg,
        type: status,
        visible: true,
      });
    });
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6 animate-fadeIn">
      {/* Top Breadcrumb & Return Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <span className="cursor-pointer hover:underline" onClick={onBack}>Trang chủ</span>
          <span>&gt;</span>
          <span className="font-bold text-slate-800">{config.title}</span>
          <span>&gt;</span>
          <span className="text-blue-700 font-semibold">
            {navItems.find((n) => n.id === activeTab)?.label}
          </span>
        </div>
      </div>

      {/* Subject Hero Header */}
      <div className={`bg-gradient-to-r ${config.bgHeader} rounded-3xl p-5 sm:p-6 text-white shadow-lg mb-8 relative overflow-hidden`}>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-sm border border-white/20">
              {config.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {config.title}
              </h1>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                {config.sub}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenSubjectFolder}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs sm:text-sm font-bold backdrop-blur-sm border border-white/25 shadow-xs transition-all cursor-pointer"
            title="Mở thư mục vật lý chứa tài liệu môn học này trong File Explorer của máy tính"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Mở thư mục trên máy</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout: 5 Left Buttons (3 cols) + Right Wide Content Area (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ================= LEFT SIDEBAR (5 BUTTONS - MATCHING REFERENCE IMAGE) ================= */}
        <div className="lg:col-span-3 xl:col-span-3 bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-sm sticky top-20 select-none">
          <div className="px-3 pb-3 mb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight uppercase">
              Danh mục học tập
            </h3>
          </div>

          {/* Vertical Menu List with 3D Icons, Clean Labels (NO descriptions), and Dashed Dividers */}
          <div className="divide-y divide-dashed divide-slate-200/90">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isCustom = (item as any).isCustom;
              return (
                <div
                  key={item.id}
                  className={`w-full group/item relative flex items-center justify-between rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#EAF3FE] text-[#0D62D9] font-bold shadow-sm'
                      : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className="flex-1 text-left py-3.5 px-3.5 flex items-center justify-between cursor-pointer focus:outline-none min-w-0"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="shrink-0 transition-transform group-hover/item:scale-110 drop-shadow-sm">
                        {item.icon}
                      </div>

                      <span
                        className={`text-sm sm:text-base leading-tight truncate ${
                          isActive ? 'font-bold text-[#0D62D9]' : 'font-medium text-slate-800'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>

                    {!isCustom && (
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? 'text-[#0D62D9] translate-x-0.5'
                            : 'text-slate-300 group-hover/item:translate-x-0.5 group-hover/item:text-slate-500'
                        }`}
                      />
                    )}
                  </button>

                  {isCustom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomCategory(
                          item.id,
                          (item as any).folderName,
                          item.label
                        );
                      }}
                      title="Xóa danh mục này"
                      className="mr-2 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nút tạo danh mục học tập con mới */}
          <button
            type="button"
            onClick={() => setIsCreateCategoryOpen(true)}
            className="w-full mt-3.5 py-3 px-3.5 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-100/70 text-blue-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
          >
            <FolderPlus className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span>+ Thêm danh mục học tập</span>
          </button>
        </div>

        {/* ================= RIGHT WIDE FILE REPOSITORY & VIEWER (9 COLS) ================= */}
        <div className="lg:col-span-9 xl:col-span-9 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm min-h-[620px]">
          {/* Header of Content Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {navItems.find((n) => n.id === activeTab)?.label}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredDocuments.length} tệp
                </span>
                {deletedDocIds.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có muốn khôi phục lại các tệp mặc định đã xóa không?')) {
                        setDeletedDocIds([]);
                        try {
                          localStorage.removeItem('giangday_deleted_doc_ids');
                        } catch (e) {
                          console.warn(e);
                        }
                      }
                    }}
                    className="text-[11px] text-slate-500 hover:text-blue-600 underline font-medium ml-2 transition-colors"
                    title="Khôi phục tệp mặc định đã xóa"
                  >
                    Khôi phục tệp gốc ({deletedDocIds.length})
                  </button>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h2>
            </div>

            {/* Actions: Search Input + Nút Tải Tệp Lên */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Input for files */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Tìm tệp tài liệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.zip"
                onChange={(e) => {
                  handleFileUpload(e.target.files);
                  if (e.target) e.target.value = '';
                }}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                title="Tải tệp tài liệu lên mục này"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Tải tệp lên</span>
              </button>

              {/* Thùng rác Button */}
              <button
                onClick={() => setIsTrashOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl text-xs sm:text-sm font-semibold transition-all border border-slate-200 hover:border-rose-300 shrink-0 shadow-sm"
                title="Mở Thùng rác - Xem các tệp đã xóa"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span className="hidden sm:inline">Thùng rác</span>
                {trashItems.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold leading-none">
                    {trashItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Select All & Bulk Action Bar (Stick box để xóa đồng loạt) */}
          {filteredDocuments.length > 0 && (
            <div className="pt-4 pb-2 border-b border-slate-100 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <label className="inline-flex items-center gap-2.5 cursor-pointer font-medium text-slate-600 hover:text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={
                    filteredDocuments.length > 0 &&
                    filteredDocuments.every((d) => selectedDocIds.includes(d.id))
                  }
                  ref={(el) => {
                    if (el) {
                      const count = filteredDocuments.filter((d) => selectedDocIds.includes(d.id)).length;
                      el.indeterminate = count > 0 && count < filteredDocuments.length;
                    }
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span>
                  Chọn tất cả ({filteredDocuments.length} tệp)
                </span>
              </label>

              {selectedDocIds.filter((id) => filteredDocuments.some((d) => d.id === id)).length > 0 && (
                <div className="flex items-center gap-2 animate-fadeIn">
                  <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                    Đã chọn {selectedDocIds.filter((id) => filteredDocuments.some((d) => d.id === id)).length} tệp:
                  </span>
                  <button
                    onClick={handleDeleteSelectedDocs}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition-all border border-rose-200 hover:border-rose-600 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                    title="Xóa đồng loạt các tệp đã chọn"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span>Xóa đã chọn ({selectedDocIds.filter((id) => filteredDocuments.some((d) => d.id === id)).length})</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Files List - Clean: Checkbox + Icon + File Name (clickable to view) + Download + Delete */}
          <div className="pt-2 divide-y divide-slate-100">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`py-3 px-3 sm:px-4 rounded-xl transition-all duration-150 flex items-center justify-between gap-3 group ${
                    selectedDocIds.includes(doc.id)
                      ? 'bg-blue-50/80 border border-blue-200 shadow-xs'
                      : 'hover:bg-blue-50/60 border border-transparent'
                  }`}
                >
                  {/* Stick box (Checkbox) */}
                  <div className="shrink-0 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDocIds.includes(doc.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSelectDoc(doc.id);
                      }}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600 transition-transform group-hover:scale-110"
                      title="Chọn tệp này"
                    />
                  </div>

                  {/* Left: Icon + File Name (Clicking name opens file with Microsoft Office) */}
                  <button
                    onClick={() => handleOpenFile(doc)}
                    className="flex items-center gap-3.5 min-w-0 text-left focus:outline-none flex-1 group/btn"
                    title={`Nhấp để mở "${doc.fileName}" bằng ${
                      doc.fileType === 'docx'
                        ? 'Microsoft Word'
                        : doc.fileType === 'xlsx'
                        ? 'Microsoft Excel'
                        : doc.fileType === 'pptx'
                        ? 'Microsoft PowerPoint'
                        : 'Trình đọc PDF'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/btn:scale-105 ${
                        doc.fileType === 'pdf'
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : doc.fileType === 'docx'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : doc.fileType === 'xlsx'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}
                    >
                      {doc.fileType === 'pdf' && <FileText className="w-5 h-5 text-red-600" />}
                      {doc.fileType === 'docx' && <FileText className="w-5 h-5 text-blue-600" />}
                      {doc.fileType === 'xlsx' && <FileSpreadsheet className="w-5 h-5 text-emerald-600" />}
                      {doc.fileType === 'pptx' && <Layers className="w-5 h-5 text-orange-600" />}
                    </div>

                    <div className="min-w-0 flex-1 flex items-center gap-2">
                      <p className="font-semibold text-slate-800 text-sm sm:text-base group-hover/btn:text-blue-600 transition-colors truncate">
                        {doc.fileName}
                      </p>
                      {doc.id.startsWith('UPLOAD-') && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Mới tải lên
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Right: Mở bằng Office + Download icon + Trash can icon */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFile(doc);
                      }}
                      className={`p-2 sm:p-2.5 rounded-xl transition-all shrink-0 shadow-sm hover:scale-105 active:scale-95 ${
                        doc.fileType === 'pdf'
                          ? 'bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600'
                          : doc.fileType === 'docx'
                          ? 'bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600'
                          : doc.fileType === 'xlsx'
                          ? 'bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600'
                          : 'bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-600'
                      }`}
                      title={`Mở tệp bằng ${
                        doc.fileType === 'docx'
                          ? 'Microsoft Word'
                          : doc.fileType === 'xlsx'
                          ? 'Microsoft Excel'
                          : doc.fileType === 'pptx'
                          ? 'Microsoft PowerPoint'
                          : 'Trình đọc PDF'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadFile(doc);
                      }}
                      className="p-2 sm:p-2.5 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded-xl transition-all shrink-0 border border-slate-200 hover:border-blue-600 shadow-sm hover:scale-105 active:scale-95"
                      title={`Tải về: ${doc.fileName}`}
                    >
                      <Download className="w-4 h-4 shrink-0" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(doc);
                      }}
                      className="p-2 sm:p-2.5 bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all shrink-0 border border-rose-200 hover:border-rose-600 shadow-sm hover:scale-105 active:scale-95"
                      title={`Xóa tệp: ${doc.fileName}`}
                    >
                      <Trash2 className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="font-medium text-slate-600">Không tìm thấy tài liệu phù hợp</p>
                <p className="text-xs text-slate-400 mt-1">Hãy thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive In-App Document / PDF Viewer Modal */}
      <DocumentViewerModal
        document={selectedDoc}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />

      {/* Recycle Bin Modal */}
      <TrashModal
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        trashItems={trashItems}
        onRestore={handleRestoreTrashItem}
        onPermanentDelete={handlePermanentDeleteTrashItem}
        onRestoreAll={handleRestoreAllTrash}
        onEmptyTrash={handleEmptyTrash}
        onRestoreMultiple={handleRestoreMultipleTrashItems}
        onPermanentDeleteMultiple={handlePermanentDeleteMultipleTrashItems}
      />

      {/* Modal tạo danh mục học tập con mới */}
      <CreateCategoryModal
        isOpen={isCreateCategoryOpen}
        subject={subject}
        subjectTitle={config.title}
        existingCount={navItems.length}
        existingFolderNames={[
          '1_GiaoTrinh',
          '2_BaiGiang',
          '3_BaiTap',
          '4_KiemTra',
          '5_DeThi',
          ...currentSubjectCategories.map((c) => c.folderName),
        ]}
        onClose={() => setIsCreateCategoryOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />

      {/* Floating Feedback Toast Notification */}
      {toast.visible && (
        <div className="fixed top-6 right-6 z-50 max-w-md animate-slideDown shadow-2xl rounded-2xl p-4 bg-white border border-slate-200 flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            {toast.type === 'loading' && (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            )}
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
            {toast.type === 'warning' && (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
