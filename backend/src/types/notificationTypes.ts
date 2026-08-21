export interface INotificationEnvelope {
  id: string;
  recipientId: string;
  title: string;
  body: string;
  type: 'NOTICE' | 'MENTORSHIP' | 'COMMUNITY' | 'SYSTEM' | 'REMARKS';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}
