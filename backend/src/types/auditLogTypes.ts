export interface IAuditLogRecord {
  id: string;
  action: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  resourceId?: string;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILURE';
}
