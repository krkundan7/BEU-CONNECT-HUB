import { StudyStreakService } from '../services/studyStreak.service';

describe('Study Streak Service', () => {
  it('increments streak on consecutive day activity', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = StudyStreakService.evaluateStreak(yesterday, 4);
    expect(result.newStreak).toBe(5);
    expect(result.streakMaintained).toBe(true);
  });
});
