import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { MentorshipStatus } from '@prisma/client';

export class MentorshipService {
  static async upsertMentorProfile(userId: string, data: {
    bio: string;
    skills: string[];
    domain: string;
    yearOfStudy?: string;
    availableSlots?: number;
  }) {
    return prisma.mentorProfile.upsert({
      where: { userId },
      create: {
        userId,
        bio: data.bio,
        skills: data.skills,
        domain: data.domain,
        yearOfStudy: data.yearOfStudy || '4th Year',
        availableSlots: data.availableSlots || 5,
      },
      update: {
        bio: data.bio,
        skills: data.skills,
        domain: data.domain,
        yearOfStudy: data.yearOfStudy,
        availableSlots: data.availableSlots,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            college: { select: { name: true } },
            branch: { select: { name: true, code: true } },
          },
        },
      },
    });
  }

  static async getMentors(domain?: string) {
    const where: any = { isAvailable: true };
    if (domain) where.domain = { contains: domain, mode: 'insensitive' };

    const mentors = await prisma.mentorProfile.findMany({
      where,
      orderBy: { rating: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verificationStatus: true,
            college: { select: { name: true } },
            branch: { select: { name: true, code: true } },
          },
        },
      },
    });

    return mentors.map((m: any) => ({
      id: m.id,
      userId: m.userId,
      name: m.user.name,
      avatar: m.user.avatar,
      college: m.user.college?.name,
      branch: m.user.branch?.name,
      isVerified: m.user.verificationStatus === 'VERIFIED',
      bio: m.bio,
      skills: m.skills,
      domain: m.domain,
      year: m.yearOfStudy,
      rating: m.rating,
      reviewsCount: m.reviewsCount,
      availableSlots: m.availableSlots,
    }));
  }

  static async requestMentorship(studentId: string, mentorProfileId: string, data: { topic: string; message: string }) {
    const mentor = await prisma.mentorProfile.findUnique({
      where: { id: mentorProfileId },
      include: { user: true },
    });

    if (!mentor) throw AppError.notFound('Mentor profile not found');
    if (mentor.userId === studentId) throw AppError.badRequest('You cannot request mentorship from yourself');

    const request = await prisma.mentorshipRequest.create({
      data: {
        mentorId: mentor.id,
        studentId,
        topic: data.topic,
        message: data.message,
        status: MentorshipStatus.PENDING,
      },
    });

    // Notify mentor
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    await prisma.notification.create({
      data: {
        userId: mentor.userId,
        type: 'MENTORSHIP',
        title: 'New Mentorship Guidance Request',
        message: `${student?.name || 'A student'} requested guidance regarding "${data.topic}".`,
        link: '/mentorship',
      },
    });

    return request;
  }
}
