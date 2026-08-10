import { useCallback, useEffect, useRef } from 'react';

export interface UseLightboxOptions {
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export interface UseLightboxResult {
  /** Attach to the outer overlay element. Handles Escape/Arrow keys and click-outside-to-close. */
  getOverlayProps: () => {
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onClick: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    ref: (node: HTMLElement | null) => void;
  };
  /** Attach to the inner content box so clicks inside don't close the lightbox. */
  getContentProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /** Attach to the close button. */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
}

/**
 * Headless lightbox behavior: Escape closes, ArrowLeft/ArrowRight call
 * onPrev/onNext if provided, clicking the overlay (not the content) closes,
 * and focus moves to the overlay when opened so keyboard events are captured.
 */
export function useLightbox({ isOpen, onClose, onNext, onPrev }: UseLightboxOptions): UseLightboxResult {
  const overlayNodeRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      overlayNodeRef.current?.focus();
    } else {
      previouslyFocusedRef.current?.focus();
    }
  }, [isOpen]);

  const overlayRef = useCallback((node: HTMLElement | null) => {
    overlayNodeRef.current = node;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    },
    [onClose, onNext, onPrev],
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      // Only close if the click was on the overlay itself, not a child
      // (the content box stops propagation separately).
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return {
    getOverlayProps: () => ({
      role: 'dialog',
      'aria-modal': true,
      tabIndex: -1,
      onClick: handleOverlayClick,
      onKeyDown: handleKeyDown,
      ref: overlayRef,
    }),
    getContentProps: () => ({
      onClick: stopPropagation,
    }),
    getCloseButtonProps: () => ({
      onClick: onClose,
      'aria-label': 'Close',
    }),
  };
}
