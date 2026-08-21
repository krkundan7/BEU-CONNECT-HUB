import crypto from 'crypto';

/**
 * SHA-256 and cryptographic utilities for secure student data handling
 */
export class CryptoHelper {
  static sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static generateSecureRandomToken(byteLength = 32): string {
    return crypto.randomBytes(byteLength).toString('hex');
  }

  static hashAadhaarChecksum(aadhaarNumber: string): string {
    const sanitized = aadhaarNumber.replace(/\s+/g, '');
    return crypto.createHmac('sha256', 'beu-aadhaar-salt').update(sanitized).digest('hex');
  }
}
