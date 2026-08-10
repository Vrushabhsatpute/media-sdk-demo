import React from 'react';
import type { UiMediaItem } from './types';
export interface ReelSwiperProps<T extends UiMediaItem = UiMediaItem> {
    items: T[];
    renderItem: (item: T, index: number, isActive: boolean) => React.ReactNode;
    initialIndex?: number;
    onActiveIndexChange?: (index: number) => void;
    keyExtractor?: (item: T) => string;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Headless vertical reel/swiper. Only scroll-snap behavior is wired in —
 * sizing, spacing, and video/image rendering are entirely up to the
 * consumer via renderItem.
 */
export declare function ReelSwiper<T extends UiMediaItem = UiMediaItem>({ items, renderItem, initialIndex, onActiveIndexChange, keyExtractor, className, style, }: ReelSwiperProps<T>): React.JSX.Element;
