import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export class PYQService {
  static async createPYQ(uploadedById: string, data: {
    subjectId: string;
    year: number;
    examType?: string;
    fileUrl: string;
    solutionUrl?: string;
  }) {
    return prisma.pYQ.create({
      data: {
        subjectId: data.subjectId,
        year: data.year,
        examType: data.examType || 'END_TERM',
        fileUrl: data.fileUrl,
        solutionUrl: data.solutionUrl,
        uploadedById,
      },
      include: {
        subject: { select: { name: true, code: true } },
      },
    });
  }

  static async getPYQs(subjectId?: string, year?: number) {
    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (year) where.year = year;

    return prisma.pYQ.findMany({
      where,
      orderBy: { year: 'desc' },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            branch: { select: { name: true, code: true } },
            semester: { select: { number: true } },
          },
        },
        uploadedBy: {
          select: { id: true, name: true },
        },
      },
    });
  }

  static async getPYQById(id: string) {
    const pyq = await prisma.pYQ.findUnique({
      where: { id },
      include: {
        subject: {
          include: {
            branch: true,
            semester: true,
          },
        },
      },
    });

    if (!pyq) {
      throw AppError.notFound('Previous Year Question Paper not found');
    }

    return pyq;
  }
}
