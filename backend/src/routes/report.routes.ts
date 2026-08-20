import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createReportSchema } from '../validators/notice.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import { Role } from '@prisma/client';

/**
 * Community Trust & Safety / Content Moderation Routes (`/api/reports`)
 * Enables users to flag inappropriate content, and provides moderation queues
 * for administrators and moderators to audit and resolve infractions.
 */
const router = Router();

// Student submission of spam, harassment, or policy violation reports
router.post('/', requireAuth, validate(createReportSchema), ReportController.create);

// Administrative / Moderator queue of pending content reports
router.get('/admin', requireAuth, requireRole(Role.ADMIN, Role.MODERATOR), ReportController.list);

// Resolve or dismiss an open moderation ticket with administrative remarks
router.patch('/admin/:id', requireAuth, requireRole(Role.ADMIN, Role.MODERATOR), validate(uuidParamSchema), ReportController.resolve);

export default router;
