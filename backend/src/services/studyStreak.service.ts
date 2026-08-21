export class StudyStreakService {
  static evaluateStreak(lastActiveDate: Date | null, currentStreak: number): { newStreak: number; streakMaintained: boolean } {
    if (!lastActiveDate) {
      return { newStreak: 1, streakMaintained: true };
    }

    const now = new Date();
    const last = new Date(lastActiveDate);

    // Normalize to midnight UTC
    const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { newStreak: currentStreak, streakMaintained: true };
    } else if (diffDays === 1) {
      return { newStreak: currentStreak + 1, streakMaintained: true };
    } else {
      return { newStreak: 1, streakMaintained: false };
    }
  }
}
