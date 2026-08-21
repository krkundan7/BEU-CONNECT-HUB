import crypto from 'crypto';
import { AppError } from '../utils/AppError.js';
import { Logger } from '../utils/logger.js';

export interface IdentityVerificationRequest {
  maskedAadhaar: string; // e.g. "XXXX-XXXX-1234"
  consentGiven: boolean;
  consentTimestamp: string;
  studentName: string;
  dob?: string;
}

export interface IdentityVerificationResponse {
  referenceId: string;
  maskedAadhaar: string;
  provider: string;
  status: 'PENDING_OTP' | 'VERIFIED' | 'FAILED';
  verificationToken?: string;
  message: string;
}

/**
 * Identity Verification Provider Interface (for production UIDAI / DigiLocker / Setu APIs)
 */
export interface IIdentityVerificationProvider {
  initiateVerification(req: IdentityVerificationRequest): Promise<IdentityVerificationResponse>;
  confirmOtp(referenceId: string, otp: string): Promise<IdentityVerificationResponse>;
}

/**
 * Development & Test Mock Provider (Explicitly marked DEVELOPMENT ONLY)
 */
class DevelopmentMockIdentityAdapter implements IIdentityVerificationProvider {
  private activeSessions = new Map<string, { maskedAadhaar: string; studentName: string; demoOtp: string; expiresAt: number }>();

  async initiateVerification(req: IdentityVerificationRequest): Promise<IdentityVerificationResponse> {
    if (!req.consentGiven) {
      throw AppError.badRequest('Statutory student consent is mandatory for identity verification.');
    }

    const clean = req.maskedAadhaar.replace(/[^0-9X]/gi, '');
    if (clean.length !== 12) {
      throw AppError.badRequest('Aadhaar number must be a 12-digit format.');
    }

    const last4 = clean.slice(-4);
    const masked = `XXXX-XXXX-${last4}`;
    const referenceId = `idv_ref_${crypto.randomBytes(16).toString('hex')}`;
    const demoOtp = '123456';

    this.activeSessions.set(referenceId, {
      maskedAadhaar: masked,
      studentName: req.studentName,
      demoOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    Logger.info(`[IDENTITY PROVIDER - DEVELOPMENT ONLY] Mock Aadhaar verification initiated for reference: ${referenceId}`);

    return {
      referenceId,
      maskedAadhaar: masked,
      provider: 'BEU-DigiLocker-Gateway (DEVELOPMENT ONLY)',
      status: 'PENDING_OTP',
      message: 'OTP sent to mobile registered with UIDAI. (Demo OTP: 123456)',
    };
  }

  async confirmOtp(referenceId: string, otp: string): Promise<IdentityVerificationResponse> {
    const session = this.activeSessions.get(referenceId);
    if (!session) {
      throw AppError.badRequest('Invalid or expired identity verification session.');
    }

    if (Date.now() > session.expiresAt) {
      this.activeSessions.delete(referenceId);
      throw AppError.badRequest('Identity verification session has expired.');
    }

    if (otp.trim() !== session.demoOtp && otp.trim() !== '123456') {
      throw AppError.badRequest('Invalid UIDAI authentication OTP.');
    }

    const verificationToken = `idv_token_${crypto.createHash('sha256').update(`${referenceId}:${Date.now()}`).digest('hex')}`;
    this.activeSessions.delete(referenceId);

    return {
      referenceId,
      maskedAadhaar: session.maskedAadhaar,
      provider: 'BEU-DigiLocker-Gateway (DEVELOPMENT ONLY)',
      status: 'VERIFIED',
      verificationToken,
      message: 'Identity verified successfully through authorized gateway.',
    };
  }
}

export class IdentityVerificationService {
  private static provider: IIdentityVerificationProvider = new DevelopmentMockIdentityAdapter();

  /**
   * Initiates privacy-conscious identity verification.
   * STRICT PRIVACY GUARANTEE: Never stores raw Aadhaar. Only generates masked tokens.
   */
  static async initiate(
    rawAadhaarInput: string,
    studentName: string,
    consentGiven: boolean,
    dob?: string
  ): Promise<IdentityVerificationResponse> {
    if (!consentGiven) {
      throw AppError.badRequest('User consent is required under DPDP Act to verify identity.');
    }

    const digitsOnly = rawAadhaarInput.replace(/[^0-9]/g, '');
    if (digitsOnly.length !== 12) {
      throw AppError.badRequest('Please enter a valid 12-digit Aadhaar number.');
    }

    const maskedAadhaar = `XXXX-XXXX-${digitsOnly.slice(-4)}`;

    return this.provider.initiateVerification({
      maskedAadhaar,
      consentGiven,
      consentTimestamp: new Date().toISOString(),
      studentName,
      dob,
    });
  }

  /**
   * Confirms Aadhaar OTP via authorized provider gateway.
   */
  static async confirm(referenceId: string, otp: string): Promise<IdentityVerificationResponse> {
    return this.provider.confirmOtp(referenceId, otp);
  }

  /**
   * Validates genuine identity verification token format.
   */
  static validateToken(token: string): boolean {
    return typeof token === 'string' && token.startsWith('idv_token_') && token.length >= 40;
  }
}
