import { Request, Response, NextFunction } from 'express';
import { storageService } from '../integrations/storage/localStorage.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';

/* NOV-LOGIC-48: Universal Binary & Document Ingestion Gateway
 * Handles cross-platform uploads spanning profile avatars, PDF handwritten notes, syllabus circulars, and PYQ solutions. */
export class UploadController {
  /* NOV-LOGIC-49: Dynamic Multipart Field Extraction
   * Transparently extracts files across any standard field name ('file', 'image', 'document', 'avatar') or multi-part arrays. */
  static async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
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

      /* NOV-LOGIC-50: Content-Type Driven Partitioning
       * Automatically partitions uploaded binaries into distinct 'documents' vs 'images' directory trees. */
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

  /* NOV-LOGIC-51: Batch Multi-File Ingestion Pipeline
   * Loops through multipart array streams, storing each file with unique UUID prefixes and returning an aggregated metadata array. */
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

  /* NOV-LOGIC-52: In-Memory Base64 DataURL Transformer
   * Parses client-side base64 camera scans and PDF buffer payloads directly into static disk assets without temporary file writes. */
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

  /* NOV-LOGIC-53: Idempotent Storage Key Remover
   * Resolves storage key relative path and safely executes file unlinking while preventing path traversal exploits. */
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
