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
export declare function useReelSwiper({ itemCount, initialIndex, onActiveIndexChange }: UseReelSwiperOptions): UseReelSwiperResult;
