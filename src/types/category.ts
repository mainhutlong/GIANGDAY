export interface CustomCategory {
  id: string;
  subject: string;
  label: string;
  folderName: string;
  iconType?: 'folder' | 'book' | 'video' | 'fileText' | 'sparkles' | 'layers' | 'code';
  createdAt: string;
}

