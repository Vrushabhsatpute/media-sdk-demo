import type { MediaEventMap, MediaEventName, MediaItem } from 'media-core';
/**
 * Subscribe to a media-core event (`view` or `download`) for as long as
 * the component is mounted. Auto-unsubscribes on unmount.
 *
 * Example: useMediaEvent('download', ({ item }) => analytics.track(...))
 */
export declare function useMediaEvent<K extends MediaEventName>(event: K, handler: (payload: MediaEventMap[K]) => void): void;
export interface UseMediaTrackingResult {
    trackView: (item: MediaItem) => void;
    trackDownload: (item: MediaItem) => void;
}
/** Convenience hook exposing trackView/trackDownload without reaching into the raw client. */
export declare function useMediaTracking(): UseMediaTrackingResult;
