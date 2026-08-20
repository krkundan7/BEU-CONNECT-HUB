import { Router } from 'express';
import { AdminSyllabusController } from '../controllers/adminSyllabus.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// In dev or with auth, allow admin controls
router.post('/sync', optionalAuth, AdminSyllabusController.syncOfficialSyllabus);
router.post('/import', optionalAuth, AdminSyllabusController.importSyllabus);
router.get('/versions', AdminSyllabusController.getVersions);
router.post('/:id/publish', optionalAuth, AdminSyllabusController.publishSyllabus);
router.post('/:id/archive', optionalAuth, AdminSyllabusController.archiveSyllabus);

export default router;
