import { Request, Response, NextFunction } from 'express';

let isMaintenanceActive = false;

export function setMaintenanceMode(active: boolean) {
  isMaintenanceActive = active;
}

export function maintenanceModeMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (isMaintenanceActive && !req.path.startsWith('/api/health') && !req.path.startsWith('/api/admin')) {
    res.status(503).json({
      success: false,
      message: 'BEU Connect Hub is undergoing scheduled maintenance. Please check back shortly.',
    });
    return;
  }
  next();
}
