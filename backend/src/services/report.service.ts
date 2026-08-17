import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { ReportReason, ReportStatus } from '@prisma/client';

export class ReportService {
  static async createReport(reporterId: string, data: {
    targetType: string;
    targetId: string;
    reason: ReportReason;
    details?: string;
  }) {
    return prisma.report.create({
      data: {
        reporterId,
        targetType: data.targetType,
        targetId: data.targetId,
        reason: data.reason,
        details: data.details,
        status: ReportStatus.OPEN,
      },
    });
  }

  static async getReports(status?: ReportStatus) {
    return prisma.report.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  static async updateReportStatus(reportId: string, adminId: string, status: ReportStatus, adminNote?: string) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw AppError.notFound('Report record not found');

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        adminNote,
        resolvedById: adminId,
      },
    });

    // Record admin audit log
    await prisma.adminAction.create({
      data: {
        adminId,
        actionType: 'RESOLVE_REPORT',
        targetType: report.targetType,
        targetId: report.targetId,
        details: `Report ${reportId} marked as ${status}. Note: ${adminNote || 'None'}`,
      },
    });

    return updated;
  }
}
