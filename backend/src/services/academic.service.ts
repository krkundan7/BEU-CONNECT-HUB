import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export class AcademicService {
  static async getBranches() {
    return prisma.branch.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async getSemesters() {
    return prisma.semester.findMany({
      orderBy: { number: 'asc' },
    });
  }

  static async getSubjects(branchId?: string, semesterId?: string) {
    const where: any = {};
    if (branchId) where.branchId = branchId;
    if (semesterId) where.semesterId = semesterId;

    return prisma.subject.findMany({
      where,
      orderBy: { code: 'asc' },
      include: {
        branch: true,
        semester: true,
        _count: { select: { notes: true, pyqs: true, videos: true } },
      },
    });
  }

  static async getSubjectById(subjectId: string) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        branch: true,
        semester: true,
        syllabus: {
          include: {
            topics: {
              orderBy: [{ unitNumber: 'asc' }, { createdAt: 'asc' }],
            },
          },
        },
        _count: { select: { notes: true, pyqs: true, videos: true } },
      },
    });

    if (!subject) {
      throw AppError.notFound('Subject not found');
    }

    return subject;
  }

  static async getSubjectTopics(subjectId: string) {
    const syllabus = await prisma.syllabus.findUnique({
      where: { subjectId },
      include: {
        topics: {
          orderBy: [{ unitNumber: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    return syllabus?.topics || [];
  }
}
