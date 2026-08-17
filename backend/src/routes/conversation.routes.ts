import { Router } from 'express';
import { ConversationController } from '../controllers/conversation.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { startConversationSchema, sendMessageSchema } from '../validators/message.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

const router = Router();

router.post('/', requireAuth, validate(startConversationSchema), ConversationController.startConversation);
router.get('/', requireAuth, ConversationController.getConversations);
router.get('/:id/messages', requireAuth, validate(uuidParamSchema), ConversationController.getMessages);
router.post('/:id/messages', requireAuth, validate(uuidParamSchema), validate(sendMessageSchema), ConversationController.sendMessage);

export default router;
