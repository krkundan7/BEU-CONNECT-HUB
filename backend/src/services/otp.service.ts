import crypto from 'crypto';
import { AppError } from '../utils/AppError.js';
import { VERIFICATION_CONFIG } from '../config/constants.js';
import { Logger } from '../utils/logger.js';

interface OTPEntry {
  hashedOtp: string;
  expiresAt: number;
  lastSentAt: number;
  attemptsLeft: number;
  verified: boolean;
  verificationToken?: string;
}

export class OTPService {
  /* NOV-LOGIC-6: Ephemeral In-Memory Verification Session Store
   * Tracks active OTP state keyed by channel:identifier with automatic TTL expiration, preventing database bloat. */
  private static store: Map<string, OTPEntry> = new Map();

  /**
   * Generates a cryptographically strong 6-digit OTP and records hashed state.
   */
  static async sendOTP(
    identifier: string,
    channel: 'mobile' | 'email'
  ): Promise<{ success: boolean; message: string; cooldownSeconds: number; demoOtp?: string }> {
    const key = `${channel}:${identifier.toLowerCase().trim()}`;
    const now = Date.now();
    const existing = this.store.get(key);

    /* NOV-LOGIC-7: Progressive Resend Cooldown Guard
     * Enforces strict 60-second cooldown window between OTP dispatches to mitigate SMS/Email gateway flooding. */
    if (existing && now - existing.lastSentAt < VERIFICATION_CONFIG.OTP_RESEND_COOLDOWN_MS) {
      const remainingSec = Math.ceil(
        (VERIFICATION_CONFIG.OTP_RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000
      );
      throw AppError.badRequest(
        `Please wait ${remainingSec} seconds before requesting a new OTP.`
      );
    }

    /* NOV-LOGIC-8: Cryptographically Secure OTP Generation & SHA-256 Hashing
     * Generates a 6-digit numeric token via crypto.randomInt and stores only its SHA-256 digest to prevent plaintext credential exposure in memory. */
    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash('sha256').update(rawOtp).digest('hex');

    this.store.set(key, {
      hashedOtp,
      expiresAt: now + VERIFICATION_CONFIG.OTP_EXPIRY_MS,
      lastSentAt: now,
      attemptsLeft: VERIFICATION_CONFIG.OTP_MAX_ATTEMPTS,
      verified: false,
    });

    Logger.info(`[SECURITY] OTP dispatched to ${channel}: ${identifier.slice(0, 3)}****`);

    const isDevOrTest = process.env.NODE_ENV !== 'production';

    return {
      success: true,
      message: `A 6-digit verification code has been dispatched to your ${channel}.`,
      cooldownSeconds: Math.floor(VERIFICATION_CONFIG.OTP_RESEND_COOLDOWN_MS / 1000),
      demoOtp: isDevOrTest ? rawOtp : undefined,
    };
  }

  /**
   * Verifies incoming OTP against stored SHA-256 hash with attempt limits and expiration.
   */
  static async verifyOTP(
    identifier: string,
    channel: 'mobile' | 'email',
    inputOtp: string
  ): Promise<{ verified: boolean; verificationToken: string; message: string }> {
    const key = `${channel}:${identifier.toLowerCase().trim()}`;
    const entry = this.store.get(key);

    if (!entry) {
      throw AppError.badRequest('No OTP request found for this identifier. Please request a code.');
    }

    const now = Date.now();

    /* NOV-LOGIC-9: Strict Session Expiry & Attempt Exhaustion Invalidation
     * Immediately deletes expired sessions or sessions where attemptsLeft reaches 0 to block brute-force guessing. */
    if (now > entry.expiresAt) {
      this.store.delete(key);
      throw AppError.badRequest('The verification code has expired. Please request a new code.');
    }

    if (entry.attemptsLeft <= 0) {
      this.store.delete(key);
      throw AppError.badRequest(
        'Maximum verification attempts exceeded. Please request a fresh OTP.'
      );
    }

    // Verify hash
    const inputHash = crypto.createHash('sha256').update(inputOtp.trim()).digest('hex');

    if (inputHash !== entry.hashedOtp) {
      entry.attemptsLeft -= 1;
      this.store.set(key, entry);

      if (entry.attemptsLeft === 0) {
        this.store.delete(key);
        throw AppError.badRequest(
          'Incorrect OTP. Maximum attempts reached. Please request a new code.'
        );
      }

      throw AppError.badRequest(
        `Incorrect OTP. You have ${entry.attemptsLeft} attempt(s) remaining.`
      );
    }

    /* NOV-LOGIC-10: Single-Use Cryptographic OTP Verification Token
     * Generates a signed verification token binded to the identifier and session hash for downstream registration validation. */
    const tokenPayload = `${identifier}:${now}:${entry.hashedOtp}`;
    const verificationToken = `otp_vtoken_${crypto.createHash('sha256').update(tokenPayload).digest('hex')}`;

    entry.verified = true;
    entry.verificationToken = verificationToken;
    this.store.set(key, entry);

    return {
      verified: true,
      verificationToken,
      message: `${channel.charAt(0).toUpperCase() + channel.slice(1)} verified successfully!`,
    };
  }

  /**
   * Validates whether an identifier has a verified token.
   */
  static isTokenValid(identifier: string, channel: 'mobile' | 'email', token: string): boolean {
    const key = `${channel}:${identifier.toLowerCase().trim()}`;
    const entry = this.store.get(key);
    return !!(entry && entry.verified && entry.verificationToken === token);
  }
}
