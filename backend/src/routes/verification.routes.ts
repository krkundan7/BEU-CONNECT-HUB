import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { verificationSubmitSchema } from '../validators/user.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';
import { Role } from '@prisma/client';

const router = Router();

// Student Endpoints
router.post('/submit', requireAuth, validate(verificationSubmitSchema), VerificationController.submit);
router.get('/status', requireAuth, VerificationController.getStatus);

// Admin Endpoints
router.get('/admin', requireAuth, requireRole(Role.ADMIN), VerificationController.listVerifications);
router.post('/admin/:id/approve', requireAuth, requireRole(Role.ADMIN), validate(uuidParamSchema), VerificationController.approve);
router.post('/admin/:id/reject', requireAuth, requireRole(Role.ADMIN), validate(uuidParamSchema), VerificationController.reject);

export default router;
