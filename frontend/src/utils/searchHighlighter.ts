export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&');
  const regex = new RegExp('(' + escaped + ')', 'gi');
  return text.replace(regex, '<mark class="bg-emerald-500/30 text-emerald-300 font-semibold px-0.5 rounded">$1</mark>');
}
