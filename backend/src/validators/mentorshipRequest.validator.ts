import { z } from 'zod';

export const mentorshipBookingSchema = z.object({
  slotId: z.string().min(1, 'Slot ID is required'),
  agenda: z.string().min(10, 'Please state your agenda in at least 10 characters').max(300),
  preferredContact: z.enum(['GOOGLE_MEET', 'ZOOM', 'PHONE']),
});
