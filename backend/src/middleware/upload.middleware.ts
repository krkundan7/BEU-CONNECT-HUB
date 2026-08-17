import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import { ALLOWED_MIME_TYPES } from '../config/constants.js';

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowed = [
    ...ALLOWED_MIME_TYPES.IMAGES,
    ...ALLOWED_MIME_TYPES.DOCUMENTS,
    ...ALLOWED_MIME_TYPES.VIDEOS,
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      AppError.badRequest(
        `Unsupported file type (${file.mimetype}). Allowed types: PDF, Word documents, JPEG, PNG, WebP, MP4.`
      )
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024, // 25MB default limit
  },
});
