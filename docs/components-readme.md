# media-ui-react

Headless, pure-UI React components: **Grid**, **Lightbox**, **ReelSwiper**.

This package ships **zero visual styling** and has **no knowledge of Pexels
or media-core** — every component only accepts plain objects shaped like
`{ id, thumbnailUrl, fullUrl, videoUrl?, ... }` (see `UiMediaItem`) plus
callbacks. It could be reused with a completely different data source.

Each component is available two ways:
- A ready-to-use JSX component (`<Grid />`, `<Lightbox />`, `<ReelSwiper />`)
- The underlying hook (`useGrid`, `useLightbox`, `useReelSwiper`), returning
  prop-getters for full markup control

## Quick start

```tsx
import { Grid } from 'media-ui-react';

<Grid
  items={items}
  hasNextPage={hasNextPage}
  isLoadingMore={isLoadingMore}
  onLoadMore={loadMore}
  className="my-grid-css"
  renderItem={(item) => <img src={item.thumbnailUrl} alt="" />}
/>;
```

Styling, layout, and markup are entirely your responsibility — see each
component's page in the sidebar for what behavior is handled for you
(keyboard nav, focus, scroll-snap, infinite scroll) versus what you supply.

Pair this with the [SDK docs](../sdk/) — `media-core` + `media-react` — for
data fetching that plugs directly into these components' props.
