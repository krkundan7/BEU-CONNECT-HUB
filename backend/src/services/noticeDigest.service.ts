import { IOfficialNotice } from '../types/noticeTypes';

export class NoticeDigestService {
  static generateWeeklyDigest(notices: IOfficialNotice[], branchCode: string, semester: number): IOfficialNotice[] {
    return notices
      .filter((n) => {
        const matchesBranch = !n.targetBranches || n.targetBranches.length === 0 || n.targetBranches.includes(branchCode);
        const matchesSem = !n.targetSemesters || n.targetSemesters.length === 0 || n.targetSemesters.includes(semester);
        return matchesBranch && matchesSem;
      })
      .slice(0, 10);
  }
}
