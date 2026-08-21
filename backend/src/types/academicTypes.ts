export interface IAcademicBranch {
  code: string;
  name: string;
  shortName: string;
  totalSemesters: number;
  isActive: boolean;
}

export interface IAcademicSemester {
  semesterNumber: number;
  branchCode: string;
  subjectsCount: number;
  totalCredits: number;
}
