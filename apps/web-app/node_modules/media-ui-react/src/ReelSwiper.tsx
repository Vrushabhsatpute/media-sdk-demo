import React from 'react';
import { useReelSwiper } from './useReelSwiper';
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
export function ReelSwiper<T extends UiMediaItem = UiMediaItem>({
  items,
  renderItem,
  initialIndex = 0,
  onActiveIndexChange,
  keyExtractor = (item) => item.id,
  className,
  style,
}: ReelSwiperProps<T>) {
  const { getContainerProps, getItemProps } = useReelSwiper({
    itemCount: items.length,
    initialIndex,
    onActiveIndexChange,
  });

  const containerProps = getContainerProps();

  return (
    <div
      {...containerProps}
      className={className}
      style={{ ...containerProps.style, ...style }}
    >
      {items.map((item, index) => {
        const itemProps = getItemProps(index);
        return (
          <div key={keyExtractor(item)} {...itemProps}>
            {renderItem(item, index, itemProps['data-active'])}
          </div>
        );
      })}
    </div>
  );
}
