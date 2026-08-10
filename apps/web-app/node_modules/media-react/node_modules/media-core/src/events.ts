import type { MediaItem } from './types';

/** Every event the SDK can emit, and the payload shape that goes with it. */
export interface MediaEventMap {
  view: { item: MediaItem; timestamp: number };
  download: { item: MediaItem; timestamp: number };
}

export type MediaEventName = keyof MediaEventMap;
type Listener<K extends MediaEventName> = (payload: MediaEventMap[K]) => void;

/**
 * Minimal typed pub/sub emitter. No external dependency needed for something
 * this small, and it keeps media-core at zero runtime dependencies.
 */
export class MediaEventEmitter {
  private listeners: {
    [K in MediaEventName]?: Set<Listener<K>>;
  } = {};

  on<K extends MediaEventName>(event: K, listener: Listener<K>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set() as MediaEventEmitter['listeners'][K];
    }
    (this.listeners[event] as Set<Listener<K>>).add(listener);

    // Returns an unsubscribe function — common ergonomic pattern for
    // consumers (especially React's useEffect cleanup).
    return () => this.off(event, listener);
  }

  off<K extends MediaEventName>(event: K, listener: Listener<K>): void {
    this.listeners[event]?.delete(listener as never);
  }

  emit<K extends MediaEventName>(event: K, payload: MediaEventMap[K]): void {
    this.listeners[event]?.forEach((listener) => listener(payload));
  }
}

/** Default listener that just logs activity — attached automatically by MediaCore. */
export function createDefaultLogger(emitter: MediaEventEmitter): () => void {
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
