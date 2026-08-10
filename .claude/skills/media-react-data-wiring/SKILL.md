---
name: media-react-data-wiring
description: Use when writing or editing code that needs to fetch, search, or track Pexels-backed photo/video data using the media-react package (MediaProvider, useMediaSearch, useMediaItem, useMediaEvent, useMediaTracking). Covers provider setup, auth, hook usage, and event tracking. Does not cover visual components — see media-ui-react-components for that.
---

# media-react: Data Wiring

`media-react` is a thin hook layer over `media-core` (the Pexels API client).
It has **zero UI** — it only gives you data, loading/error state, and events.
Pair it with `media-ui-react` components to actually render anything.

## 1. Provider setup (do this once, near the app root)

```tsx
import { MediaProvider } from 'media-react';

<MediaProvider config={{ apiKey: import.meta.env.VITE_PEXELS_API_KEY }}>
  <App />
</MediaProvider>
```

Rules:
- `MediaProvider` must wrap anything that uses the hooks below — the hooks throw a clear error ("must be used within a `<MediaProvider>`") if called outside it.
- The API key comes from an environment variable, never hardcode it in a component.
- Only one `MediaProvider` is needed per app; nesting a second one just creates a second, independent `MediaCore` instance (rarely what you want).

## 2. Fetching a list: `useMediaSearch`

Use this for any grid, search results view, or curated/popular feed.

```tsx
const { items, isLoading, isLoadingMore, error, hasNextPage, loadMore, refresh } =
  useMediaSearch({ type: 'photo', query: searchText, perPage: 20 });
```

Rules:
- `type` is `'photo'` or `'video'` — never mix both in one call. If you need both, call the hook twice.
- Passing `query: ''` automatically switches to curated/popular results — you don't need a separate branch for "no search yet".
- The hook **debounces internally** (400ms default) and clears stale results on its own when `query`/`type` change. Do NOT add your own debounce or manual `setItems([])` around it — that duplicates logic already handled inside the hook and can reintroduce race conditions.
- Feed `hasNextPage`, `isLoadingMore`, and `loadMore` directly into `<Grid />`'s matching props — don't reimplement pagination state yourself.
- `error` is an `Error | null`. Always render it somewhere (even minimally) — don't swallow it.

## 3. Fetching one item: `useMediaItem`

Use this only when you need full detail for a single known id (e.g. a deep link to one photo). For the Lightbox/Reel flows, you almost always already have the full `MediaItem` object from the grid — pass that directly instead of calling this hook again.

```tsx
const { item, isLoading, error } = useMediaItem(id, 'photo');
```

Pass `id={null}` to skip fetching (e.g. before a selection is made).

## 4. Tracking activity: `useMediaTracking` + `useMediaEvent`

```tsx
const { trackView, trackDownload } = useMediaTracking();

// when a user opens an item:
trackView(item);

// when a user downloads/saves an item:
trackDownload(item);
```

To listen for these events elsewhere (e.g. an analytics panel):

```tsx
useMediaEvent('download', ({ item, timestamp }) => {
  analytics.log('media_download', { id: item.id, timestamp });
});
```

Rules:
- Always call `trackView`/`trackDownload` with the full `MediaItem`, not just an id.
- A default console logger is already attached inside `media-core` — don't add your own `console.log` inside event handlers just to see activity during development; it's already logged.
- `useMediaEvent` auto-unsubscribes on unmount — don't add manual cleanup.

## 5. What NOT to do in this layer

- Don't import anything from `media-ui-react` here — this package is data-only. Wiring the two together happens in the app, not inside a wrapper or a component.
- Don't reach into `useMediaClient()` (the raw `MediaCore` instance) unless none of the above hooks cover your case — most needs are covered by `useMediaSearch`/`useMediaItem`/`useMediaTracking`.
- Don't duplicate pagination, debounce, or caching logic — all three already exist inside `media-core`/`media-react`.
