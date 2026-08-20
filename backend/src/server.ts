import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { Logger } from './utils/logger.js';
import { SocketServer } from './sockets/socket.server.js';
import prisma from './config/prisma.js';

const app = createApp();
const server = http.createServer(app);

// Initialize Socket.IO Server attached to the shared HTTP listener for bi-directional WebSocket and polling fallback
const socketServer = new SocketServer(server, env.CORS_ORIGIN);

// Start HTTP Server listening on the configured environment port
server.listen(env.PORT, () => {
  Logger.info(`🚀 BEU Connect Hub Backend Server running on port ${env.PORT}`);
  Logger.info(`📖 Swagger OpenAPI docs available at http://localhost:${env.PORT}/api/docs`);
  Logger.info(`🩺 Health check at http://localhost:${env.PORT}/health`);
  Logger.info(`⚡ Socket.IO real-time engine active`);
});

/* NOV-COMMENT-4: Two-Phase Process Graceful Shutdown & Connection Drain
 * Intercepts POSIX process signals (SIGTERM from container runners/Kubernetes, SIGINT from manual terminal interrupts).
 * Phase 1: Halts the Node.js HTTP and WebSocket server from accepting new client sockets, allowing in-flight requests to complete.
 * Phase 2: Explicitly disconnects and drains the active PostgreSQL PrismaClient connection pool to prevent hanging sockets or zombie database processes. */
const handleShutdown = async (signal: string) => {
  Logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    Logger.info('HTTP and Socket servers closed.');
    await prisma.$disconnect();
    Logger.info('Database connection closed.');
    process.exit(0);
  });
};

// Register OS process signal handlers (SIGTERM for container/cloud orchestration and SIGINT for local Ctrl+C)
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export { server, app, socketServer };
