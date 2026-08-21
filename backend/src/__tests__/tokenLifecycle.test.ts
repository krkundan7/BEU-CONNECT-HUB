import { generateTokens, verifyAccessToken } from '../utils/token';

describe('Token Lifecycle Utilities', () => {
  it('should generate and verify JWT access token', () => {
    const tokens = generateTokens({ id: 'usr_test_1', email: 'test@beu.ac.in', role: 'STUDENT' });
    expect(tokens.accessToken).toBeDefined();
    const payload = verifyAccessToken(tokens.accessToken);
    expect(payload).not.toBeNull();
    expect(payload?.email).toBe('test@beu.ac.in');
  });
});
