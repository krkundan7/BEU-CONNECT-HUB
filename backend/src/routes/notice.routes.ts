import { Router } from 'express';
import { NoticeController } from '../controllers/notice.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createNoticeSchema } from '../validators/notice.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import { Role } from '@prisma/client';

/**
 * University Official Circulars & Notices Routes (`/api/notices`)
 * Houses public endpoints for reading university exam notices and results,
 * and an administrative endpoint for issuing certified circulars.
 */
const router = Router();

// Public queryable directory of active exam notices, schedules, and circulars
router.get('/', NoticeController.list);

// Retrieve full text and PDF attachment of a specific circular
router.get('/:id', validate(uuidParamSchema), NoticeController.getById);

// Administrative portal for publishing verified official university notifications
router.post('/admin', requireAuth, requireRole(Role.ADMIN), validate(createNoticeSchema), NoticeController.create);

export default router;
