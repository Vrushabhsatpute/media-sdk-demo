# Media SDK

Two packages, documented together since `media-react` is a thin wrapper
around `media-core`:

- **media-core** — framework-agnostic Pexels API client. Zero UI, zero
  React. Search/curated photos, search/popular videos, single-item fetch,
  an events system (`view`/`download`), and an in-memory cache.
- **media-react** — a `MediaProvider` + hooks (`useMediaSearch`,
  `useMediaItem`, `useMediaEvent`, `useMediaTracking`) that wrap
  `media-core` for React apps. No business logic beyond what `media-core`
  already provides — this layer is pure wiring.

## Quick start

```tsx
import { MediaProvider } from 'media-react';

<MediaProvider config={{ apiKey: 'your-pexels-key' }}>
  <App />
</MediaProvider>;
```

```tsx
import { useMediaSearch } from 'media-react';

const { items, isLoading, hasNextPage, loadMore } = useMediaSearch({
  type: 'photo',
  query: 'mountains',
});
```

See the sidebar for the full API reference, generated directly from the
source's TypeScript types and doc comments.

Pair this with the [component library docs](../components/) —
`media-ui-react` — for ready-made headless UI (Grid, Lightbox, ReelSwiper)
that consumes exactly this data shape.
