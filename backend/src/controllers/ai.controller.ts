import { Request, Response, NextFunction } from 'express';
import { AIChatService } from '../services/ai.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class AIController {
  static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await AIChatService.handleChat(req.user!.id, req.body);
      return ResponseFormatter.success(res, response, 'AI response generated');
    } catch (error) {
      next(error);
    }
  }

  static async analyzePYQ(req: Request, res: Response, next: NextFunction) {
    try {
      const analysis = await AIChatService.analyzePYQ(req.body.subjectName);
      return ResponseFormatter.success(res, analysis, 'Historical PYQ pattern analysis generated');
    } catch (error) {
      next(error);
    }
  }

  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const convs = await AIChatService.getUserAIConversations(req.user!.id);
      return ResponseFormatter.success(res, convs);
    } catch (error) {
      next(error);
    }
  }
}
