/**
 * Tiny in-memory cache with a time-to-live, plus request de-duplication
 * (so two components asking for the same page at the same time only
 * trigger one network call).
 */
export class InMemoryCache {
    constructor(ttlMs) {
        this.ttlMs = ttlMs;
        this.store = new Map();
        this.inFlight = new Map();
    }
    get(key) {
        const entry = this.store.get(key);
        if (!entry)
            return undefined;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return undefined;
        }
        return entry.value;
    }
    set(key, value) {
        this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
    }
    /**
     * Wraps a fetcher function: returns cached value if fresh, otherwise
     * de-dupes concurrent calls for the same key and caches the result.
     */
    async wrap(key, fetcher) {
        const cached = this.get(key);
        if (cached !== undefined)
            return cached;
        const pending = this.inFlight.get(key);
        if (pending)
            return pending;
        const promise = fetcher()
            .then((result) => {
            this.set(key, result);
            this.inFlight.delete(key);
            return result;
        })
            .catch((err) => {
            this.inFlight.delete(key);
            throw err;
        });
        this.inFlight.set(key, promise);
        return promise;
    }
}
