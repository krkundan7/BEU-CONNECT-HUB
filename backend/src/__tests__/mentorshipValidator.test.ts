import { mentorshipBookingSchema } from '../validators/mentorshipRequest.validator';

describe('Mentorship Request Validator Schema', () => {
  it('requires agenda of min 10 chars', () => {
    const res = mentorshipBookingSchema.safeParse({
      slotId: 'slot_1',
      agenda: 'Need guidance for GATE CS 2026 preparation',
      preferredContact: 'GOOGLE_MEET',
    });
    expect(res.success).toBe(true);
  });
});
