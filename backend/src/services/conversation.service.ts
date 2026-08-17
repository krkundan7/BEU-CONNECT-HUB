import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export class ConversationService {
  static async getOrCreateConversation(userId1: string, userId2: string) {
    if (userId1 === userId2) {
      throw AppError.badRequest('You cannot create a conversation with yourself');
    }

    // Check if 1-to-1 conversation already exists
    const existing = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { members: { some: { userId: userId1 } } },
          { members: { some: { userId: userId2 } } },
        ],
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true, verificationStatus: true },
            },
          },
        },
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.conversation.create({
      data: {
        isGroup: false,
        members: {
          create: [{ userId: userId1 }, { userId: userId2 }],
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true, verificationStatus: true },
            },
          },
        },
      },
    });
  }

  static async getUserConversations(userId: string) {
    const list = await prisma.conversation.findMany({
      where: {
        members: { some: { userId } },
      },
      orderBy: { lastMessageAt: 'desc' },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                verificationStatus: true,
                college: { select: { name: true } },
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return list.map(c => {
      const otherMember = c.members.find(m => m.userId !== userId)?.user;
      return {
        id: c.id,
        isGroup: c.isGroup,
        title: c.title || otherMember?.name || 'Direct Message',
        otherUser: otherMember,
        lastMessage: c.messages[0] || null,
        lastMessageAt: c.lastMessageAt,
      };
    });
  }

  static async getMessages(conversationId: string, userId: string) {
    // Verify membership
    const isMember = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!isMember) {
      throw AppError.forbidden('You do not have access to this conversation');
    }

    // Mark messages as read
    await prisma.conversationMember.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });

    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  static async sendMessage(conversationId: string, senderId: string, data: { content: string; attachmentUrl?: string }) {
    const isMember = await prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId: senderId } },
    });

    if (!isMember) {
      throw AppError.forbidden('You do not have access to this conversation');
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: data.content,
        attachmentUrl: data.attachmentUrl,
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }
}
