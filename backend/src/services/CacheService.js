/**
 * In-memory TTL cache with fallback support
 */
export class CacheService {
  constructor(defaultTtlSeconds = 300) {
    this.cache = new Map();
    this.defaultTtlMs = defaultTtlSeconds * 1000;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() > entry.expiresAt;
    if (isExpired) {
      // Keep stale data available in fallback, but mark as expired
      return null;
    }
    return entry.value;
  }

  getStaleFallback(key) {
    const entry = this.cache.get(key);
    return entry ? entry.value : null;
  }

  set(key, value, ttlSeconds) {
    const ttlMs = (ttlSeconds ? ttlSeconds * 1000 : this.defaultTtlMs);
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
      cachedAt: Date.now()
    });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const globalCache = new CacheService(300); // 5 min default
