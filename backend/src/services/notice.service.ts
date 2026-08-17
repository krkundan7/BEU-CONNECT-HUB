import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { NoticeCategory } from '@prisma/client';

export class NoticeService {
  static async createNotice(data: {
    title: string;
    category?: NoticeCategory;
    isOfficial?: boolean;
    source: string;
    summary: string;
    content: string;
    isUrgent?: boolean;
    fileUrl?: string;
    publishedAt?: string;
  }) {
    return prisma.notice.create({
      data: {
        title: data.title,
        category: data.category || NoticeCategory.EXAM,
        isOfficial: data.isOfficial !== undefined ? data.isOfficial : true,
        source: data.source,
        summary: data.summary,
        content: data.content,
        isUrgent: data.isUrgent || false,
        fileUrl: data.fileUrl,
        publishedAt: data.publishedAt || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      },
    });
  }

  static async getNotices(category?: NoticeCategory, search?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.notice.findMany({
      where,
      orderBy: [{ isUrgent: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async getNoticeById(id: string) {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) throw AppError.notFound('Official BEU Notice not found');
    return notice;
  }
}
