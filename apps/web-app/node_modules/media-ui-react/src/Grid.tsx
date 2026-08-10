import React from 'react';
import { useGrid } from './useGrid';
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
export function Grid<T extends UiMediaItem = UiMediaItem>({
  items,
  renderItem,
  hasNextPage,
  isLoadingMore,
  onLoadMore,
  loadingIndicator = null,
  keyExtractor = (item) => item.id,
  className,
  style,
}: GridProps<T>) {
  const { getContainerProps, sentinelRef } = useGrid({ hasNextPage, isLoadingMore, onLoadMore });

  return (
    <div {...getContainerProps()} className={className} style={style}>
      {items.map((item, index) => (
        <React.Fragment key={keyExtractor(item)}>{renderItem(item, index)}</React.Fragment>
      ))}
      {hasNextPage && <div ref={sentinelRef} aria-hidden="true" />}
      {isLoadingMore && loadingIndicator}
    </div>
  );
}
