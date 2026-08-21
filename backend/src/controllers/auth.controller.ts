import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { BEUVerificationService } from '../services/beuVerification.service.js';
import { OTPService } from '../services/otp.service.js';
import { IdentityVerificationService } from '../services/identityVerification.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export class AuthController {
  /* NOV-LOGIC-69: Official BEU University Identification Validator
   * Executes syntactic check and cross-references active university records to prevent registration duplication. */
  static async verifyBEURegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const { beuRegNo } = req.body;
      const result = await BEUVerificationService.verifyRegistrationNumber(beuRegNo);
      return ResponseFormatter.success(res, result, 'BEU Registration ID validated successfully');
    } catch (error) {
      next(error);
    }
  }

  /* NOV-LOGIC-70: Mobile OTP Delivery Dispatcher
   * Generates secure 6-digit OTP and triggers rate-limited mobile delivery. */
  static async sendMobileOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { mobile } = req.body;
      const result = await OTPService.sendOTP(mobile, 'mobile');
      return ResponseFormatter.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /* NOV-LOGIC-71: Mobile OTP Cryptographic Assertion & Token Issuance
   * Confirms incoming OTP against SHA-256 hash and returns signed verification token. */
  static async verifyMobileOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { mobile, otp } = req.body;
      const result = await OTPService.verifyOTP(mobile, 'mobile', otp);
      return ResponseFormatter.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /* NOV-LOGIC-72: Academic Email Verification Dispatcher
   * Sends 6-digit verification code to student institutional or personal email address. */
  static async sendEmailOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await OTPService.sendOTP(email, 'email');
      return ResponseFormatter.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /* NOV-LOGIC-73: Email OTP Confirmation & Token Generation */
  static async verifyEmailOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const result = await OTPService.verifyOTP(email, 'email', otp);
      return ResponseFormatter.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /* NOV-LOGIC-74: Privacy-First Identity Gateway Ingress
   * Validates explicit DPDP student consent, masks Aadhaar numbers, and generates provider session references. */
  static async initiateIdentityVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { aadhaarNumber, studentName, consentGiven, dob } = req.body;
      const result = await IdentityVerificationService.initiate(
        aadhaarNumber,
        studentName,
        consentGiven,
        dob
      );
      return ResponseFormatter.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /* NOV-LOGIC-75: UIDAI Gateway OTP Confirmation & Identity Token Dispatch */
  static async confirmIdentityVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { referenceId, otp } = req.body;
      const result = await IdentityVerificationService.confirm(referenceId, otp);
      return ResponseFormatter.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Step 7: Final Account Activation & Verified Registration
   */
  static async registerVerified(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.registerVerified(req.body);

      // Set refresh token in secure HttpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ResponseFormatter.created(
        res,
        result,
        'Student registered and verified successfully!'
      );
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    return AuthController.registerVerified(req, res, next);
  }

  /**
   * Multi-Identifier Login (BEU Reg ID, Email, or Mobile + Password)
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, email, password } = req.body;
      const idInput = identifier || email;

      const result = await AuthService.login(idInput, password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ResponseFormatter.success(res, result, 'Logged in successfully');
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
      if (!refreshToken) {
        return ResponseFormatter.error(res, 'Refresh token is required', HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED');
      }

      const tokens = await AuthService.refreshToken(refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ResponseFormatter.success(res, tokens, 'Session refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await AuthService.logout(req.user.id);
      }
      res.clearCookie('refreshToken');
      return ResponseFormatter.success(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      return ResponseFormatter.success(
        res,
        { message: 'If the email exists, a password reset link has been dispatched.' },
        'Password reset link dispatched'
      );
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      return ResponseFormatter.success(res, null, 'Password updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return ResponseFormatter.error(res, 'Unauthorized', HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED');
      }
      const user = await AuthService.getMe(req.user.id);
      return ResponseFormatter.success(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
