import { useCallback, useEffect, useRef, useState } from 'react';
import type { MediaItem, MediaType } from 'media-core';
import { useMediaClient } from './MediaProvider';

export interface UseMediaSearchOptions {
  /** 'photo' or 'video' — determines which Pexels endpoint is used */
  type: MediaType;
  /** Search query. Empty string triggers curated/popular results instead. */
  query: string;
  perPage?: number;
  /** Debounce delay (ms) before a query change triggers a fetch. Default 400. */
  debounceMs?: number;
}

export interface UseMediaSearchResult {
  items: MediaItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasNextPage: boolean;
  loadMore: () => void;
  refresh: () => void;
}

/**
 * Handles search + curated/popular fallback + pagination state for a
 * single query. This is the hook the Grid component's consumer will use.
 */
export function useMediaSearch({ type, query, perPage = 20, debounceMs = 400 }: UseMediaSearchOptions): UseMediaSearchResult {
  const client = useMediaClient();

  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Tracks the query+type this fetch was for, to ignore stale responses
  // (and stale loadMore calls) if the query changes again mid-flight.
  const requestIdRef = useRef(0);
  const activeKeyRef = useRef<string>('');

  const fetchPage = useCallback(
    async (targetPage: number, mode: 'replace' | 'append', key: string) => {
      const requestId = ++requestIdRef.current;
      mode === 'replace' ? setIsLoading(true) : setIsLoadingMore(true);
      setError(null);

      try {
        const result = query.trim()
          ? type === 'photo'
            ? await client.searchPhotos({ query, page: targetPage, perPage })
            : await client.searchVideos({ query, page: targetPage, perPage })
          : type === 'photo'
            ? await client.getCuratedPhotos({ page: targetPage, perPage })
            : await client.getPopularVideos({ page: targetPage, perPage });

        // Ignore this result if a newer request has since been made, or if
        // the query/type changed while this request was in flight.
        if (requestId !== requestIdRef.current || key !== activeKeyRef.current) return;

        setItems((prev) => {
          // De-duplicate by id. Pexels can return overlapping items across
          // pages (especially for curated/popular feeds, or narrow
          // searches with few results), which otherwise causes duplicate
          // React keys — and duplicate keys can make React reuse/misapply
          // a DOM node (like a <video>) across the wrong items.
          const seen = new Set(mode === 'append' ? prev.map((i) => i.id) : []);
          const deduped = result.items.filter((item) => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });

          return mode === 'replace' ? deduped : [...prev, ...deduped];
        });
        setHasNextPage(result.hasNextPage);
        setPage(targetPage);
      } catch (err) {
        if (requestId !== requestIdRef.current || key !== activeKeyRef.current) return;
        setError(err instanceof Error ? err : new Error('Unknown error fetching media'));
      } finally {
        if (requestId !== requestIdRef.current || key !== activeKeyRef.current) return;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [client, type, query, perPage],
  );

  // Re-fetch from page 1 whenever the query or type changes, debounced so
  // typing quickly doesn't fire a request per keystroke.
  useEffect(() => {
    const key = `${type}:${query}`;
    activeKeyRef.current = key;

    // Clear stale results and disable further pagination immediately —
    // this is what prevents old items from lingering while new ones load,
    // and stops any in-flight "load more" from appending onto the old set.
    setItems([]);
    setHasNextPage(false);

    const timer = setTimeout(() => {
      fetchPage(1, 'replace', key);
    }, debounceMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, query, perPage, debounceMs]);

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || !hasNextPage) return;
    fetchPage(page + 1, 'append', activeKeyRef.current);
  }, [fetchPage, page, hasNextPage, isLoading, isLoadingMore]);

  const refresh = useCallback(() => {
    fetchPage(1, 'replace', activeKeyRef.current);
  }, [fetchPage]);

  return { items, isLoading, isLoadingMore, error, hasNextPage, loadMore, refresh };
}
