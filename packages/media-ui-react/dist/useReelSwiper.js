import { useCallback, useEffect, useRef, useState } from 'react';
/**
 * Headless vertical reel/snap-paging behavior. The scroll-snap CSS is the
 * one exception to "no styles" — snap paging is behavior, not appearance,
 * and doesn't function without it. Colors, sizing, and content are entirely
 * up to the consumer.
 */
export function useReelSwiper({ itemCount, initialIndex = 0, onActiveIndexChange }) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const containerNodeRef = useRef(null);
    const itemNodesRef = useRef(new Map());
    const observerRef = useRef(null);
    const setupObserver = useCallback(() => {
        observerRef.current?.disconnect();
        if (!containerNodeRef.current)
            return;
        observerRef.current = new IntersectionObserver((entries) => {
            // Pick the entry with the greatest visible intersection ratio as "active".
            const mostVisible = entries.reduce((best, entry) => (entry.intersectionRatio > (best?.intersectionRatio ?? 0) ? entry : best), entries[0]);
            if (mostVisible?.isIntersecting) {
                const indexAttr = mostVisible.target.dataset.reelIndex;
                if (indexAttr !== undefined) {
                    const index = Number(indexAttr);
                    setActiveIndex(index);
                    onActiveIndexChange?.(index);
                }
            }
        }, { root: containerNodeRef.current, threshold: [0.6] });
        itemNodesRef.current.forEach((node) => observerRef.current?.observe(node));
    }, [onActiveIndexChange]);
    const containerRef = useCallback((node) => {
        containerNodeRef.current = node;
        setupObserver();
    }, [setupObserver]);
    const itemRef = useCallback((index) => (node) => {
        if (node) {
            node.dataset.reelIndex = String(index);
            itemNodesRef.current.set(index, node);
            observerRef.current?.observe(node);
        }
        else {
            const existing = itemNodesRef.current.get(index);
            if (existing)
                observerRef.current?.unobserve(existing);
            itemNodesRef.current.delete(index);
        }
    }, []);
    useEffect(() => {
        return () => observerRef.current?.disconnect();
    }, []);
    const scrollToIndex = useCallback((index) => {
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
        getItemProps: (index) => ({
            ref: itemRef(index),
            style: { scrollSnapAlign: 'start', scrollSnapStop: 'always' },
            'data-active': index === activeIndex,
        }),
        scrollToIndex,
    };
}
