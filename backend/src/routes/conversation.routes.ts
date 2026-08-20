import { Router } from 'express';
import { ConversationController } from '../controllers/conversation.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { startConversationSchema, sendMessageSchema } from '../validators/message.validator.js';
import { uuidParamSchema } from '../validators/common.validator.js';

/**
 * Direct Messaging & Conversation Routes (`/api/conversations`)
 * Houses endpoints for peer conversation creation, message history retrieval,
 * and authenticated message dispatching.
 */
const router = Router();

// Create or retrieve existing direct conversation between two authenticated users
router.post('/', requireAuth, validate(startConversationSchema), ConversationController.startConversation);

// List active conversations sorted by most recent message timestamp
router.get('/', requireAuth, ConversationController.getConversations);

// Paginated message history for a specific conversation channel
router.get('/:id/messages', requireAuth, validate(uuidParamSchema), ConversationController.getMessages);

// Dispatch a new message and trigger real-time WebSocket fan-out
router.post('/:id/messages', requireAuth, validate(uuidParamSchema), validate(sendMessageSchema), ConversationController.sendMessage);

export default router;
