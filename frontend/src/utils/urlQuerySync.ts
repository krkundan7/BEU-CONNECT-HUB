export function updateQueryParams(params: Record<string, string | number | undefined | null>): void {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  window.history.replaceState({}, '', url.toString());
}
