export class LocalCacheWithTTL {
  static set(key: string, data: any, ttlSeconds: number): void {
    const item = {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    };
    localStorage.setItem('cache_' + key, JSON.stringify(item));
  }

  static get<T>(key: string): T | null {
    const raw = localStorage.getItem('cache_' + key);
    if (!raw) return null;
    try {
      const item = JSON.parse(raw);
      if (Date.now() > item.expiresAt) {
        localStorage.removeItem('cache_' + key);
        return null;
      }
      return item.data as T;
    } catch {
      return null;
    }
  }
}
