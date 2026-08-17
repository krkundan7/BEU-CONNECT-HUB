import prisma from '../config/prisma.js';
import { aiService } from '../integrations/ai/geminiAI.service.js';
import { AIRole } from '@prisma/client';

export class AIChatService {
  static async handleChat(userId: string, data: { conversationId?: string; message: string }) {
    let conversationId = data.conversationId;

    if (!conversationId) {
      const conv = await prisma.aIConversation.create({
        data: {
          userId,
          title: data.message.slice(0, 40) + '...',
        },
      });
      conversationId = conv.id;
    }

    // Save User message
    await prisma.aIMessage.create({
      data: {
        conversationId,
        role: AIRole.USER,
        content: data.message,
      },
    });

    // Fetch conversation history
    const history = await prisma.aIMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    const aiInput = history.map(h => ({
      role: h.role.toLowerCase() as 'user' | 'assistant' | 'system',
      content: h.content,
    }));

    // Generate AI response
    const aiResponseText = await aiService.generateAcademicResponse(aiInput);

    // Save Assistant message
    const assistantMessage = await prisma.aIMessage.create({
      data: {
        conversationId,
        role: AIRole.ASSISTANT,
        content: aiResponseText,
      },
    });

    return {
      conversationId,
      message: assistantMessage,
    };
  }

  static async analyzePYQ(subjectName: string) {
    const analysis = await aiService.analyzePYQPatterns(subjectName, []);
    return analysis;
  }

  static async getUserAIConversations(userId: string) {
    return prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
