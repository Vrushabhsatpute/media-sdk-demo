import { useCallback, useEffect, useRef } from 'react';
/**
 * Headless lightbox behavior: Escape closes, ArrowLeft/ArrowRight call
 * onPrev/onNext if provided, clicking the overlay (not the content) closes,
 * and focus moves to the overlay when opened so keyboard events are captured.
 */
export function useLightbox({ isOpen, onClose, onNext, onPrev }) {
    const overlayNodeRef = useRef(null);
    const previouslyFocusedRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            previouslyFocusedRef.current = document.activeElement;
            overlayNodeRef.current?.focus();
        }
        else {
            previouslyFocusedRef.current?.focus();
        }
    }, [isOpen]);
    const overlayRef = useCallback((node) => {
        overlayNodeRef.current = node;
    }, []);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape')
            onClose();
        if (e.key === 'ArrowRight' && onNext)
            onNext();
        if (e.key === 'ArrowLeft' && onPrev)
            onPrev();
    }, [onClose, onNext, onPrev]);
    const handleOverlayClick = useCallback((e) => {
        // Only close if the click was on the overlay itself, not a child
        // (the content box stops propagation separately).
        if (e.target === e.currentTarget)
            onClose();
    }, [onClose]);
    const stopPropagation = useCallback((e) => {
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
