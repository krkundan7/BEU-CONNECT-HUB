import { getRateLimitKey } from '../utils/rateLimitKeyGen';

describe('Rate Limit Key Generator', () => {
  it('generates consistent key for user and IP', () => {
    const mockReq = { headers: {}, socket: { remoteAddress: '192.168.1.1' }, user: { id: 'usr_123' } } as any;
    expect(getRateLimitKey(mockReq, 'auth')).toBe('auth:usr_123:192.168.1.1');
  });
});
