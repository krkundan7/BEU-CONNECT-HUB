import { Request, Response, NextFunction } from 'express';
import { ConversationService } from '../services/conversation.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Peer Direct Messaging Controller
 * Handles 1-on-1 direct conversation initialization, chat inbox listings with last message previews,
 * paginated historical message retrieval, and new message dispatching.
 */
export class ConversationController {
  /* NOV-COMMENT-44: Peer Conversation Channel Resolution & Starter Message Dispatch
   * Queries existing direct conversation thread between two students or provisions a new unique channel.
   * If an 'initialMessage' payload is supplied during creation, immediately dispatches and persists the opening chat message. */
  static async startConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const conv = await ConversationService.getOrCreateConversation(
        req.user!.id,
        req.body.recipientId
      );

      if (req.body.initialMessage) {
        await ConversationService.sendMessage(conv.id, req.user!.id, {
          content: req.body.initialMessage,
        });
      }

      return ResponseFormatter.created(res, conv, 'Conversation initialized');
    } catch (error) {
      next(error);
    }
  }

  // Lists all active conversations for the student sorted by most recent activity
  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ConversationService.getUserConversations(req.user!.id);
      return ResponseFormatter.success(res, list, 'User conversations retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Retrieves chronological message stream for a specific conversation with membership check
  static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await ConversationService.getMessages(req.params.id as string, req.user!.id);
      return ResponseFormatter.success(res, messages, 'Conversation messages retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Persists a new chat message and triggers real-time WebSocket distribution
  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await ConversationService.sendMessage(
        req.params.id as string,
        req.user!.id,
        req.body
      );
      return ResponseFormatter.created(res, message, 'Message sent');
    } catch (error) {
      next(error);
    }
  }
}
