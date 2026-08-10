import { useEffect } from 'react';
import type { MediaEventMap, MediaEventName, MediaItem } from 'media-core';
import { useMediaClient } from './MediaProvider';

/**
 * Subscribe to a media-core event (`view` or `download`) for as long as
 * the component is mounted. Auto-unsubscribes on unmount.
 *
 * Example: useMediaEvent('download', ({ item }) => analytics.track(...))
 */
export function useMediaEvent<K extends MediaEventName>(
  event: K,
  handler: (payload: MediaEventMap[K]) => void,
): void {
  const client = useMediaClient();

  useEffect(() => {
    const unsubscribe = client.events.on(event, handler);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, event]);
}

export interface UseMediaTrackingResult {
  trackView: (item: MediaItem) => void;
  trackDownload: (item: MediaItem) => void;
}

/** Convenience hook exposing trackView/trackDownload without reaching into the raw client. */
export function useMediaTracking(): UseMediaTrackingResult {
  const client = useMediaClient();

  return {
    trackView: (item: MediaItem) => client.trackView(item),
    trackDownload: (item: MediaItem) => client.trackDownload(item),
  };
}
