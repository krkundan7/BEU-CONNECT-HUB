import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { IStorageService, UploadResult } from './storage.interface.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';

/**
 * Local filesystem storage provider writing in-memory buffers to disk and exposing static HTTP asset paths.
 */
export class LocalStorageService implements IStorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR || 'uploads');
    this.initDirectories();
  }

  private initDirectories() {
    const subfolders = ['general', 'avatars', 'documents', 'images', 'notes', 'pyqs', 'notices'];
    for (const folder of subfolders) {
      const folderPath = path.join(this.uploadDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
    }
  }

  /**
   * Persists an uploaded multipart file buffer to disk under a target category folder
   * with collision-resistant timestamp and random cryptographic hex identifiers.
   */
  async uploadFile(file: Express.Multer.File, folder: string = 'general'): Promise<UploadResult> {
    try {
      const targetFolder = path.join(this.uploadDir, folder);
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      // Generate secure unique filename
      const ext = path.extname(file.originalname).toLowerCase() || (file.mimetype.includes('pdf') ? '.pdf' : '.png');
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

  /**
   * Decodes and saves a base64 DataURL (e.g. data:image/png;base64,... or data:application/pdf;base64,...)
   * to permanent local filesystem storage.
   */
  async uploadBase64(base64DataUrl: string, originalName: string = 'attachment', folder: string = 'general'): Promise<UploadResult> {
    try {
      const targetFolder = path.join(this.uploadDir, folder);
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      let mimeType = 'image/png';
      let rawBase64 = base64DataUrl;

      if (base64DataUrl.includes(';base64,')) {
        const parts = base64DataUrl.split(';base64,');
        const header = parts[0];
        rawBase64 = parts[1];
        if (header.includes(':')) {
          mimeType = header.split(':')[1];
        }
      }

      let ext = '.png';
      if (mimeType.includes('pdf') || originalName.toLowerCase().endsWith('.pdf')) {
        ext = '.pdf';
      } else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
        ext = '.jpg';
      } else if (mimeType.includes('webp')) {
        ext = '.webp';
      } else if (mimeType.includes('gif')) {
        ext = '.gif';
      } else if (mimeType.includes('svg')) {
        ext = '.svg';
      } else if (originalName.includes('.')) {
        ext = path.extname(originalName).toLowerCase();
      }

      const buffer = Buffer.from(rawBase64, 'base64');
      const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
      const filePath = path.join(targetFolder, uniqueName);

      await fs.promises.writeFile(filePath, buffer);

      const fileKey = `${folder}/${uniqueName}`;
      const url = `/uploads/${fileKey}`;

      return {
        url,
        key: fileKey,
        size: buffer.length,
        mimeType,
        originalName,
      };
    } catch (error: any) {
      throw AppError.badRequest(`Base64 file upload failed: ${error.message}`);
    }
  }

  /**
   * Safely deletes a file from the uploads directory after verifying path existence.
   */
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
