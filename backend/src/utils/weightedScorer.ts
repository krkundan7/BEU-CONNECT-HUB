/**
 * Weighted relevance scoring helper for search results
 */
export function calculateWeightedRelevance(title: string, content: string, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (title.toLowerCase().includes(q)) score += 10;
  if (title.toLowerCase().startsWith(q)) score += 5;
  if (content.toLowerCase().includes(q)) score += 3;
  return score;
}
