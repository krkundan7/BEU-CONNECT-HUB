export class BookmarkManagerService {
  private static bookmarks = new Map<string, Set<string>>();

  static toggleBookmark(userId: string, resourceId: string): { isBookmarked: boolean; totalCount: number } {
    if (!this.bookmarks.has(userId)) {
      this.bookmarks.set(userId, new Set());
    }
    const userSet = this.bookmarks.get(userId)!;
    if (userSet.has(resourceId)) {
      userSet.delete(resourceId);
      return { isBookmarked: false, totalCount: userSet.size };
    } else {
      userSet.add(resourceId);
      return { isBookmarked: true, totalCount: userSet.size };
    }
  }
}
