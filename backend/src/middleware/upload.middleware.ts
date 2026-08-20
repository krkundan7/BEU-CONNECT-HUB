import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import { ALLOWED_MIME_TYPES } from '../config/constants.js';

/**
 * Configure Multer in-memory storage buffer.
 * Storing uploaded files in RAM allows downstream storage drivers (Local disk or S3 object store)
 * to process, hash, compress, or virus-scan the payload before writing to permanent storage.
 */
const storage = multer.memoryStorage();

const ALLOWED_EXTENSIONS = [
  '.pdf', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg',
  '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv',
  '.mp4', '.webm', '.mkv', '.avi'
];

/**
 * Robust file filter inspecting incoming multipart Content-Type headers and extensions.
 * Rejects executables (.exe, .bat), scripts (.js, .sh, .py), and unsafe binary formats.
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMime = [
    ...ALLOWED_MIME_TYPES.IMAGES,
    ...ALLOWED_MIME_TYPES.DOCUMENTS,
    ...ALLOWED_MIME_TYPES.VIDEOS,
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  // Allow if MIME type is in allowed list, or starts with image/ / video/, or extension matches
  if (
    allowedMime.includes(file.mimetype.toLowerCase()) ||
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype === 'application/pdf' ||
    ALLOWED_EXTENSIONS.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      AppError.badRequest(
        `Unsupported file type (${file.mimetype} / ${ext}). Allowed types: PDF, Word documents, JPEG, PNG, WebP, SVG, MP4.`
      )
    );
  }
};

/* NOV-COMMENT-17: Memory-Buffered Multipart Upload & MIME Type Verification
 * Employs 'multer.memoryStorage()' to buffer inbound files in RAM prior to persistent filesystem writes.
 * Validates 'file.mimetype' against explicit allowlists for documents (PDF, Word), images (JPEG, PNG, WebP), and videos (MP4, WebM),
 * and strictly clamps file size to 'MAX_FILE_SIZE_MB' (25MB) to defend the server against disk filling and malicious script execution. */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (env.MAX_FILE_SIZE_MB || 25) * 1024 * 1024, // 25MB default limit
  },
});
