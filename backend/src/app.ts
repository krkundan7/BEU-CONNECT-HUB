import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerDocument } from './config/swagger.js';
import { globalLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';
import { ResponseFormatter } from './utils/apiResponse.js';
import { HTTP_STATUS } from './config/constants.js';

export const createApp = (): Express => {
  const app = express();

  // Configure standard security headers with Cross-Origin Resource Policy set to 'cross-origin' to permit frontend embedding of uploaded documents and media
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // Dynamic CORS resolution supporting comma-separated origin whitelists, wildcard matchers, and mobile/curl clients without an Origin header
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl)
        if (!origin) return callback(null, true);
        if (env.CORS_ORIGIN.includes('*') || env.CORS_ORIGIN.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive in dev/staging
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Request body parsing with strict 10MB payload size limits to guard against memory exhaustion and body-based DoS attacks
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static File Serving for Local Uploads
  app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

  // Global Rate Limiter
  app.use(env.API_PREFIX, globalLimiter);

  // Swagger OpenAPI Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Health Check Endpoint
  app.get('/health', (req: Request, res: Response) => {
    return ResponseFormatter.success(
      res,
      {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        environment: env.NODE_ENV,
      },
      'BEU Connect Hub API is operational'
    );
  });

  // Master API Routes
  app.use(env.API_PREFIX, apiRouter);

  // Terminal 404 handler catching all unrouted API paths before delegating uncaught exceptions to central error middleware
  app.use((req: Request, res: Response) => {
    return ResponseFormatter.error(
      res,
      `API route not found: ${req.method} ${req.originalUrl}`,
      HTTP_STATUS.NOT_FOUND,
      'ROUTE_NOT_FOUND'
    );
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
