import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseReelSwiperOptions {
  itemCount: number;
  initialIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}

export interface UseReelSwiperResult {
  activeIndex: number;
  /** Attach to the scrollable container. Required for snap behavior to function. */
  getContainerProps: () => {
    ref: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
  };
  /** Attach to each item wrapper. `index` must match the item's position in the list. */
  getItemProps: (index: number) => {
    ref: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    'data-active': boolean;
  };
  scrollToIndex: (index: number) => void;
}

/**
 * Headless vertical reel/snap-paging behavior. The scroll-snap CSS is the
 * one exception to "no styles" — snap paging is behavior, not appearance,
 * and doesn't function without it. Colors, sizing, and content are entirely
 * up to the consumer.
 */
export function useReelSwiper({ itemCount, initialIndex = 0, onActiveIndexChange }: UseReelSwiperOptions): UseReelSwiperResult {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerNodeRef = useRef<HTMLElement | null>(null);
  const itemNodesRef = useRef<Map<number, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setupObserver = useCallback(() => {
    observerRef.current?.disconnect();
    if (!containerNodeRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the greatest visible intersection ratio as "active".
        const mostVisible = entries.reduce((best, entry) => (entry.intersectionRatio > (best?.intersectionRatio ?? 0) ? entry : best), entries[0]);

        if (mostVisible?.isIntersecting) {
          const indexAttr = (mostVisible.target as HTMLElement).dataset.reelIndex;
          if (indexAttr !== undefined) {
            const index = Number(indexAttr);
            setActiveIndex(index);
            onActiveIndexChange?.(index);
          }
        }
      },
      { root: containerNodeRef.current, threshold: [0.6] },
    );

    itemNodesRef.current.forEach((node) => observerRef.current?.observe(node));
  }, [onActiveIndexChange]);

  const containerRef = useCallback(
    (node: HTMLElement | null) => {
      containerNodeRef.current = node;
      setupObserver();
    },
    [setupObserver],
  );

  const itemRef = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      if (node) {
        node.dataset.reelIndex = String(index);
        itemNodesRef.current.set(index, node);
        observerRef.current?.observe(node);
      } else {
        const existing = itemNodesRef.current.get(index);
        if (existing) observerRef.current?.unobserve(existing);
        itemNodesRef.current.delete(index);
      }
    },
    [],
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const node = itemNodesRef.current.get(index);
    node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return {
    activeIndex,
    getContainerProps: () => ({
      ref: containerRef,
      style: {
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
      },
    }),
    getItemProps: (index: number) => ({
      ref: itemRef(index),
      style: { scrollSnapAlign: 'start', scrollSnapStop: 'always' },
      'data-active': index === activeIndex,
    }),
    scrollToIndex,
  };
}
