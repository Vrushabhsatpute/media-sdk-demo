/**
 * Tiny in-memory cache with a time-to-live, plus request de-duplication
 * (so two components asking for the same page at the same time only
 * trigger one network call).
 */
export declare class InMemoryCache {
    private ttlMs;
    private store;
    private inFlight;
    constructor(ttlMs: number);
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T): void;
    /**
     * Wraps a fetcher function: returns cached value if fresh, otherwise
     * de-dupes concurrent calls for the same key and caches the result.
     */
    wrap<T>(key: string, fetcher: () => Promise<T>): Promise<T>;
}
