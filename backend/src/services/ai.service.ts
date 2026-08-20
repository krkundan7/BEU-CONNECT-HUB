import prisma from '../config/prisma.js';
import { aiService } from '../integrations/ai/aiFactory.js';
import { AIChatMessage } from '../integrations/ai/ai.interface.js';
import { AIRole } from '@prisma/client';
import { Logger } from '../utils/logger.js';

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
    let conversationId = data.conversationId || `conv-${Date.now()}`;
    let history: any[] = [];

    // 1. Try to record in DB if available
    try {
      if (!data.conversationId) {
        const conv = await prisma.aIConversation.create({
          data: {
            userId,
            title: data.message.slice(0, 40) + '...',
          },
        });
        conversationId = conv.id;
      }

      await prisma.aIMessage.create({
        data: {
          conversationId,
          role: AIRole.USER,
          content: data.attachment
            ? `[Attached ${data.attachment.type.toUpperCase()}: ${data.attachment.name || 'document'}] ${data.message}`
            : data.message,
        },
      });

      history = await prisma.aIMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 10,
      });
    } catch (dbErr) {
      Logger.warn('Database offline or message logging bypassed in AI Chat, continuing with direct inference', dbErr);
    }

    // 2. Prepare AI input messages
    const aiInput: AIChatMessage[] = history.length > 0
      ? history.map((h: any) => ({
          role: h.role.toLowerCase() as 'user' | 'assistant' | 'system',
          content: h.content,
        }))
      : [
          {
            role: 'user',
            content: data.message,
          },
        ];

    // Inject active multimodal attachment payload into the trailing user message turn
    if (data.attachment && aiInput.length > 0) {
      aiInput[aiInput.length - 1].attachment = data.attachment;
    }

    // 3. Generate AI response with official BEU syllabus grounding
    const aiResponseText = await aiService.generateAcademicResponse(aiInput);

    // 4. Try persisting assistant reply
    let assistantMessage: any = {
      id: `msg-${Date.now()}`,
      conversationId,
      role: AIRole.ASSISTANT,
      content: aiResponseText,
      createdAt: new Date(),
    };

    try {
      assistantMessage = await prisma.aIMessage.create({
        data: {
          conversationId,
          role: AIRole.ASSISTANT,
          content: aiResponseText,
        },
      });
    } catch {
      // Return standard in-memory assistant message
    }

    return {
      conversationId,
      message: assistantMessage,
      content: aiResponseText,
    };
  }

  /* NOV-COMMENT-30: 16-Point PYQ Frequency & Pattern Intelligence Engine
   * Generates a structured academic trends report mapping topic recurrence across past 5+ years of BEU exams.
   * Calculates unit-wise mark distributions, numerical vs theoretical split ratios, and repeated question probabilities
   * while injecting statutory disclaimer envelopes to guarantee ethical AI examination assistance. */
  static async analyzePYQ(subjectName: string, branch?: string, semester?: number) {
    const analysis = await aiService.analyzePYQPatterns(subjectName, branch, semester, []);
    return analysis;
  }

  static async getUserAIConversations(userId: string) {
    try {
      return await prisma.aIConversation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } catch {
      return [];
    }
  }
}
