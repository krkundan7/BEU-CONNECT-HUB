import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { SkillProficiency } from '@prisma/client';

/**
 * User & Profile Management Service
 * Encapsulates core business logic for user profile retrieval, privacy-safe projections,
 * multipart avatar lifecycle, skill proficiency mapping, achievements, and social graph edges.
 */
export class UserService {
  /**
   * Retrieves a student's full public profile with relational joins
   * and projected social engagement aggregates (followers, following, published posts).
   */
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        college: true,
        branch: true,
        semester: true,
        profile: true,
        skills: { include: { skill: true } },
        achievements: true,
        _count: {
          select: { followers: true, following: true, posts: true },
        },
      },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    // Confidentiality Protection: never return sensitive password hash or personal authentication tokens
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      verificationStatus: user.verificationStatus,
      avatar: user.avatar,
      bio: user.bio,
      college: user.college?.name,
      branch: user.branch?.name,
      semester: user.semester?.number,
      contributionPoints: user.contributionPoints,
      profile: user.profile,
      skills: user.skills.map((s: any) => ({ id: s.skill.id, name: s.skill.name, proficiency: s.proficiency })),
      achievements: user.achievements,
      stats: {
        followersCount: user._count.followers,
        followingCount: user._count.following,
        postsCount: user._count.posts,
      },
      createdAt: user.createdAt,
    };
  }

  /**
   * Performs an atomic nested update/upsert on the User and associated UserProfile entities.
   */
  static async updateProfile(userId: string, data: any) {
    const userUpdate: any = {};
    if (data.name) userUpdate.name = data.name;
    if (data.bio !== undefined) userUpdate.bio = data.bio;
    if (data.avatar) userUpdate.avatar = data.avatar;

    const profileUpdate: any = {};
    if (data.github !== undefined) profileUpdate.github = data.github;
    if (data.linkedin !== undefined) profileUpdate.linkedin = data.linkedin;
    if (data.portfolio !== undefined) profileUpdate.portfolio = data.portfolio;
    if (data.interests !== undefined) profileUpdate.interests = data.interests;
    if (data.careerGoals !== undefined) profileUpdate.careerGoals = data.careerGoals;

    await prisma.user.update({
      where: { id: userId },
      data: {
        ...userUpdate,
        profile: {
          upsert: {
            create: profileUpdate,
            update: profileUpdate,
          },
        },
      },
    });

    return this.getUserById(userId);
  }

  // Updates user avatar reference with newly uploaded asset URL
  static async updateAvatar(userId: string, avatarUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: { id: true, avatar: true },
    });
  }

  // Resets user avatar to deterministic DiceBear avatar seeded by user UUID
  static async deleteAvatar(userId: string) {
    const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`;
    return prisma.user.update({
      where: { id: userId },
      data: { avatar: defaultAvatar },
      select: { id: true, avatar: true },
    });
  }

  /**
   * Dynamically associates a skill with a student, creating the global Skill entity if absent
   * and upserting the compound `userId_skillId` join record.
   */
  static async addSkill(userId: string, data: { skillId?: string; skillName?: string; proficiency?: SkillProficiency }) {
    let skillId = data.skillId;

    if (!skillId && data.skillName) {
      let skill = await prisma.skill.findFirst({
        where: { name: { equals: data.skillName, mode: 'insensitive' } },
      });
      if (!skill) {
        skill = await prisma.skill.create({
          data: { name: data.skillName, category: 'Technical' },
        });
      }
      skillId = skill.id;
    }

    if (!skillId) {
      throw AppError.badRequest('Valid skillId or skillName is required');
    }

    const userSkill = await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      create: {
        userId,
        skillId,
        proficiency: data.proficiency || SkillProficiency.INTERMEDIATE,
      },
      update: {
        proficiency: data.proficiency || SkillProficiency.INTERMEDIATE,
      },
      include: { skill: true },
    });

    return {
      id: userSkill.skill.id,
      name: userSkill.skill.name,
      proficiency: userSkill.proficiency,
    };
  }

  // Removes a skill link from the student's profile
  static async removeSkill(userId: string, skillId: string) {
    await prisma.userSkill.deleteMany({
      where: { userId, skillId },
    });
    return true;
  }

  // Creates a verified achievement or hackathon credential
  static async addAchievement(userId: string, data: { title: string; description?: string; date?: string; certificateUrl?: string }) {
    return prisma.achievement.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        date: data.date || new Date().toISOString().split('T')[0],
        certificateUrl: data.certificateUrl,
      },
    });
  }

  // Deletes achievement ensuring strict ownership verification
  static async deleteAchievement(userId: string, achievementId: string) {
    const ach = await prisma.achievement.findUnique({ where: { id: achievementId } });
    if (!ach || ach.userId !== userId) {
      throw AppError.forbidden('You can only delete your own achievements');
    }
    await prisma.achievement.delete({ where: { id: achievementId } });
    return true;
  }

  /**
   * Manages student follow relationships using compound unique keys (`followerId_followingId`),
   * automatically generating an in-app notification when a new follow is established.
   */
  static async toggleFollow(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw AppError.badRequest('You cannot follow yourself');
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw AppError.notFound('Target user not found');
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      return { isFollowing: false };
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId: targetUserId,
      },
    });

    // Create notification for target user
    const follower = await prisma.user.findUnique({ where: { id: followerId } });
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: 'FOLLOW',
        title: 'New Campus Follower',
        message: `${follower?.name || 'A student'} started following your academic profile.`,
        link: `/profile/${followerId}`,
      },
    });

    return { isFollowing: true };
  }

  // Retrieves followers list with projected public student metadata
  static async getFollowers(userId: string) {
    const list = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verificationStatus: true,
            college: { select: { name: true } },
            branch: { select: { code: true } },
          },
        },
      },
    });
    return list.map((f: any) => f.follower);
  }

  // Retrieves following list with projected public student metadata
  static async getFollowing(userId: string) {
    const list = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verificationStatus: true,
            college: { select: { name: true } },
            branch: { select: { code: true } },
          },
        },
      },
    });
    return list.map((f: any) => f.following);
  }
}
