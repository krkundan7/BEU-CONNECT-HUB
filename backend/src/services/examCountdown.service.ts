export class ExamCountdownService {
  static getDaysRemaining(targetExamDate: Date): number {
    const now = new Date();
    const diffTime = targetExamDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
}
