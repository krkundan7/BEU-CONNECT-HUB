/**
 * Academic branch code and semester mapper utility
 */
export const BEU_BRANCH_CODES: Record<string, string> = {
  '101': 'Computer Science & Engineering',
  '102': 'Civil Engineering',
  '103': 'Electrical Engineering',
  '104': 'Mechanical Engineering',
  '105': 'Electronics & Communication Engineering',
  '106': 'Information Technology',
  '107': 'AI & Machine Learning',
  '108': 'Cyber Security',
  '109': 'Data Science',
  '110': 'Electrical & Electronics Engineering',
};

export function getBranchNameByCode(code: string): string {
  return BEU_BRANCH_CODES[code] || 'General Engineering';
}
