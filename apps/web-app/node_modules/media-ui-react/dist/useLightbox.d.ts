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
export declare function useLightbox({ isOpen, onClose, onNext, onPrev }: UseLightboxOptions): UseLightboxResult;
