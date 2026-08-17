import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { VerificationStatus } from '@prisma/client';

export class VerificationService {
  static async submitVerification(userId: string, data: { collegeName: string; beuRegNo: string; documentUrl?: string }) {
    const existing = await prisma.verification.findFirst({
      where: { userId, status: VerificationStatus.PENDING },
    });

    if (existing) {
      throw AppError.conflict('A student verification request is already pending review');
    }

    const verification = await prisma.verification.create({
      data: {
        userId,
        collegeName: data.collegeName,
        beuRegNo: data.beuRegNo,
        documentUrl: data.documentUrl,
        status: VerificationStatus.PENDING,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        beuRegNo: data.beuRegNo,
        verificationStatus: VerificationStatus.PENDING,
      },
    });

    return verification;
  }

  static async getVerificationStatus(userId: string) {
    const verification = await prisma.verification.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return (
      verification || {
        status: VerificationStatus.PENDING,
        message: 'No verification requested yet',
      }
    );
  }

  static async getAllVerifications(status?: VerificationStatus) {
    return prisma.verification.findMany({
      where: status ? { status } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            college: { select: { name: true } },
            branch: { select: { name: true, code: true } },
            semester: { select: { number: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async approveVerification(adminId: string, verificationId: string, adminNote?: string) {
    const verification = await prisma.verification.findUnique({ where: { id: verificationId } });
    if (!verification) {
      throw AppError.notFound('Verification record not found');
    }

    const updated = await prisma.verification.update({
      where: { id: verificationId },
      data: {
        status: VerificationStatus.VERIFIED,
        adminNote,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: verification.userId },
      data: { verificationStatus: VerificationStatus.VERIFIED },
    });

    // Notify student
    await prisma.notification.create({
      data: {
        userId: verification.userId,
        type: 'NOTICE',
        title: 'Academic Verification Approved! 🎓',
        message: 'Your Bihar Engineering University student status has been successfully verified.',
        link: '/profile',
      },
    });

    return updated;
  }

  static async rejectVerification(adminId: string, verificationId: string, adminNote?: string) {
    const verification = await prisma.verification.findUnique({ where: { id: verificationId } });
    if (!verification) {
      throw AppError.notFound('Verification record not found');
    }

    const updated = await prisma.verification.update({
      where: { id: verificationId },
      data: {
        status: VerificationStatus.REJECTED,
        adminNote: adminNote || 'Verification credentials could not be validated.',
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: verification.userId },
      data: { verificationStatus: VerificationStatus.REJECTED },
    });

    return updated;
  }
}
