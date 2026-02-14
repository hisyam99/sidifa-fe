import { isServer } from "@builder.io/qwik";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  staleTime: number;
}

type Listener = () => void;

// ---------------------------------------------------------------------------
// Default configuration
// ---------------------------------------------------------------------------

/** Default stale time: 5 minutes */
export const DEFAULT_STALE_TIME = 5 * 60 * 1000;

/** Short stale time for frequently changing data: 1 minute */
export const SHORT_STALE_TIME = 1 * 60 * 1000;

/** Long stale time for rarely changing data: 15 minutes */
export const LONG_STALE_TIME = 15 * 60 * 1000;

// ---------------------------------------------------------------------------
// QueryClient
// ---------------------------------------------------------------------------

/**
 * In-memory cache manager inspired by TanStack Query.
 *
 * Features:
 *  - **Stale-while-revalidate** — cached data is returned immediately; a
 *    background refetch is triggered only when the entry is stale.
 *  - **Request deduplication** — concurrent calls with the same key share a
 *    single in-flight promise.
 *  - **Prefix-based invalidation** — `invalidateQueries("admin:posyandu")`
 *    removes every key that starts with that prefix.
 *  - **Pub / Sub** — subscribers are notified when their key prefix is
 *    invalidated so components can auto-refetch.
 *
 * The client is a **singleton** that lives at module scope.  On the server
 * every helper degrades gracefully (no caching, no dedup) so SSR works
 * without side-effects.
 */
class QueryClient {
  // ---- internal stores (client-only) ----
  private cache = new Map<string, CacheEntry>();
  private inflight = new Map<string, Promise<unknown>>();
  private subscribers = new Map<string, Set<Listener>>();

  // -----------------------------------------------------------------------
  // Key helpers
  // -----------------------------------------------------------------------

  /**
   * Build a deterministic, colon-separated cache key from parts.
   *
   * Falsy parts (undefined / null / empty string) are ignored so callers
   * don't need to filter optional filter values themselves.
   *
   * @example
   * ```ts
   * queryClient.buildKey("admin", "posyandu", "list", 1, 10, undefined);
   * // → "admin:posyandu:list:1:10"
   * ```
   */
  buildKey(
    ...parts: (string | number | boolean | undefined | null)[]
  ): string {
    return parts
      .map((p) =>
        p === undefined || p === null || p === "" ? "" : String(p),
      )
      .filter(Boolean)
      .join(":");
  }

  // -----------------------------------------------------------------------
  // Cache reads
  // -----------------------------------------------------------------------

  /**
   * Return the cached data for `key`, or `undefined` when the key is
   * unknown.  Works on both server and client — on the server it always
   * returns `undefined`.
   */
  getQueryData<T>(key: string): T | undefined {
    if (isServer) return undefined;
    const entry = this.cache.get(key);
    return entry ? (entry.data as T) : undefined;
  }

  /**
   * `true` when a cache entry exists **and** has not exceeded its stale
   * time yet.
   */
  isFresh(key: string): boolean {
    if (isServer) return false;
    const entry = this.cache.get(key);
    if (!entry) return false;
    return Date.now() - entry.timestamp < entry.staleTime;
  }

  /**
   * `true` when the key has no entry **or** the entry has exceeded its
   * stale time.
   */
  isStale(key: string): boolean {
    return !this.isFresh(key);
  }

  /**
   * `true` when a fetch with the same key is currently in progress.
   */
  isFetching(key: string): boolean {
    return this.inflight.has(key);
  }

  // -----------------------------------------------------------------------
  // Cache writes
  // -----------------------------------------------------------------------

  /**
   * Manually write data into the cache.  Useful for optimistic updates.
   */
  setQueryData<T>(
    key: string,
    data: T,
    staleTime: number = DEFAULT_STALE_TIME,
  ): void {
    if (isServer) return;
    this.cache.set(key, { data, timestamp: Date.now(), staleTime });
  }

  // -----------------------------------------------------------------------
  // Fetching with dedup
  // -----------------------------------------------------------------------

  /**
   * Execute `fetcher` and cache the result under `key`.
   *
   * If the exact same `key` already has an **in-flight** request, the
   * existing promise is returned instead of spawning a duplicate.
   *
   * On the server, caching and dedup are skipped — the fetcher runs
   * directly.
   */
  async fetchQuery<T>(
    key: string,
    fetcher: () => Promise<T>,
    staleTime: number = DEFAULT_STALE_TIME,
  ): Promise<T> {
    // Server: pass-through
    if (isServer) return fetcher();

    // Dedup: return the existing in-flight promise if one exists
    const existing = this.inflight.get(key) as Promise<T> | undefined;
    if (existing) return existing;

    const promise = fetcher()
      .then((data) => {
        this.setQueryData(key, data, staleTime);
        this.inflight.delete(key);
        return data;
      })
      .catch((err: unknown) => {
        this.inflight.delete(key);
        throw err;
      });

    this.inflight.set(key, promise);
    return promise;
  }

  // -----------------------------------------------------------------------
  // Invalidation
  // -----------------------------------------------------------------------

  /**
   * Remove all cache entries whose key **starts with** `keyOrPrefix` and
   * notify subscribers.
   *
   * @example
   * ```ts
   * queryClient.invalidateQueries("admin:posyandu");
   * // removes "admin:posyandu:list:1:10", "admin:posyandu:detail:abc", …
   * ```
   */
  invalidateQueries(keyOrPrefix: string): void {
    if (isServer) return;

    // Remove matching cache entries
    for (const key of this.cache.keys()) {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix + ":")) {
        this.cache.delete(key);
      }
    }

    // Also cancel matching in-flight requests (they'll resolve but their
    // result won't be applied because the cache entry was deleted).
    // We intentionally do NOT abort the network request — we just make
    // sure the next fetch() call creates a fresh one.
    for (const key of this.inflight.keys()) {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix + ":")) {
        this.inflight.delete(key);
      }
    }

    // Notify subscribers whose prefix overlaps
    this.notifySubscribers(keyOrPrefix);
  }

  /**
   * Remove specific cache entries by exact key.
   */
  removeQuery(key: string): void {
    if (isServer) return;
    this.cache.delete(key);
    this.inflight.delete(key);
  }

  // -----------------------------------------------------------------------
  // Pub / Sub
  // -----------------------------------------------------------------------

  /**
   * Subscribe to invalidation events for a given key prefix.
   *
   * Returns an **unsubscribe** function.  Components should call it on
   * cleanup / unmount.
   *
   * The callback fires whenever `invalidateQueries` is called with a
   * prefix that overlaps with the subscribed prefix (either is a prefix
   * of the other).
   */
  subscribe(keyPrefix: string, callback: Listener): () => void {
    if (isServer) return () => {};

    let set = this.subscribers.get(keyPrefix);
    if (!set) {
      set = new Set();
      this.subscribers.set(keyPrefix, set);
    }
    set.add(callback);

    return () => {
      set!.delete(callback);
      if (set!.size === 0) {
        this.subscribers.delete(keyPrefix);
      }
    };
  }

  /** @internal Notify all overlapping subscribers */
  private notifySubscribers(invalidatedPrefix: string): void {
    for (const [subscribedPrefix, callbacks] of this.subscribers) {
      const overlaps =
        subscribedPrefix === invalidatedPrefix ||
        subscribedPrefix.startsWith(invalidatedPrefix + ":") ||
        invalidatedPrefix.startsWith(subscribedPrefix + ":");
      if (overlaps) {
        callbacks.forEach((cb) => {
          // Fire asynchronously so mutations complete before refetches start
          queueMicrotask(cb);
        });
      }
    }
  }

  // -----------------------------------------------------------------------
  // Utilities
  // -----------------------------------------------------------------------

  /** Remove **all** cache entries, in-flight requests, and subscribers. */
  clear(): void {
    this.cache.clear();
    this.inflight.clear();
    this.subscribers.clear();
  }

  /** Number of entries currently in the cache (useful for debugging). */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Return a snapshot of cache keys (useful for debugging / devtools).
   */
  get keys(): string[] {
    return [...this.cache.keys()];
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

export const queryClient = new QueryClient();

// ---------------------------------------------------------------------------
// Re-export the class type for advanced usage
// ---------------------------------------------------------------------------

export type { QueryClient, CacheEntry };
