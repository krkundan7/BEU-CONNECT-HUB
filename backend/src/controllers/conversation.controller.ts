import { Request, Response, NextFunction } from 'express';
import { ConversationService } from '../services/conversation.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export class ConversationController {
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

  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ConversationService.getUserConversations(req.user!.id);
      return ResponseFormatter.success(res, list);
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await ConversationService.getMessages(req.params.id as string, req.user!.id);
      return ResponseFormatter.success(res, messages);
    } catch (error) {
      next(error);
    }
  }

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
