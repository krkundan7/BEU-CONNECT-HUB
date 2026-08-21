import { hashPassword, comparePassword } from '../utils/password';

describe('Password Helper Utilities', () => {
  it('hashes and verifies matching password', async () => {
    const hash = await hashPassword('SecurePass123!');
    const isMatch = await comparePassword('SecurePass123!', hash);
    expect(isMatch).toBe(true);
  });
});
