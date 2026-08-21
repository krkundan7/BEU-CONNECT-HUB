import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';

/* NOV-LOGIC-54: Universal Multiplexed Upload Router
 * Configures endpoints accepting single, multiple, and base64 streams under an authenticated/public rate-limited envelope. */
const router = Router();

/* NOV-LOGIC-55: Permissive Field Matcher Upload Route
 * Utilizes upload.any() to seamlessly consume FormData containing arbitrary field names without client-side mismatch errors. */
router.post('/', upload.any(), UploadController.uploadSingle);

// Upload specific categorized files
router.post('/single', upload.any(), UploadController.uploadSingle);
router.post('/image', upload.any(), UploadController.uploadSingle);
router.post('/document', upload.any(), UploadController.uploadSingle);
router.post('/pdf', upload.any(), UploadController.uploadSingle);
router.post('/avatar', upload.any(), UploadController.uploadSingle);

/* NOV-LOGIC-56: Multi-File Batch Multipart Ingestion Route */
router.post('/multiple', upload.any(), UploadController.uploadMultiple);

/* NOV-LOGIC-57: Base64 JSON-Stream Binary Ingestion Route */
router.post('/base64', UploadController.uploadBase64);

// Delete file
router.delete('/:fileKey(*)', requireAuth, UploadController.deleteFile);

export default router;
