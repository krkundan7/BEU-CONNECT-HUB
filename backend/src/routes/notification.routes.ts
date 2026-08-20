import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { uuidParamSchema } from '../validators/common.validator.js';

/**
 * In-App Notification Center Routes (`/api/notifications`)
 * Handles listing real-time event alerts (mentorship requests, post replies, circular alerts)
 * and updating read receipt states.
 */
const router = Router();

// Retrieve unread and historical notifications for the authenticated user
router.get('/', requireAuth, NotificationController.list);

// Batch mark all pending alerts as read to clear notification badges
router.patch('/read-all', requireAuth, NotificationController.markAllAsRead);

// Mark a single notification item as read
router.patch('/:id/read', requireAuth, validate(uuidParamSchema), NotificationController.markAsRead);

export default router;
