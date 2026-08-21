export interface IGradeTargetInput {
  targetCGPA: number;
  completedSemesters: { sgpa: number; credits: number }[];
  upcomingSemestersCount: number;
  defaultCreditsPerSemester?: number;
}

export class GradePredictionService {
  static calculateRequiredSGPA(input: IGradeTargetInput): { requiredSGPA: number; isAchievable: boolean } {
    const { targetCGPA, completedSemesters, upcomingSemestersCount, defaultCreditsPerSemester = 20 } = input;
    const completedCredits = completedSemesters.reduce((sum, s) => sum + s.credits, 0);
    const completedPoints = completedSemesters.reduce((sum, s) => sum + s.sgpa * s.credits, 0);

    const upcomingCredits = upcomingSemestersCount * defaultCreditsPerSemester;
    const totalCredits = completedCredits + upcomingCredits;

    if (totalCredits === 0) return { requiredSGPA: 0, isAchievable: true };

    const targetTotalPoints = targetCGPA * totalCredits;
    const neededPoints = targetTotalPoints - completedPoints;
    const requiredSGPA = Number((neededPoints / upcomingCredits).toFixed(2));

    return {
      requiredSGPA: Math.max(0, requiredSGPA),
      isAchievable: requiredSGPA <= 10.0,
    };
  }
}
