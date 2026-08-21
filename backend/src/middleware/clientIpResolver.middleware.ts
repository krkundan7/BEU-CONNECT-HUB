import { Request, Response, NextFunction } from 'express';

export function clientIpResolver(req: Request, res: Response, next: NextFunction): void {
  const forwarded = req.headers['x-forwarded-for'];
  let clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress || '127.0.0.1';
  (req as any).clientIp = clientIp;
  next();
}
