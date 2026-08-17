import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { CommunityCategory, CommunityMemberRole, Role } from '@prisma/client';

export class CommunityService {
  static async createCommunity(creatorId: string, data: {
    name: string;
    description: string;
    category?: CommunityCategory;
    icon?: string;
    coverImage?: string;
    rules?: string[];
    isPrivate?: boolean;
  }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await prisma.community.findFirst({
      where: { OR: [{ name: data.name }, { slug }] },
    });
    if (existing) {
      throw AppError.conflict('A student community with this name already exists');
    }

    const community = await prisma.community.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        category: data.category || CommunityCategory.INTEREST,
        icon: data.icon || '🚀',
        coverImage: data.coverImage,
        rules: data.rules || [],
        isPrivate: data.isPrivate || false,
        creatorId,
        members: {
          create: {
            userId: creatorId,
            role: CommunityMemberRole.OWNER,
          },
        },
      },
      include: {
        _count: { select: { members: true, posts: true } },
      },
    });

    return community;
  }

  static async getCommunities(category?: CommunityCategory, search?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const list = await prisma.community.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { members: true, posts: true } },
      },
    });

    return list.map(c => ({
      ...c,
      membersCount: c._count.members,
      postsCount: c._count.posts,
    }));
  }

  static async getCommunityById(idOrSlug: string, currentUserId?: string) {
    const community = await prisma.community.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        creator: {
          select: { id: true, name: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                verificationStatus: true,
                college: { select: { name: true } },
              },
            },
          },
        },
        _count: { select: { members: true, posts: true } },
      },
    });

    if (!community) {
      throw AppError.notFound('Community not found');
    }

    const isMember = currentUserId ? community.members.some(m => m.userId === currentUserId) : false;
    const userRole = currentUserId ? community.members.find(m => m.userId === currentUserId)?.role : null;

    return {
      ...community,
      membersCount: community._count.members,
      postsCount: community._count.posts,
      isMember,
      userRole,
    };
  }

  static async toggleJoinCommunity(communityId: string, userId: string) {
    const existing = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });

    if (existing) {
      if (existing.role === CommunityMemberRole.OWNER) {
        throw AppError.badRequest('The community creator cannot leave without transferring ownership');
      }
      await prisma.communityMember.delete({ where: { id: existing.id } });
      return { isMember: false };
    }

    await prisma.communityMember.create({
      data: {
        communityId,
        userId,
        role: CommunityMemberRole.MEMBER,
      },
    });

    return { isMember: true };
  }

  static async createCommunityPost(communityId: string, authorId: string, data: { title: string; content: string }) {
    const member = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId: authorId } },
    });

    if (!member) {
      throw AppError.forbidden('You must join this community before posting discussions');
    }

    return prisma.communityPost.create({
      data: {
        communityId,
        authorId,
        title: data.title,
        content: data.content,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, verificationStatus: true },
        },
      },
    });
  }

  static async getCommunityPosts(communityId: string) {
    return prisma.communityPost.findMany({
      where: { communityId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, avatar: true, verificationStatus: true },
        },
      },
    });
  }
}
