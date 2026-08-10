import { useCallback, useEffect, useRef } from 'react';

export interface UseGridOptions {
  hasNextPage: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  /** Root margin for the IntersectionObserver — how early to trigger load. Default '200px'. */
  rootMargin?: string;
}

export interface GridContainerProps {
  role: string;
}

export interface UseGridResult {
  /** Attach to the container that wraps all grid items. */
  getContainerProps: () => GridContainerProps;
  /** Attach to a sentinel element placed after the last item — triggers loadMore when visible. */
  sentinelRef: (node: HTMLElement | null) => void;
}

/**
 * Headless infinite-scroll logic. No markup, no styles — just observes a
 * sentinel element and calls onLoadMore when it scrolls into view.
 */
export function useGrid({ hasNextPage, isLoadingMore, onLoadMore, rootMargin = '200px' }: UseGridOptions): UseGridResult {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();

      if (!node || !hasNextPage || isLoadingMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            onLoadMoreRef.current();
          }
        },
        { rootMargin },
      );
      observerRef.current.observe(node);
    },
    [hasNextPage, isLoadingMore, rootMargin],
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const getContainerProps = useCallback((): GridContainerProps => ({ role: 'grid' }), []);

  return { getContainerProps, sentinelRef };
}
