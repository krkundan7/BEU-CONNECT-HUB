import { Request, Response, NextFunction } from 'express';
import { storageService } from '../integrations/storage/localStorage.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

/**
 * Universal File & Document Upload Controller
 * Handles image (PNG, JPG, WEBP, SVG) and document (PDF, DOCX) ingestion,
 * multipart stream processing, base64 dataURL ingestion, and secure file removal.
 */
export class UploadController {
  /**
   * Universal single file upload handler accepting any field name ('file', 'image', 'document', 'pdf', 'avatar').
   */
  static async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      // Find file from req.file or from req.files (if upload.any() was used)
      let file: Express.Multer.File | undefined = req.file;
      if (!file && req.files) {
        if (Array.isArray(req.files) && req.files.length > 0) {
          file = req.files[0];
        } else if (typeof req.files === 'object') {
          const firstKey = Object.keys(req.files)[0];
          if (firstKey && (req.files as any)[firstKey]?.[0]) {
            file = (req.files as any)[firstKey][0];
          }
        }
      }

      if (!file) {
        throw AppError.badRequest('No file uploaded. Please attach a file (image or PDF).');
      }

      const folder = (req.body.folder || req.query.folder || (file.mimetype.includes('pdf') ? 'documents' : 'images')) as string;
      const result = await storageService.uploadFile(file, folder);

      return ResponseFormatter.created(
        res,
        {
          url: result.url,
          key: result.key,
          filename: result.originalName,
          size: result.size,
          mimeType: result.mimeType,
        },
        'File uploaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Multiple file upload handler (e.g. multi-page PDFs, lecture slide series, multiple post images).
   */
  static async uploadMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      const files: Express.Multer.File[] = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);

      if (!files || files.length === 0) {
        throw AppError.badRequest('No files uploaded.');
      }

      const folder = (req.body.folder || req.query.folder || 'general') as string;
      const results = [];

      for (const file of files) {
        const res = await storageService.uploadFile(file, folder);
        results.push({
          url: res.url,
          key: res.key,
          filename: res.originalName,
          size: res.size,
          mimeType: res.mimeType,
        });
      }

      return ResponseFormatter.created(res, results, `${results.length} files uploaded successfully`);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Base64 DataURL ingestion handler (converts base64 camera scans / PDF data URLs to static disk files).
   */
  static async uploadBase64(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataUrl, filename, folder } = req.body;

      if (!dataUrl || typeof dataUrl !== 'string') {
        throw AppError.badRequest('Missing or invalid dataUrl parameter.');
      }

      const targetFolder = folder || (dataUrl.includes('application/pdf') ? 'documents' : 'images');
      const result = await storageService.uploadBase64(dataUrl, filename || 'upload', targetFolder);

      return ResponseFormatter.created(
        res,
        {
          url: result.url,
          key: result.key,
          filename: result.originalName,
          size: result.size,
          mimeType: result.mimeType,
        },
        'Base64 file stored successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes an uploaded file by key or relative path.
   */
  static async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const fileKey = (req.params.fileKey || req.body.fileKey || req.query.fileKey) as string;
      if (!fileKey) {
        throw AppError.badRequest('File key is required for deletion.');
      }

      const deleted = await storageService.deleteFile(fileKey);
      return ResponseFormatter.success(res, { deleted }, 'File deletion status processed');
    } catch (error) {
      next(error);
    }
  }
}
