import React from 'react';
import { useLightbox } from './useLightbox';
import type { UiMediaItem } from './types';

export interface LightboxProps<T extends UiMediaItem = UiMediaItem> {
  item: T | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  /** Consumer supplies all visual markup — this just wires behavior. */
  renderContent: (item: T) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Headless lightbox: no dimming overlay color, no centering styles, no
 * close-button icon. Consumer controls all of that via className/style and
 * renderContent — this only wires keyboard nav, focus, and click-outside.
 */
export function Lightbox<T extends UiMediaItem = UiMediaItem>({ item, isOpen, onClose, onNext, onPrev, renderContent, className, style }: LightboxProps<T>) {
  const { getOverlayProps, getContentProps, getCloseButtonProps } = useLightbox({ isOpen, onClose, onNext, onPrev });

  if (!isOpen || !item) return null;

  return (
    <div {...getOverlayProps()} className={className} style={style}>
      <div {...getContentProps()}>
        {renderContent(item)}
        <button {...getCloseButtonProps()}>×</button>
      </div>
    </div>
  );
}
