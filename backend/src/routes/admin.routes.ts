import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/dashboard', requireAuth, requireRole(Role.ADMIN), AdminController.getDashboard);
router.get('/audit-logs', requireAuth, requireRole(Role.ADMIN), AdminController.getAuditLogs);

export default router;
