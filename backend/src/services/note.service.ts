import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { ModerationStatus } from '@prisma/client';

export class NoteService {
  static async createNote(uploadedById: string, data: {
    subjectId: string;
    title: string;
    description?: string;
    unitNumber: number;
    fileUrl: string;
  }) {
    const note = await prisma.note.create({
      data: {
        subjectId: data.subjectId,
        title: data.title,
        description: data.description,
        unitNumber: data.unitNumber,
        fileUrl: data.fileUrl,
        uploadedById,
        moderationStatus: ModerationStatus.APPROVED, // auto-approved for verified/trusted users
      },
      include: {
        subject: { select: { name: true, code: true } },
      },
    });

    // Reward Remarks points (+50)
    await prisma.user.update({
      where: { id: uploadedById },
      data: { contributionPoints: { increment: 50 } },
    });

    return note;
  }

  static async getNotes(subjectId?: string, unitNumber?: number) {
    const where: any = {
      moderationStatus: ModerationStatus.APPROVED,
    };
    if (subjectId) where.subjectId = subjectId;
    if (unitNumber) where.unitNumber = unitNumber;

    return prisma.note.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        subject: { select: { name: true, code: true } },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            avatar: true,
            college: { select: { name: true } },
          },
        },
      },
    });
  }

  static async getNoteById(id: string) {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        subject: true,
        uploadedBy: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    if (!note) {
      throw AppError.notFound('Note not found');
    }

    return note;
  }

  // Videos
  static async createStudyVideo(uploadedById: string, data: {
    subjectId: string;
    title: string;
    description?: string;
    unitNumber: number;
    videoUrl: string;
    thumbnailUrl?: string;
    channelName?: string;
    duration?: string;
  }) {
    return prisma.studyVideo.create({
      data: {
        subjectId: data.subjectId,
        title: data.title,
        description: data.description,
        unitNumber: data.unitNumber,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        channelName: data.channelName,
        duration: data.duration,
        uploadedById,
      },
    });
  }

  static async getStudyVideos(subjectId?: string, unitNumber?: number) {
    const where: any = { moderationStatus: ModerationStatus.APPROVED };
    if (subjectId) where.subjectId = subjectId;
    if (unitNumber) where.unitNumber = unitNumber;

    return prisma.studyVideo.findMany({
      where,
      orderBy: { unitNumber: 'asc' },
      include: {
        subject: { select: { name: true, code: true } },
      },
    });
  }
}
