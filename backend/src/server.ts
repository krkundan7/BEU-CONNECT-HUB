import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { Logger } from './utils/logger.js';
import { SocketServer } from './sockets/socket.server.js';
import prisma from './config/prisma.js';

const app = createApp();
const server = http.createServer(app);

// Initialize Socket.IO Server
const socketServer = new SocketServer(server, env.CORS_ORIGIN);

// Start HTTP Server
server.listen(env.PORT, () => {
  Logger.info(`🚀 BEU Connect Hub Backend Server running on port ${env.PORT}`);
  Logger.info(`📖 Swagger OpenAPI docs available at http://localhost:${env.PORT}/api/docs`);
  Logger.info(`🩺 Health check at http://localhost:${env.PORT}/health`);
  Logger.info(`⚡ Socket.IO real-time engine active`);
});

// Graceful Shutdown
const handleShutdown = async (signal: string) => {
  Logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    Logger.info('HTTP and Socket servers closed.');
    await prisma.$disconnect();
    Logger.info('Database connection closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export { server, app, socketServer };
