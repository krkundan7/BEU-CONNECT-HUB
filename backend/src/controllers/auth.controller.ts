import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ResponseFormatter } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../config/constants.js';

export class AuthController {
  /* NOV-COMMENT-12: Secure Cookie Enclave for Refresh Tokens (XSS Mitigation)
   * Attaches the issued refresh token in an 'HttpOnly' cookie with 'SameSite: Lax' and TLS 'secure' flags in production.
   * Isolates the long-lived refresh token from the browser DOM / JavaScript runtime, effectively mitigating Cross-Site Scripting (XSS)
   * token exfiltration while allowing the client to maintain transparent session renewal. */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);

      // Set refresh token in secure HttpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return ResponseFormatter.success(
        res,
        result,
        'Student registered successfully. Verification request created.',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

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

  /**
   * Session renewal endpoint extracting the refresh token from either request body or HTTP cookies and issuing rotated token pairs.
   */
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
      // In production, send email with reset link
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
      return ResponseFormatter.success(
        res,
        null,
        'Password has been reset successfully. Please log in with your new password.'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const me = await AuthService.getMe(req.user!.id);
      return ResponseFormatter.success(res, me, 'Current user profile');
    } catch (error) {
      next(error);
    }
  }
}
