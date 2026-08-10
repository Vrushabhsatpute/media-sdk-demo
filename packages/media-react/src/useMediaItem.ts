import { useEffect, useState } from 'react';
import type { MediaItem, MediaType } from 'media-core';
import { useMediaClient } from './MediaProvider';

export interface UseMediaItemResult {
  item: MediaItem | null;
  isLoading: boolean;
  error: Error | null;
}

/** Fetches a single photo or video by id — used by the Lightbox when it needs full detail. */
export function useMediaItem(id: string | null, type: MediaType): UseMediaItemResult {
  const client = useMediaClient();
  const [item, setItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setItem(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const fetcher = type === 'photo' ? client.getPhotoById(id) : client.getVideoById(id);

    fetcher
      .then((result) => {
        if (!cancelled) setItem(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed to fetch media item'));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client, id, type]);

  return { item, isLoading, error };
}
