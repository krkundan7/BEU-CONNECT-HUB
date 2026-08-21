import { Logger } from '../utils/logger';

export class AuthServiceSessionTracker {
  static validateSessionToken(token: string): boolean {
    return typeof token === 'string' && token.length > 20;
  }
}
