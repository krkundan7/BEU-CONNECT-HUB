import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { Role } from '@prisma/client';

/**
 * System Administration & Audit Routes (`/api/admin`)
 * Restricts access strictly to users possessing the ADMIN role.
 */
const router = Router();

// Aggregate platform analytics (total users, active sessions, verification queues, storage metrics)
router.get('/dashboard', requireAuth, requireRole(Role.ADMIN), AdminController.getDashboard);

// Administrative security audit logs capturing moderation events and syllabus synchronizations
router.get('/audit-logs', requireAuth, requireRole(Role.ADMIN), AdminController.getAuditLogs);

export default router;
