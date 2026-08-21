import { IAuditLogRecord } from '../types/auditLogTypes';
import { Logger } from '../utils/logger';

export class AuditLogService {
  private static logs: IAuditLogRecord[] = [];

  static record(entry: Omit<IAuditLogRecord, 'id' | 'timestamp'>): void {
    const record: IAuditLogRecord = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date(),
    };
    this.logs.push(record);
    if (this.logs.length > 5000) this.logs.shift();
    Logger.debug(`Audit event logged: ${record.action}`);
  }

  static getRecentLogs(limit = 50): IAuditLogRecord[] {
    return this.logs.slice(-limit);
  }
}
