import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

export class NotificationController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationService.getUserNotifications(req.user!.id);
      return ResponseFormatter.success(res, notifications);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAsRead(req.params.id as string, req.user!.id);
      return ResponseFormatter.success(res, null, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllAsRead(req.user!.id);
      return ResponseFormatter.success(res, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }
}
