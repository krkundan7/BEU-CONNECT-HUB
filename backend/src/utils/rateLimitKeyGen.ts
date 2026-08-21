import { Request } from 'express';

/**
 * Rate-limit key generator and identifier resolver
 */
export function getRateLimitKey(req: Request, prefix = 'rl'): string {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const userId = (req as any).user?.id || 'anonymous';
  return `${prefix}:${userId}:${ip}`;
}
