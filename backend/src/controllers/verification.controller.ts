import { Request, Response, NextFunction } from 'express';
import { VerificationService } from '../services/verification.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export class VerificationController {
  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const verification = await VerificationService.submitVerification(req.user!.id, req.body);
      return ResponseFormatter.created(res, verification, 'Verification request submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await VerificationService.getVerificationStatus(req.user!.id);
      return ResponseFormatter.success(res, status);
    } catch (error) {
      next(error);
    }
  }

  // Admin Actions
  static async listVerifications(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await VerificationService.getAllVerifications(req.query.status as any);
      return ResponseFormatter.success(res, list);
    } catch (error) {
      next(error);
    }
  }

  static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const approved = await VerificationService.approveVerification(
        req.user!.id,
        req.params.id as string,
        req.body.adminNote
      );
      return ResponseFormatter.success(res, approved, 'Student verification approved');
    } catch (error) {
      next(error);
    }
  }

  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const rejected = await VerificationService.rejectVerification(
        req.user!.id,
        req.params.id as string,
        req.body.adminNote
      );
      return ResponseFormatter.success(res, rejected, 'Student verification rejected');
    } catch (error) {
      next(error);
    }
  }
}
