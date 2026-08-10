---
name: media-ui-react-components
description: Use when writing or editing UI code that renders the headless Grid, Lightbox, or ReelSwiper components from media-ui-react. Covers the prop-getter/render-prop pattern, styling responsibilities, accessibility behavior already handled by the components, and how to wire them to data from media-react. Does not cover data fetching — see media-react-data-wiring for that.
---

# media-ui-react: Using the Components

`media-ui-react` ships **zero visual styling**. Every component here handles
behavior only (scroll/pagination, keyboard nav, focus, snap-scrolling) —
you are responsible for all layout, color, spacing, and animation.

This package has **no knowledge of Pexels or media-core** — it only accepts
plain objects shaped like `{ id, thumbnailUrl, fullUrl, videoUrl?, ... }` and
callbacks. Treat it as if it could be reused for a totally different data
source tomorrow.

## Core rule: you always supply markup, the component supplies behavior

None of these components render a default look. If a screen looks unstyled
or invisible after using one of them, that's expected — styling is 100%
your job via `className`/`style` and the render-prop content you provide.

## 1. `Grid` — infinite-scroll list

```tsx
<Grid
  items={items}
  hasNextPage={hasNextPage}
  isLoadingMore={isLoadingMore}
  onLoadMore={loadMore}
  className="my-grid-layout"          // YOU define grid-template-columns, gap, etc.
  loadingIndicator={<Spinner />}       // YOU define what "loading more" looks like
  renderItem={(item, index) => (
    <button onClick={() => openItem(item, index)}>
      <img src={item.thumbnailUrl} alt="" />
    </button>
  )}
/>
```

Rules:
- `Grid` has no default `display: grid` styling — always pass a `className` with your own layout CSS, or it will render as a plain stacked block.
- `renderItem` is the *only* place item markup is defined. Don't try to pass styling props per-item into `Grid` itself.
- Wire `hasNextPage`/`isLoadingMore`/`onLoadMore` straight from `useMediaSearch` — see the data-wiring skill. Don't build your own scroll listener.

## 2. `Lightbox` — modal viewer

```tsx
<Lightbox
  item={selectedItem}
  isOpen={selectedItem !== null}
  onClose={() => setSelectedItem(null)}
  className="my-overlay-styles"        // YOU define the dimming/backdrop look
  renderContent={(item) => (
    <img src={item.fullUrl} alt="" />
  )}
/>
```

Already handled for you — don't reimplement:
- Escape key closes it
- Clicking the backdrop (outside `renderContent`) closes it; clicking inside does not
- Focus moves into the dialog on open and returns to the trigger element on close
- `ArrowLeft`/`ArrowRight` call `onPrev`/`onNext` if you pass them

Rules:
- `Lightbox` returns `null` when `isOpen` is false or `item` is null — you don't need to conditionally render it yourself in the parent.
- Always pass `onClose` — there is no built-in close button in the markup; add your own inside `renderContent` (or use `getCloseButtonProps` via `useLightbox` directly if you need lower-level control).

## 3. `ReelSwiper` — vertical snap-paging viewer (Reels-style)

```tsx
<ReelSwiper
  items={videoItems}
  initialIndex={startIndex}
  onActiveIndexChange={(index) => trackView(videoItems[index])}
  className="h-screen"                 // YOU set the container height
  renderItem={(item, index, isActive) => (
    <video src={item.videoUrl} autoPlay={isActive} muted loop />
  )}
/>
```

Rules:
- The `isActive` flag tells you which item is currently in view — use it to autoplay only the visible video and pause/mute the rest (passing `autoPlay={isActive}` as shown is the expected pattern).
- Scroll-snap CSS (`scrollSnapType`/`scrollSnapAlign`) is injected automatically because paging doesn't function without it — this is the one exception to "no styles." Everything else (sizing, overlays, captions) is yours.
- Don't build a separate `IntersectionObserver` to detect the active video — `onActiveIndexChange` already gives you this.

## 4. Prop-getter pattern (for custom/lower-level usage)

If a component's built-in JSX doesn't fit your markup needs, drop to the
underlying hook (`useGrid`, `useLightbox`, `useReelSwiper`) and spread its
prop-getters onto your own elements:

```tsx
const { getOverlayProps, getContentProps, getCloseButtonProps } = useLightbox({ isOpen, onClose });

<div {...getOverlayProps()} className="...">
  <div {...getContentProps()}>...</div>
  <button {...getCloseButtonProps()}>Close</button>
</div>
```

Always spread the getter's return value onto the element rather than
picking individual fields out of it — the getters bundle refs and handlers
together and may add fields in future versions.

## 5. Accessibility already built in — don't duplicate

- `Grid` container has `role="grid"`
- `Lightbox` overlay has `role="dialog"` and `aria-modal="true"`, and manages focus automatically
- Keyboard handling (Escape, arrows) is wired at the hook level, not just visually

Don't add a second `onKeyDown` for Escape/arrows on top of these — check
whether the behavior you want is already covered before adding new handlers.
