# Contact Sheet — Headless Media SDK + Component Library

A small headless media SDK ecosystem built around the Pexels API: a
framework-agnostic core, a React wrapper, a pure-UI headless component
library, and a demo web app that wires them together.

## Architecture

```
packages/
├── media-core/       Framework-agnostic Pexels API client. Zero UI, zero React.
├── media-react/       Thin React wrapper (Provider + hooks) around media-core.
└── media-ui-react/    Headless, pure-UI components (Grid, Lightbox, ReelSwiper).
                        Zero knowledge of Pexels or media-core.
apps/
└── web-app/            The only place that imports both media-react (data)
                        and media-ui-react (display) and wires them together.
.claude/skills/
├── media-react-data-wiring/       Teaches an AI coding assistant how to
│                                   correctly use the hooks/provider.
└── media-ui-react-components/     Teaches an AI coding assistant the
                                    headless component pattern.
```

**Dependency direction is enforced strictly:**
`app → media-react → media-core`, and separately `app → media-ui-react`.
`media-react` and `media-ui-react` never import each other. `media-ui-react`
never imports `media-core`. `media-core` imports neither.

## Why it's structured this way

- `media-core` is portable enough to power a CLI tool or a totally different
  UI with zero changes — no React, no DOM.
- `media-ui-react`'s components (Grid, Lightbox, ReelSwiper) are genuinely
  headless: no shipped styles, no knowledge of Pexels. They could be reused
  for a completely different data source tomorrow.
- The app is the only layer allowed to know about both data and display —
  that's where the actual product decisions live.

## Setup

Each package needs to be built once before the app can use it (they're
linked locally via `file:` dependencies in `package.json`).

```bash
cd packages/media-core && npm install && npx tsc
cd ../media-react && npm install && npx tsc
cd ../media-ui-react && npm install && npx tsc
cd ../../apps/web-app && npm install
```

Copy `.env.example` to `.env` in `apps/web-app` and add a free Pexels API
key from https://www.pexels.com/api/:

```
VITE_PEXELS_API_KEY=your_key_here
```

Then run the app:

```bash
cd apps/web-app
npm run dev
```

## What each package does

### `media-core`
- `client.ts` — `MediaCore` class: search/curated photos, search/popular
  videos, single-item fetch, all normalized into a common `MediaItem` shape
- `events.ts` — a small typed pub/sub emitter (`view`, `download` events),
  with a default console logger attached automatically
- `cache.ts` — in-memory response cache + request de-duplication

### `media-react`
- `MediaProvider` — creates a single `MediaCore` instance, shares it via context
- `useMediaSearch` — search/curated fetching with debounce, pagination, and
  race-condition-safe state (clears stale results immediately on query change,
  de-duplicates items across pages)
- `useMediaItem` — fetch a single item by id
- `useMediaEvent` / `useMediaTracking` — subscribe to and fire view/download events

### `media-ui-react`
- `Grid` — infinite-scroll grid via `IntersectionObserver`, no layout CSS shipped
- `Lightbox` — modal viewer with keyboard nav (Escape, arrows), focus
  management, click-outside-to-close
- `ReelSwiper` — vertical snap-paging viewer with active-item detection

All three ship as hooks (`useGrid`, `useLightbox`, `useReelSwiper`) plus a
thin JSX wrapper, following a prop-getter/render-prop pattern so consumers
can drop to the hook directly for full markup control.

### `apps/web-app`
A "Contact Sheet" themed demo: search bar, Photo/Video toggle, an
infinite-scroll contact-sheet grid with a light-leak hover effect and
film-frame numbering, a Lightbox for photos, and a full-screen vertical
Reel viewer for videos with click-to-play/pause and a fallback UI for
videos that fail to play (some Pexels video entries link to HLS streams or
occasionally broken files — the app now selects a real `.mp4` file where
possible and shows a clear "Playback failed" state with a direct link
otherwise, instead of failing silently).

## AI assistance disclosure

This project was built collaboratively with Claude (Anthropic). Roughly:

- **AI-assisted (majority of the code):** all four packages' initial
  implementation, the architecture/dependency-direction setup, the visual
  design system, and iterative bug fixes (a search race condition that let
  stale results linger, an HLS-vs-mp4 video selection bug, a duplicate-key
  bug from overlapping Pexels pagination, a video download button that
  wasn't wired up, and a CSS focus-outline clipping issue).
- **Human-directed:** every fix above was found by manually testing the
  running app, reporting the exact broken behavior with screenshots, and
  reviewing/approving each change before moving on. The visual redesign
  direction ("make it feel like a darkroom/contact sheet, not a generic
  dashboard") was a human creative decision the AI then implemented.
- **The two `SKILL.md` files** in `.claude/skills/` were written by the AI
  based on the actual patterns used while building `App.tsx`, then used to
  build subsequent features (the video UX rework) as a live test of whether
  they steer the AI's output correctly.

The full conversation transcript (including every bug report, fix, and
design iteration) is available as the Claude discussion chat linked in the
submission.

## Known limitations / scoping decisions

- `media-native` (React Native wrapper) and `media-ui-native` were scoped
  out to focus on a fully working, polished web app within the suggested
  time window — the web layer (`media-react` + `media-ui-react`) was built
  with the same contract in mind so a native wrapper could follow the same
  pattern.
- Video quality selection prefers `hd` → `sd` → any `mp4` — no adaptive
  bitrate/streaming support (out of scope for a headless demo SDK).
