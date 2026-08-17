import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { ProjectStatus, ProjectTaskStatus } from '@prisma/client';

export class ProjectService {
  static async createProject(creatorId: string, data: {
    title: string;
    description: string;
    category: string;
    requiredSkills: string[];
    teamSize?: number;
    githubUrl?: string;
    demoUrl?: string;
  }) {
    const project = await prisma.project.create({
      data: {
        creatorId,
        title: data.title,
        description: data.description,
        category: data.category,
        requiredSkills: data.requiredSkills,
        teamSize: data.teamSize || 4,
        status: ProjectStatus.LOOKING_FOR_TEAM,
        githubUrl: data.githubUrl,
        demoUrl: data.demoUrl,
        members: {
          create: {
            userId: creatorId,
            role: 'Team Lead',
          },
        },
        tasks: {
          create: [
            { title: 'Define project architecture & API contracts', status: ProjectTaskStatus.TODO },
            { title: 'Setup GitHub repo and CI pipeline', status: ProjectTaskStatus.DONE },
          ],
        },
      },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true, college: { select: { name: true } } },
            },
          },
        },
        tasks: true,
      },
    });

    return project;
  }

  static async getProjects(status?: ProjectStatus, search?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
            college: { select: { name: true } },
          },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
        tasks: true,
      },
    });
  }

  static async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
            college: { select: { name: true } },
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                college: { select: { name: true } },
                branch: { select: { code: true } },
              },
            },
          },
        },
        tasks: true,
      },
    });

    if (!project) throw AppError.notFound('Project not found');
    return project;
  }

  static async findMatchesForProject(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        creator: { select: { id: true, branchId: true } },
        members: { select: { userId: true } },
      },
    });

    if (!project) throw AppError.notFound('Project not found');

    const existingMemberIds = project.members.map((m: any) => m.userId);

    // Fetch candidate students with their skills
    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: existingMemberIds },
      },
      take: 20,
      include: {
        college: { select: { name: true } },
        branch: { select: { name: true, code: true } },
        semester: { select: { number: true } },
        skills: { include: { skill: true } },
        profile: true,
      },
    });

    const projectSkillsLower = project.requiredSkills.map((s: string) => s.toLowerCase());

    const matches = candidates.map((user: any) => {
      const userSkills = user.skills.map((s: any) => s.skill.name.toLowerCase());
      const commonSkills = projectSkillsLower.filter((s: string) => userSkills.includes(s));

      const skillScore = projectSkillsLower.length > 0
        ? Math.round((commonSkills.length / projectSkillsLower.length) * 100)
        : 50;

      const branchBonus = user.branchId === project.creator.branchId ? 15 : 0;
      const overallMatchScore = Math.min(100, Math.max(30, skillScore + branchBonus));

      return {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          verificationStatus: user.verificationStatus,
          college: user.college?.name,
          branch: user.branch?.code,
          semester: user.semester?.number,
          skills: user.skills.map((s: any) => s.skill.name),
        },
        matchedSkills: commonSkills,
        matchScore: overallMatchScore,
        explanation: `Skill Match: ${skillScore}%, Interdisciplinary Synergy: ${branchBonus > 0 ? '+15%' : '0%'}`,
      };
    });

    matches.sort((a: any, b: any) => b.matchScore - a.matchScore);
    return matches;
  }
}
