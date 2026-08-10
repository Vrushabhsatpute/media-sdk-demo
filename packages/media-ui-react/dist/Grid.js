import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useGrid } from './useGrid';
/**
 * Headless grid: no grid-template-columns, no gap, no visual styling at all.
 * Pass `className`/`style` to control layout — this component only supplies
 * infinite-scroll behavior via the sentinel element.
 */
export function Grid({ items, renderItem, hasNextPage, isLoadingMore, onLoadMore, loadingIndicator = null, keyExtractor = (item) => item.id, className, style, }) {
    const { getContainerProps, sentinelRef } = useGrid({ hasNextPage, isLoadingMore, onLoadMore });
    return (_jsxs("div", { ...getContainerProps(), className: className, style: style, children: [items.map((item, index) => (_jsx(React.Fragment, { children: renderItem(item, index) }, keyExtractor(item)))), hasNextPage && _jsx("div", { ref: sentinelRef, "aria-hidden": "true" }), isLoadingMore && loadingIndicator] }));
}
