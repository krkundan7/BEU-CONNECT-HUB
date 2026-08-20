import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { PostType, Visibility, BookmarkItemType, Role } from '@prisma/client';
import { PaginationQuery, PaginatedResult } from '../types/index.js';

/**
 * Campus Social Feed Service
 * Manages post life cycle, rich media associations, paginated queries with viewer reactions,
 * authorization barriers for content deletion, like toggling, and threaded commentary.
 */
export class PostService {
  /* NOV-COMMENT-34: Relational Post Creation & Gamification Reward Attribution
   * Persists campus feed updates while creating nested child 'Media' records for uploaded images/documents.
   * Atomically increments the author's 'contributionPoints' by +10 remarks points to encourage peer academic sharing. */
  static async createPost(authorId: string, data: { content: string; type?: PostType; visibility?: Visibility; mediaUrls?: string[] }) {
    const post = await prisma.post.create({
      data: {
        authorId,
        content: data.content,
        type: data.type || PostType.TEXT,
        visibility: data.visibility || Visibility.PUBLIC,
        media: data.mediaUrls && data.mediaUrls.length > 0 ? {
          create: data.mediaUrls.map(url => ({ url })),
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verificationStatus: true,
            college: { select: { name: true } },
            branch: { select: { code: true } },
            semester: { select: { number: true } },
          },
        },
        media: true,
        _count: { select: { likes: true, comments: true } },
      },
    });

    // Reward Remarks points (+10)
    await prisma.user.update({
      where: { id: authorId },
      data: { contributionPoints: { increment: 10 } },
    });

    return post;
  }

  /**
   * Fetches a paginated feed of community posts, calculating total pages and resolving viewer-specific `isLiked` status.
   */
  static async getPosts(currentUserId?: string, query?: PaginationQuery & { type?: PostType; authorId?: string }): Promise<PaginatedResult<any>> {
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query?.type) where.type = query.type;
    if (query?.authorId) where.authorId = query.authorId;
    if (query?.search) {
      where.content = { contains: query.search, mode: 'insensitive' };
    }

    const [total, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              verificationStatus: true,
              college: { select: { name: true } },
              branch: { select: { code: true } },
              semester: { select: { number: true } },
            },
          },
          media: true,
          likes: currentUserId ? { where: { userId: currentUserId } } : false,
          _count: { select: { likes: true, comments: true } },
        },
      }),
    ]);

    const formatted = posts.map((p: any) => ({
      id: p.id,
      content: p.content,
      type: p.type,
      visibility: p.visibility,
      isPinned: p.isPinned,
      createdAt: p.createdAt,
      author: p.author,
      media: p.media,
      likesCount: p._count.likes,
      commentsCount: p._count.comments,
      isLiked: currentUserId ? (p.likes as any[])?.length > 0 : false,
    }));

    return {
      items: formatted,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  // Retrieves post details with nested comments and like reaction check
  static async getPostById(postId: string, currentUserId?: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verificationStatus: true,
            college: { select: { name: true } },
            branch: { select: { code: true } },
            semester: { select: { number: true } },
          },
        },
        media: true,
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
                verificationStatus: true,
              },
            },
          },
        },
        likes: currentUserId ? { where: { userId: currentUserId } } : false,
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!post) {
      throw AppError.notFound('Post not found');
    }

    return {
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: currentUserId ? (post.likes as any[])?.length > 0 : false,
    };
  }

  // Deletes post with author check or moderator/admin override
  static async deletePost(postId: string, userId: string, userRole: Role) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw AppError.notFound('Post not found');

    if (post.authorId !== userId && userRole !== Role.ADMIN && userRole !== Role.MODERATOR) {
      throw AppError.forbidden('You do not have permission to delete this post');
    }

    await prisma.post.delete({ where: { id: postId } });
    return true;
  }

  /* NOV-COMMENT-35: Atomic Like/Unlike Toggling & Post Author Notification Dispatch
   * Utilizes the compound unique index 'postId_userId' on the 'Like' model to determine current reaction state.
   * Atomically destroys or creates the like entity, and conditionally dispatches an in-app notification to the post author
   * if the reactor is not the original author (preventing self-notification spam). */
  static async toggleLike(postId: string, userId: string) {
    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return { isLiked: false };
    }

    await prisma.like.create({
      data: { postId, userId },
    });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post && post.authorId !== userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: 'LIKE',
          title: 'New Post Like',
          message: `${user?.name || 'A student'} liked your campus post.`,
          link: `/posts/${postId}`,
        },
      });
    }

    return { isLiked: true };
  }

  // Creates top-level or threaded comment and alerts the post author
  static async addComment(postId: string, authorId: string, content: string, parentId?: string) {
    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId,
        content,
        parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verificationStatus: true,
          },
        },
      },
    });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post && post.authorId !== authorId) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: 'COMMENT',
          title: 'New Comment on Post',
          message: `${comment.author.name} commented on your campus update.`,
          link: `/posts/${postId}`,
        },
      });
    }

    return comment;
  }

  // Toggles polymorphic bookmark record using compound unique index `userId_itemType_itemId`
  static async toggleBookmark(userId: string, itemType: BookmarkItemType, itemId: string) {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_itemType_itemId: { userId, itemType, itemId },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return { isBookmarked: false };
    }

    await prisma.bookmark.create({
      data: { userId, itemType, itemId },
    });

    return { isBookmarked: true };
  }

  // Retrieves list of bookmarks for the student
  static async getBookmarks(userId: string, itemType?: BookmarkItemType) {
    return prisma.bookmark.findMany({
      where: {
        userId,
        itemType: itemType || undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
