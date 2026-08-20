import prisma from '../config/prisma.js';
import { aiService } from '../integrations/ai/aiFactory.js';
import { AIChatMessage } from '../integrations/ai/ai.interface.js';
import { AIRole } from '@prisma/client';

export class AIChatService {
  /**
   * Orchestrates multi-turn academic AI conversations, automatically creating conversation threads,
   * maintaining a sliding window of the last 10 messages for context, and persisting assistant replies.
   */
  static async handleChat(
    userId: string,
    data: {
      conversationId?: string;
      message: string;
      attachment?: {
        type: 'image' | 'pdf';
        dataUrl: string;
        name?: string;
        size?: string;
      };
    }
  ) {
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
        content: data.attachment
          ? `[Attached ${data.attachment.type.toUpperCase()}: ${data.attachment.name || 'document'}] ${data.message}`
          : data.message,
      },
    });

    // Fetch conversation history
    const history = await prisma.aIMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    const aiInput: AIChatMessage[] = history.map(h => ({
      role: h.role.toLowerCase() as 'user' | 'assistant' | 'system',
      content: h.content,
    }));

    // Inject active multimodal attachment payload into the trailing user message turn
    if (data.attachment && aiInput.length > 0) {
      aiInput[aiInput.length - 1].attachment = data.attachment;
    }

    // Generate AI response with official BEU syllabus grounding
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

  /**
   * Dispatches subject-level queries to the BEU pattern analyzer to generate 16-point PYQ intelligence reports.
   */
  static async analyzePYQ(subjectName: string, branch?: string, semester?: number) {
    const analysis = await aiService.analyzePYQPatterns(subjectName, branch, semester, []);
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
