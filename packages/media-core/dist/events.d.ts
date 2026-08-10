import type { MediaItem } from './types';
/** Every event the SDK can emit, and the payload shape that goes with it. */
export interface MediaEventMap {
    view: {
        item: MediaItem;
        timestamp: number;
    };
    download: {
        item: MediaItem;
        timestamp: number;
    };
}
export type MediaEventName = keyof MediaEventMap;
type Listener<K extends MediaEventName> = (payload: MediaEventMap[K]) => void;
/**
 * Minimal typed pub/sub emitter. No external dependency needed for something
 * this small, and it keeps media-core at zero runtime dependencies.
 */
export declare class MediaEventEmitter {
    private listeners;
    on<K extends MediaEventName>(event: K, listener: Listener<K>): () => void;
    off<K extends MediaEventName>(event: K, listener: Listener<K>): void;
    emit<K extends MediaEventName>(event: K, payload: MediaEventMap[K]): void;
}
/** Default listener that just logs activity — attached automatically by MediaCore. */
export declare function createDefaultLogger(emitter: MediaEventEmitter): () => void;
export {};
