export class FuzzySearchFallbackService {
  static fuzzyMatch(needle: string, haystack: string): boolean {
    const n = needle.toLowerCase();
    const h = haystack.toLowerCase();
    let i = 0;
    for (let j = 0; j < h.length && i < n.length; j++) {
      if (n[i] === h[j]) i++;
    }
    return i === n.length;
  }
}
