import prisma from '../config/prisma.js';

export class SearchService {
  static async globalSearch(query: string, limit: number = 5) {
    if (!query || query.trim().length === 0) {
      return {
        users: [],
        subjects: [],
        communities: [],
        notes: [],
        pyqs: [],
        opportunities: [],
        projects: [],
      };
    }

    const term = query.trim();

    const [users, subjects, communities, notes, pyqs, opportunities, projects] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { bio: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          name: true,
          avatar: true,
          verificationStatus: true,
          college: { select: { name: true } },
          branch: { select: { code: true } },
        },
      }),
      prisma.subject.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { code: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: { branch: true, semester: true },
      }),
      prisma.community.findMany({
        where: {
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          category: true,
          _count: { select: { members: true } },
        },
      }),
      prisma.note.findMany({
        where: {
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: { subject: { select: { name: true, code: true } } },
      }),
      prisma.pYQ.findMany({
        where: {
          subject: {
            OR: [
              { name: { contains: term, mode: 'insensitive' } },
              { code: { contains: term, mode: 'insensitive' } },
            ],
          },
        },
        take: limit,
        include: { subject: { select: { name: true, code: true } } },
      }),
      prisma.opportunity.findMany({
        where: {
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { organization: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
      prisma.project.findMany({
        where: {
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
    ]);

    return {
      users,
      subjects,
      communities,
      notes,
      pyqs,
      opportunities,
      projects,
    };
  }
}
