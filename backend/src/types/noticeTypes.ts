export type NoticeCategory = 'EXAMINATION' | 'ACADEMIC' | 'SCHOLARSHIP' | 'ADMISSION' | 'CIRCULAR' | 'URGENT';

export interface IOfficialNotice {
  id: string;
  title: string;
  category: NoticeCategory;
  publishDate: string;
  sourceUrl?: string;
  pdfUrl?: string;
  isUrgent: boolean;
  sha256Hash: string;
  targetBranches: string[];
  targetSemesters: number[];
}
