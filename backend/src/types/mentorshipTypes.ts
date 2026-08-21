export interface IMentorshipSlot {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  topic: string;
  availableDate: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  meetingLink?: string;
}
