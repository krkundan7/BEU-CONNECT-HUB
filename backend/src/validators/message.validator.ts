import { z } from 'zod';

/**
 * 1-on-1 Direct Message conversation initiation schema verifying valid recipient UUID
 * and optional initial welcome message body.
 */
export const startConversationSchema = z.object({
  body: z.object({
    recipientId: z.string().uuid('Invalid recipient user ID'),
    initialMessage: z.string().min(1).max(2000).optional(),
  }),
});

/**
 * Real-time message dispatch schema validating message length (1-3000 chars) and optional document/media attachment URLs.
 */
export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Message content cannot be empty').max(3000),
    attachmentUrl: z.string().url().optional(),
  }),
});
