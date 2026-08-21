export class MentorSlotBookingService {
  static checkConflict(existingSlots: { startTime: string; endTime: string }[], newSlot: { startTime: string; endTime: string }): boolean {
    return existingSlots.some((s) => s.startTime === newSlot.startTime);
  }
}
