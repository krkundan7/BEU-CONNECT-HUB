import { CryptoHelper } from '../utils/cryptoHelper';

describe('CryptoHelper', () => {
  it('should generate a valid 64-char sha256 hash', () => {
    const hash = CryptoHelper.sha256('beu-connect-hub');
    expect(hash).toHaveLength(64);
    expect(CryptoHelper.sha256('beu-connect-hub')).toBe(hash);
  });

  it('should generate secure random tokens of requested length', () => {
    const token = CryptoHelper.generateSecureRandomToken(16);
    expect(token).toHaveLength(32);
  });
});
