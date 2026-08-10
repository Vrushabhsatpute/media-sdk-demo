import React from 'react';
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
export declare function Lightbox<T extends UiMediaItem = UiMediaItem>({ item, isOpen, onClose, onNext, onPrev, renderContent, className, style }: LightboxProps<T>): React.JSX.Element | null;
