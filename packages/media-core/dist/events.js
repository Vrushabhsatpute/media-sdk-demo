/**
 * Minimal typed pub/sub emitter. No external dependency needed for something
 * this small, and it keeps media-core at zero runtime dependencies.
 */
export class MediaEventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(event, listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event].add(listener);
        // Returns an unsubscribe function — common ergonomic pattern for
        // consumers (especially React's useEffect cleanup).
        return () => this.off(event, listener);
    }
    off(event, listener) {
        this.listeners[event]?.delete(listener);
    }
    emit(event, payload) {
        this.listeners[event]?.forEach((listener) => listener(payload));
    }
}
/** Default listener that just logs activity — attached automatically by MediaCore. */
export function createDefaultLogger(emitter) {
    const unsubView = emitter.on('view', ({ item, timestamp }) => {
        console.log(`[media-core] view: ${item.type} #${item.id} at ${new Date(timestamp).toISOString()}`);
    });
    const unsubDownload = emitter.on('download', ({ item, timestamp }) => {
        console.log(`[media-core] download: ${item.type} #${item.id} at ${new Date(timestamp).toISOString()}`);
    });
    return () => {
        unsubView();
        unsubDownload();
    };
}
