import { jsx as _jsx } from "react/jsx-runtime";
import { useReelSwiper } from './useReelSwiper';
/**
 * Headless vertical reel/swiper. Only scroll-snap behavior is wired in —
 * sizing, spacing, and video/image rendering are entirely up to the
 * consumer via renderItem.
 */
export function ReelSwiper({ items, renderItem, initialIndex = 0, onActiveIndexChange, keyExtractor = (item) => item.id, className, style, }) {
    const { getContainerProps, getItemProps } = useReelSwiper({
        itemCount: items.length,
        initialIndex,
        onActiveIndexChange,
    });
    const containerProps = getContainerProps();
    return (_jsx("div", { ...containerProps, className: className, style: { ...containerProps.style, ...style }, children: items.map((item, index) => {
            const itemProps = getItemProps(index);
            return (_jsx("div", { ...itemProps, children: renderItem(item, index, itemProps['data-active']) }, keyExtractor(item)));
        }) }));
}
