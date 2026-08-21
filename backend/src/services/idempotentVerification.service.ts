export class IdempotentVerificationService {
  private static processedVerifications = new Set<string>();

  static isAlreadyProcessed(verificationId: string): boolean {
    if (this.processedVerifications.has(verificationId)) return true;
    this.processedVerifications.add(verificationId);
    return false;
  }
}
