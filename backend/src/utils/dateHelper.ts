/**
 * Date and Academic Calendar manipulation utility for BEU semesters
 */
export class DateHelper {
  static formatAcademicYear(year: number): string {
    return `${year}-${(year + 1).toString().slice(-2)}`;
  }

  static isSemesterOdd(semesterNumber: number): boolean {
    return semesterNumber % 2 !== 0;
  }

  static getEstimatedExamWindow(semesterNumber: number, academicYear: number): { startMonth: string; endMonth: string } {
    if (this.isSemesterOdd(semesterNumber)) {
      return { startMonth: `December ${academicYear}`, endMonth: `January ${academicYear + 1}` };
    }
    return { startMonth: `May ${academicYear + 1}`, endMonth: `June ${academicYear + 1}` };
  }
}
