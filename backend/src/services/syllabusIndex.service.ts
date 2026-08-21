export class SyllabusIndexService {
  static buildBranchQuickIndex(branches: string[]): Record<string, boolean> {
    const index: Record<string, boolean> = {};
    branches.forEach((b) => { index[b.toLowerCase()] = true; });
    return index;
  }
}
