import prisma from '../config/prisma.js';

export class AdminService {
  /**
   * Aggregates platform-wide health metrics and moderation backlogs executing 9 parallel Prisma count queries.
   */
  static async getDashboardStats() {
    const [
      totalUsers,
      pendingVerifications,
      openReports,
      totalPosts,
      totalCommunities,
      totalNotes,
      totalPYQs,
      totalNotices,
      totalOpportunities,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.verification.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: 'OPEN' } }),
      prisma.post.count(),
      prisma.community.count(),
      prisma.note.count(),
      prisma.pYQ.count(),
      prisma.notice.count(),
      prisma.opportunity.count(),
    ]);

    return {
      totalUsers,
      pendingVerifications,
      openReports,
      totalPosts,
      totalCommunities,
      totalNotes,
      totalPYQs,
      totalNotices,
      totalOpportunities,
      totalAcademicResources: totalNotes + totalPYQs,
    };
  }

  /**
   * Records an immutable administrative audit log capturing the administrator ID, action type, target entity, and origin IP.
   */
  static async logAdminAction(adminId: string, actionType: string, targetType: string, targetId?: string, details?: string, ipAddress?: string) {
    return prisma.adminAction.create({
      data: {
        adminId,
        actionType,
        targetType,
        targetId,
        details,
        ipAddress,
      },
    });
  }

  static async getAuditLogs(limit: number = 50) {
    return prisma.adminAction.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
}
