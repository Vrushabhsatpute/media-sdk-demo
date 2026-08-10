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
export declare function useGrid({ hasNextPage, isLoadingMore, onLoadMore, rootMargin }: UseGridOptions): UseGridResult;
