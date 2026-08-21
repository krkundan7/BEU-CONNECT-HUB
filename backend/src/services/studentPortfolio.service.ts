export interface IPortfolioAggregate {
  studentName: string;
  college: string;
  branch: string;
  semester: number;
  remarksScore: number;
  studyStreakDays: number;
  uploadedNotesCount: number;
  projectsCount: number;
}

export class StudentPortfolioService {
  static formatPortfolioSummary(portfolio: IPortfolioAggregate): string {
    return `${portfolio.studentName} | ${portfolio.branch} Sem ${portfolio.semester} | ${portfolio.college} | Remarks: ${portfolio.remarksScore}`;
  }
}
