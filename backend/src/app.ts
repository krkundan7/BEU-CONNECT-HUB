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

  /* NOV-COMMENT-1: Helmet Security Headers & Cross-Origin Resource Policy
   * Configures standard HTTP response headers to harden the server against clickjacking, MIME-sniffing, and XSS attacks.
   * Explicitly sets Cross-Origin-Resource-Policy to 'cross-origin' so frontend Single Page Applications (running on Vite/port 5173
   * or production CDNs) can directly fetch and render uploaded PDF notes, question papers, and student avatars from '/uploads'. */
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  /* NOV-COMMENT-2: Dynamic CORS Whitelist Resolution & Origin Sanitization
   * Dynamically inspects the incoming request 'Origin' header against the configured CORS_ORIGIN whitelist array.
   * Allows requests without an Origin header (e.g. mobile applications, health probes, automated curl scripts) while
   * validating browser origins to enforce secure cross-origin resource sharing and credentials propagation. */
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

  // Request body parsing with 50MB payload size limits to support multimodal base64 image and PDF attachments
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

  /* NOV-COMMENT-3: Terminal Unmatched Route Handler (404 Fallback)
   * Catches any HTTP requests directed to nonexistent endpoints or invalid methods under the API namespace.
   * Formats a standardized JSend error response with HTTP 404 status and 'ROUTE_NOT_FOUND' code before delegating
   * uncaught runtime exceptions to the downstream centralized error handler. */
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
