import React from 'react';
import type { UiMediaItem } from './types';
export interface GridProps<T extends UiMediaItem = UiMediaItem> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    hasNextPage: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
    /** Rendered while isLoadingMore is true. Consumer supplies markup — no default spinner styling. */
    loadingIndicator?: React.ReactNode;
    keyExtractor?: (item: T) => string;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Headless grid: no grid-template-columns, no gap, no visual styling at all.
 * Pass `className`/`style` to control layout — this component only supplies
 * infinite-scroll behavior via the sentinel element.
 */
export declare function Grid<T extends UiMediaItem = UiMediaItem>({ items, renderItem, hasNextPage, isLoadingMore, onLoadMore, loadingIndicator, keyExtractor, className, style, }: GridProps<T>): React.JSX.Element;
