import { useCallback, useEffect, useRef } from 'react';
/**
 * Headless infinite-scroll logic. No markup, no styles — just observes a
 * sentinel element and calls onLoadMore when it scrolls into view.
 */
export function useGrid({ hasNextPage, isLoadingMore, onLoadMore, rootMargin = '200px' }) {
    const observerRef = useRef(null);
    const onLoadMoreRef = useRef(onLoadMore);
    onLoadMoreRef.current = onLoadMore;
    const sentinelRef = useCallback((node) => {
        observerRef.current?.disconnect();
        if (!node || !hasNextPage || isLoadingMore)
            return;
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) {
                onLoadMoreRef.current();
            }
        }, { rootMargin });
        observerRef.current.observe(node);
    }, [hasNextPage, isLoadingMore, rootMargin]);
    useEffect(() => {
        return () => observerRef.current?.disconnect();
    }, []);
    const getContainerProps = useCallback(() => ({ role: 'grid' }), []);
    return { getContainerProps, sentinelRef };
}
