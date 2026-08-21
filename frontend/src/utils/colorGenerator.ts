const BRANCH_COLOR_MAP: Record<string, string> = {
  CSE: 'from-emerald-500 to-teal-600',
  ECE: 'from-indigo-500 to-purple-600',
  EEE: 'from-amber-500 to-orange-600',
  MECH: 'from-red-500 to-rose-600',
  CIVIL: 'from-blue-500 to-cyan-600',
  AIML: 'from-fuchsia-500 to-pink-600',
};

export function getBranchGradient(branchName: string): string {
  for (const [key, gradient] of Object.entries(BRANCH_COLOR_MAP)) {
    if (branchName.toUpperCase().includes(key)) return gradient;
  }
  return 'from-emerald-600 to-teal-700';
}
