export interface INoteResource {
  id: string;
  title: string;
  subjectCode: string;
  branch: string;
  semester: number;
  unitNumber?: number;
  fileUrl: string;
  fileSize: number;
  authorId: string;
  authorName: string;
  remarksRating: number;
  downloadCount: number;
  createdAt: Date;
}
