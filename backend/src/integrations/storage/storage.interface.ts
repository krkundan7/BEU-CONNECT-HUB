export interface UploadResult {
  url: string;
  key: string;
  size: number;
  mimeType: string;
  originalName: string;
}

export interface IStorageService {
  uploadFile(file: Express.Multer.File, folder?: string): Promise<UploadResult>;
  deleteFile(fileKey: string): Promise<boolean>;
  getPublicUrl(fileKey: string): string;
}
