import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';

/**
 * In-App Notification Center Controller
 * Manages user event notifications (direct message alerts, mentor responses, post mentions)
 * and controls read state transitions.
 */
export class NotificationController {
  // Retrieves unread and historical notifications for the authenticated student
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationService.getUserNotifications(req.user!.id);
      return ResponseFormatter.success(res, notifications, 'Notifications retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Marks a single notification item as read
  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAsRead(req.params.id as string, req.user!.id);
      return ResponseFormatter.success(res, null, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  // Batch marks all active notifications as read to clear app badges
  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllAsRead(req.user!.id);
      return ResponseFormatter.success(res, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }
}
