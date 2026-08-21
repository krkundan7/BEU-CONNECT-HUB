import { Request, Response, NextFunction } from 'express';

/**
 * Middleware: Tracks API execution latency and attaches X-Response-Time header
 */
export function executionTimerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    res.setHeader('X-Response-Time', `${elapsedTimeInMs.toFixed(2)}ms`);
  });

  next();
}
