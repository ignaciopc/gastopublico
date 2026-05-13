import type { CacheEntry } from './types';

// Module-level store persists across requests in the same Node.js process.
// Resets on cold start / server restart. This is intentional for Phase 1.
const store = new Map<string, CacheEntry<unknown>>();

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function cacheSet<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}

export function cacheInvalidate(key: string): void {
  store.delete(key);
}

export function cacheInvalidateAll(): void {
  store.clear();
}

export function cacheKeys(): string[] {
  return Array.from(store.keys());
}
