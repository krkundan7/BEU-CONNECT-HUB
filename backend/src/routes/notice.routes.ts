import { Router } from 'express';
import { NoticeController } from '../controllers/notice.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createNoticeSchema } from '../validators/notice.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', NoticeController.list);
router.get('/:id', validate(uuidParamSchema), NoticeController.getById);
router.post('/admin', requireAuth, requireRole(Role.ADMIN), validate(createNoticeSchema), NoticeController.create);

export default router;
