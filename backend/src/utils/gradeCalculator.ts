/**
 * Math and statistical calculation helpers for BEU CGPA & SGPA
 */
export interface SubjectCreditGrade {
  credit: number;
  gradePoint: number; // 0 to 10 scale
}

export function calculateSGPA(subjects: SubjectCreditGrade[]): number {
  if (!subjects.length) return 0;
  const totalCredits = subjects.reduce((sum, s) => sum + s.credit, 0);
  if (totalCredits === 0) return 0;

  const totalPoints = subjects.reduce((sum, s) => sum + s.credit * s.gradePoint, 0);
  return Number((totalPoints / totalCredits).toFixed(2));
}

export function calculateCGPA(semestersSGPA: { sgpa: number; totalCredits: number }[]): number {
  if (!semestersSGPA.length) return 0;
  const totalCredits = semestersSGPA.reduce((sum, s) => sum + s.totalCredits, 0);
  if (totalCredits === 0) return 0;

  const totalPoints = semestersSGPA.reduce((sum, s) => sum + s.sgpa * s.totalCredits, 0);
  return Number((totalPoints / totalCredits).toFixed(2));
}

export function cgpaToPercentage(cgpa: number): number {
  // BEU Formula: (CGPA - 0.75) * 10 or CGPA * 9.5
  return Number(((cgpa - 0.75) * 10).toFixed(2));
}
