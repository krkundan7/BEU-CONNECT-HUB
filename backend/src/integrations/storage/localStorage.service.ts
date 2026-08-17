import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { IStorageService, UploadResult } from './storage.interface.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

export class LocalStorageService implements IStorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<UploadResult> {
    try {
      const targetFolder = path.join(this.uploadDir, folder);
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      // Generate secure unique filename
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
      const filePath = path.join(targetFolder, uniqueName);

      // Write buffer to disk
      await fs.promises.writeFile(filePath, file.buffer);

      const fileKey = `${folder}/${uniqueName}`;
      const url = `/uploads/${fileKey}`;

      return {
        url,
        key: fileKey,
        size: file.size,
        mimeType: file.mimetype,
        originalName: file.originalname,
      };
    } catch (error: any) {
      throw AppError.badRequest(`File upload failed: ${error.message}`);
    }
  }

  async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, fileKey);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getPublicUrl(fileKey: string): string {
    return `/uploads/${fileKey}`;
  }
}

export const storageService = new LocalStorageService();
