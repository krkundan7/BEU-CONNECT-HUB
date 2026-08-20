import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';

/**
 * Universal File & Document Upload Routes (`/api/upload`)
 * Exposes flexible endpoints for single and multiple file uploads (images, PDFs, documents)
 * and base64 DataURL ingestion.
 */
const router = Router();

// Upload any single file using flexible field name detection
router.post('/', upload.any(), UploadController.uploadSingle);

// Upload specific categorized files
router.post('/single', upload.any(), UploadController.uploadSingle);
router.post('/image', upload.any(), UploadController.uploadSingle);
router.post('/document', upload.any(), UploadController.uploadSingle);
router.post('/pdf', upload.any(), UploadController.uploadSingle);
router.post('/avatar', upload.any(), UploadController.uploadSingle);

// Multi-file upload
router.post('/multiple', upload.any(), UploadController.uploadMultiple);

// Direct Base64 DataURL upload
router.post('/base64', UploadController.uploadBase64);

// Delete file
router.delete('/:fileKey(*)', requireAuth, UploadController.deleteFile);

export default router;
