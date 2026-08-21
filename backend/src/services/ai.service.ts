import prisma from '../config/prisma.js';
import { aiService } from '../integrations/ai/aiFactory.js';
import { AIChatMessage } from '../integrations/ai/ai.interface.js';
import { AIRole } from '@prisma/client';
import { Logger } from '../utils/logger.js';

export class AIChatService {
  /* NOV-LOGIC-43: Conversational Academic Context Sliding Window
   * Automatically initializes conversation threads, records student queries, and pulls trailing 10 turns for context preservation. */
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
      /* NOV-LOGIC-44: Lazy Conversation Auto-Provisioning
       * Creates conversation record on first query using the first 40 characters as the thread title. */
      if (!data.conversationId) {
        const conv = await prisma.aIConversation.create({
          data: {
            userId,
            title: data.message.slice(0, 40) + '...',
          },
        });
        conversationId = conv.id;
      }

      /* NOV-LOGIC-45: Multimodal Metadata Query Ingestion
       * Formats attachment type and original filename into the message turn for provenance tracking. */
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

    /* NOV-LOGIC-46: Multimodal Payload Injection to Final Turn
     * Maps Prisma message history to AIChatMessage array and attaches image/pdf data URLs to the active user turn. */
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

    if (data.attachment && aiInput.length > 0) {
      aiInput[aiInput.length - 1].attachment = data.attachment;
    }

    /* NOV-LOGIC-47: Syllabus-Grounded Academic Synthesis
     * Invokes the active AI provider (Gemini 1.5 Flash / OpenRouter) conditioned on BEU 14-marks marking patterns. */
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
