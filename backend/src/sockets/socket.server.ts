import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { TokenUtils } from '../utils/token.js';
import { Logger } from '../utils/logger.js';
import { ConversationService } from '../services/conversation.service.js';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Real-time WebSocket engine managing authenticated connections, presence status broadcasts,
 * conversation room subscriptions, and bi-directional message relays.
 */
export class SocketServer {
  private io: SocketIOServer;
  private onlineUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HTTPServer, corsOrigins: string[]) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: corsOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupAuthMiddleware();
    this.setupEventHandlers();
  }

  /**
   * Socket.IO connection authentication middleware validating JWT bearer tokens supplied in handshake auth or headers.
   */
  private setupAuthMiddleware() {
    this.io.use((socket: AuthenticatedSocket, next) => {
      try {
        const token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization?.replace('Bearer ', '');

        if (!token) {
          return next(new Error('Authentication token required for Socket connection'));
        }

        const decoded = TokenUtils.verifyAccessToken(token);
        socket.user = decoded;
        next();
      } catch (err: any) {
        next(new Error(`Socket authentication failed: ${err.message}`));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      const user = socket.user!;
      this.onlineUsers.set(user.id, socket.id);

      Logger.info(`Socket Connected: User ${user.id} (${socket.id})`);

      // Broadcast presence
      this.io.emit('user_status', { userId: user.id, status: 'ONLINE' });

      // Join isolated conversation room to scope message fan-out strictly to active participants
      socket.on('join_conversation', (conversationId: string) => {
        socket.join(`conversation_${conversationId}`);
        Logger.debug(`Socket ${socket.id} joined room conversation_${conversationId}`);
      });

      socket.on('leave_conversation', (conversationId: string) => {
        socket.leave(`conversation_${conversationId}`);
      });

      // Handle real-time messaging
      socket.on('send_message', async (data: { conversationId: string; content: string; attachmentUrl?: string }) => {
        try {
          const message = await ConversationService.sendMessage(data.conversationId, user.id, {
            content: data.content,
            attachmentUrl: data.attachmentUrl,
          });

          // Broadcast to everyone in conversation room
          this.io.to(`conversation_${data.conversationId}`).emit('receive_message', message);
        } catch (error: any) {
          socket.emit('error', { message: error.message });
        }
      });

      // Broadcast typing indicator to conversation peers excluding the sending client socket
      socket.on('typing_start', (conversationId: string) => {
        socket.to(`conversation_${conversationId}`).emit('user_typing', {
          conversationId,
          userId: user.id,
          isTyping: true,
        });
      });

      socket.on('typing_stop', (conversationId: string) => {
        socket.to(`conversation_${conversationId}`).emit('user_typing', {
          conversationId,
          userId: user.id,
          isTyping: false,
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        this.onlineUsers.delete(user.id);
        this.io.emit('user_status', { userId: user.id, status: 'OFFLINE' });
        Logger.info(`Socket Disconnected: User ${user.id}`);
      });
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}
