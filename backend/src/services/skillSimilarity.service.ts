export class SkillSimilarityService {
  static computeJaccardSimilarity(setA: string[], setB: string[]): number {
    const a = new Set(setA.map((s) => s.toLowerCase()));
    const b = new Set(setB.map((s) => s.toLowerCase()));
    const intersection = new Set([...a].filter((x) => b.has(x)));
    const union = new Set([...a, ...b]);
    if (union.size === 0) return 1.0;
    return Number((intersection.size / union.size).toFixed(2));
  }
}
