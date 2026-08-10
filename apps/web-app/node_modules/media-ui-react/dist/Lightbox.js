import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLightbox } from './useLightbox';
/**
 * Headless lightbox: no dimming overlay color, no centering styles, no
 * close-button icon. Consumer controls all of that via className/style and
 * renderContent — this only wires keyboard nav, focus, and click-outside.
 */
export function Lightbox({ item, isOpen, onClose, onNext, onPrev, renderContent, className, style }) {
    const { getOverlayProps, getContentProps, getCloseButtonProps } = useLightbox({ isOpen, onClose, onNext, onPrev });
    if (!isOpen || !item)
        return null;
    return (_jsx("div", { ...getOverlayProps(), className: className, style: style, children: _jsxs("div", { ...getContentProps(), children: [renderContent(item), _jsx("button", { ...getCloseButtonProps(), children: "\u00D7" })] }) }));
}
