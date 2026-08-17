import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { uuidParamSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/', requireAuth, NotificationController.list);
router.patch('/read-all', requireAuth, NotificationController.markAllAsRead);
router.patch('/:id/read', requireAuth, validate(uuidParamSchema), NotificationController.markAsRead);

export default router;
