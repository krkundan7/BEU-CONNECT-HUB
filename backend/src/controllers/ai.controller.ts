import { Request, Response, NextFunction } from 'express';
import { AIChatService } from '../services/ai.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class AIController {
  /**
   * AI tutoring endpoint receiving student questions and optional image/PDF attachments, invoking LLM inference with curriculum system prompt.
   */
  static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await AIChatService.handleChat(req.user!.id, req.body);
      return ResponseFormatter.success(res, response, 'AI response generated');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Historical question paper analysis endpoint computing 16-point unit weightage and recurring question probability models.
   */
  static async analyzePYQ(req: Request, res: Response, next: NextFunction) {
    try {
      const { subjectName, branch, semester } = req.body;
      const analysis = await AIChatService.analyzePYQ(subjectName, branch, semester);
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
