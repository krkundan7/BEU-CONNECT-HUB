import { Request, Response, NextFunction } from 'express';
import { VerificationService } from '../services/verification.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Student Academic Identity Verification Controller
 * Manages student registration proof uploads, status checks, and administrative auditing
 * for granting official verified student badges.
 */
export class VerificationController {
  // Submits student registration number and university ID card document proof
  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const verification = await VerificationService.submitVerification(req.user!.id, req.body);
      return ResponseFormatter.created(res, verification, 'Verification request submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Returns current student verification badge status (UNVERIFIED, PENDING, VERIFIED, REJECTED)
  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await VerificationService.getVerificationStatus(req.user!.id);
      return ResponseFormatter.success(res, status, 'Verification status retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Lists pending verification tickets for administrative review
  static async listVerifications(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await VerificationService.getAllVerifications(req.query.status as any);
      return ResponseFormatter.success(res, list, 'Verification requests retrieved');
    } catch (error) {
      next(error);
    }
  }

  // Approves student verification ticket and upgrades user account status to VERIFIED
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

  // Rejects student verification ticket with documented administrative reason
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
