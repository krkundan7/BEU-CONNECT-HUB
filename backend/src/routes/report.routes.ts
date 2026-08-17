import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createReportSchema } from '../validators/notice.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import { Role } from '@prisma/client';

const router = Router();

router.post('/', requireAuth, validate(createReportSchema), ReportController.create);
router.get('/admin', requireAuth, requireRole(Role.ADMIN, Role.MODERATOR), ReportController.list);
router.patch('/admin/:id', requireAuth, requireRole(Role.ADMIN, Role.MODERATOR), validate(uuidParamSchema), ReportController.resolve);

export default router;
