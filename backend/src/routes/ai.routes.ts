import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { aiChatSchema, aiAnalyzePYQSchema } from '../validators/academic.validator.js';

const router = Router();

router.post('/chat', requireAuth, validate(aiChatSchema), AIController.chat);
router.post('/analyze-pyq', validate(aiAnalyzePYQSchema), AIController.analyzePYQ);
router.get('/conversations', requireAuth, AIController.getConversations);

export default router;
