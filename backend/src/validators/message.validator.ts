import { z } from 'zod';

export const startConversationSchema = z.object({
  body: z.object({
    recipientId: z.string().uuid('Invalid recipient user ID'),
    initialMessage: z.string().min(1).max(2000).optional(),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Message content cannot be empty').max(3000),
    attachmentUrl: z.string().url().optional(),
  }),
});
