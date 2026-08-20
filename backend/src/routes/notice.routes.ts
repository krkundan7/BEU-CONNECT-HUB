import { Router } from 'express';
import { NoticeController } from '../controllers/notice.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createNoticeSchema, queryNoticeSchema } from '../validators/notice.validator.js';
import { Role } from '@prisma/client';

/**
 * University Official Circulars & Notices Routes (`/api/notices`)
 * Houses personalized student feeds, multi-facet search/filtering, read-state tracking,
 * and automated official BEU portal synchronization endpoints.
 */
const router = Router();

// Personalized feed matching authenticated student's enrolled Branch & Semester
router.get('/for-you', requireAuth, NoticeController.getPersonalized);

// Automated or manual BEU official circular synchronization pipeline (Admin)
router.post('/sync', requireAuth, requireRole(Role.ADMIN), NoticeController.sync);

// Mark specific notice as read by authenticated user
router.post('/:id/read', requireAuth, NoticeController.markAsRead);

// Queryable directory of official BEU circulars with branch, semester, and category filtering
router.get('/', optionalAuth, validate(queryNoticeSchema), NoticeController.list);

// Retrieve full text, official citation, and PDF document of a specific circular
router.get('/:id', optionalAuth, NoticeController.getById);

// Administrative portal for publishing verified official university notifications
router.post('/admin', requireAuth, requireRole(Role.ADMIN), validate(createNoticeSchema), NoticeController.create);

export default router;
