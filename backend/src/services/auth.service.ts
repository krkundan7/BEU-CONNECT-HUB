import prisma from '../config/prisma.js';
import { PasswordUtils } from '../utils/password.js';
import { TokenUtils } from '../utils/token.js';
import { AppError } from '../utils/AppError.js';
import { Role, VerificationStatus } from '@prisma/client';

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    mobile?: string;
    college: string;
    branch: string;
    semester: number;
    beuRegNo: string;
  }) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email.toLowerCase() }, { beuRegNo: data.beuRegNo }],
      },
    });

    if (existing) {
      if (existing.email.toLowerCase() === data.email.toLowerCase()) {
        throw AppError.conflict('An account with this email address already exists');
      }
      throw AppError.conflict('An account with this BEU registration number already exists');
    }

    const passwordHash = await PasswordUtils.hash(data.password);

    // Find or create College, Branch, Semester
    let college = await prisma.college.findFirst({
      where: { name: { equals: data.college, mode: 'insensitive' } },
    });
    if (!college) {
      const code = data.college.split(' ').map(w => w[0]).join('').toUpperCase() || 'COL';
      college = await prisma.college.create({
        data: {
          name: data.college,
          code: `${code}-${Date.now() % 1000}`,
          location: 'Bihar, India',
          district: 'Patna',
        },
      });
    }

    let branch = await prisma.branch.findFirst({
      where: { name: { equals: data.branch, mode: 'insensitive' } },
    });
    if (!branch) {
      const code = data.branch.split(' ').map(w => w[0]).join('').toUpperCase() || 'ENG';
      branch = await prisma.branch.create({
        data: {
          name: data.branch,
          code: `${code}-${Date.now() % 1000}`,
        },
      });
    }

    let semester = await prisma.semester.findUnique({
      where: { number: data.semester },
    });
    if (!semester) {
      semester = await prisma.semester.create({
        data: {
          number: data.semester,
          name: `Semester ${data.semester}`,
        },
      });
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        mobile: data.mobile,
        collegeId: college.id,
        branchId: branch.id,
        semesterId: semester.id,
        beuRegNo: data.beuRegNo,
        role: Role.STUDENT,
        verificationStatus: VerificationStatus.PENDING,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
        profile: {
          create: {
            interests: ['Web Development', 'Competitive Programming', 'Core Engineering'],
          },
        },
        verifications: {
          create: {
            collegeName: data.college,
            beuRegNo: data.beuRegNo,
            status: VerificationStatus.PENDING,
          },
        },
      },
      include: {
        college: true,
        branch: true,
        semester: true,
      },
    });

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
    };

    const accessToken = TokenUtils.generateAccessToken(tokenPayload);
    const { token: refreshToken, hash: refreshTokenHash } = TokenUtils.generateRefreshToken();

    // Store hashed refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        avatar: user.avatar,
        college: user.college?.name,
        branch: user.branch?.name,
        semester: user.semester?.number,
      },
      accessToken,
      refreshToken,
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { college: true, branch: true, semester: true },
    });

    if (!user) {
      throw AppError.unauthorized('Invalid email address or password');
    }

    const isValid = await PasswordUtils.compare(password, user.passwordHash);
    if (!isValid) {
      throw AppError.unauthorized('Invalid email address or password');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
    };

    const accessToken = TokenUtils.generateAccessToken(tokenPayload);
    const { token: refreshToken, hash: refreshTokenHash } = TokenUtils.generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        tokenHash: refreshTokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        avatar: user.avatar,
        college: user.college?.name,
        branch: user.branch?.name,
        semester: user.semester?.number,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(rawRefreshToken: string) {
    const tokenHash = TokenUtils.hashToken(rawRefreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw AppError.unauthorized('Invalid or expired refresh token. Please log in again.');
    }

    // Revoke used token (refresh token rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const user = storedToken.user;
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
    };

    const accessToken = TokenUtils.generateAccessToken(tokenPayload);
    const { token: newRefreshToken, hash: newRefreshTokenHash } = TokenUtils.generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        tokenHash: newRefreshTokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(userId: string) {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return true;
  }

  static async getMe(userId: string) {
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
      throw AppError.notFound('User profile not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
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
}
