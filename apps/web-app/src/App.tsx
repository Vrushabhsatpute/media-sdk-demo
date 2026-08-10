import React, { useState } from 'react';
import { useMediaSearch, useMediaTracking } from 'media-react';
import type { MediaItem, MediaType } from 'media-react';
import { Grid, Lightbox, ReelSwiper } from 'media-ui-react';

function frameNumber(index: number, type: MediaType): string {
  return `${String(index + 1).padStart(2, '0')}${type === 'photo' ? 'A' : 'B'}`;
}

interface ReelVideoItemProps {
  item: MediaItem;
  index: number;
  isActive: boolean;
  onDownload: () => void;
}

function ReelVideoItem({ item, index, isActive, onDownload }: ReelVideoItemProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // Autoplay when this item becomes active, pause everything else — and if
  // the browser blocks autoplay for any reason, fail quietly rather than
  // leaving a broken-looking frozen frame.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {
        // Autoplay was blocked (common on some browsers) — the user can
        // still tap to play manually, so this is not an error state.
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video || hasError) return;
    if (video.paused) {
      video.play().catch(() => setHasError(true));
    } else {
      video.pause();
    }
  }

  if (hasError || !item.videoUrl) {
    return (
      <div className="reel-item reel-item-error">
        <img src={item.thumbnailUrl} alt={item.authorName} className="reel-error-poster" />
        <div className="reel-error-message">
          <span className="status-label">Playback failed</span>
          <p>This clip couldn't be played in-browser.</p>
          {item.videoUrl && (
            <a href={item.videoUrl} target="_blank" rel="noreferrer" className="download-btn">
              Open video directly
            </a>
          )}
        </div>
        <div className="reel-meta">
          <div>
            <span className="lightbox-eyebrow">Reel {frameNumber(index, 'video')}</span>
            <span className="lightbox-name">{item.authorName}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reel-item">
      <video
        ref={videoRef}
        src={item.videoUrl}
        poster={item.thumbnailUrl}
        loop
        muted
        playsInline
        controls
        onClick={togglePlay}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        onError={() => setHasError(true)}
      />
      {isPaused && (
        <button className="reel-play-overlay" onClick={togglePlay} aria-label="Play">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}
      <div className="reel-meta">
        <div>
          <span className="lightbox-eyebrow">Reel {frameNumber(index, 'video')}</span>
          <span className="lightbox-name">{item.authorName}</span>
        </div>
        <button className="download-btn" onClick={onDownload}>
          Download
        </button>
      </div>
    </div>
  );
}

export function App() {
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('photo');
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [reelStartIndex, setReelStartIndex] = useState<number | null>(null);

  const { items, isLoading, isLoadingMore, error, hasNextPage, loadMore } = useMediaSearch({
    type: mediaType,
    query,
  });

  const { trackView, trackDownload } = useMediaTracking();

  function handleItemClick(item: MediaItem, index: number) {
    trackView(item);
    if (item.type === 'photo') {
      setLightboxItem(item);
    } else {
      setReelStartIndex(index);
    }
  }

  return (
    <div className="app">
      <div className="grain-overlay" aria-hidden="true" />

      <header className="masthead">
        <div className="masthead-top">
          <h1 className="wordmark">
          Media<span className="wordmark-accent">Exploration</span>
          </h1>
          <p className="tagline">just tell me What are you thinking
          </p>
        </div>

        <div className="controls">
          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13 13L17.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder={`search the ${mediaType === 'photo' ? 'archive' : 'reel'}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            <div className="sprockets" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="sprocket-hole" />
              ))}
            </div>
          </div>

          <div className="aperture-toggle" role="tablist" aria-label="Media type">
            <button
              role="tab"
              aria-selected={mediaType === 'photo'}
              className={mediaType === 'photo' ? 'active' : ''}
              onClick={() => setMediaType('photo')}
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              Photo
            </button>
            <button
              role="tab"
              aria-selected={mediaType === 'video'}
              className={mediaType === 'video' ? 'active' : ''}
              onClick={() => setMediaType('video')}
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="2.5" y="5" width="10.5" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M13.5 8.5L17.2 6.3C17.5 6.1 18 6.3 18 6.7V13.3C18 13.7 17.5 13.9 17.2 13.7L13.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
              Video
            </button>
          </div>
        </div>
      </header>

      <div className="film-strip" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="film-strip-hole" />
        ))}
      </div>

      <main>
        {error && (
          <div className="status-banner error-banner">
            <span className="status-label">Development error</span>
            {error.message}
          </div>
        )}
        {isLoading && (
          <div className="status-banner loading-banner">
            <span className="status-label">Loading</span>
            developing the negatives...
          </div>
        )}

        {!isLoading && items.length === 0 && !error && (
          <div className="empty-state">
            <span className="empty-frame">— / —</span>
            <p>No frames found. Try a different search.</p>
          </div>
        )}

        <Grid
          items={items}
          className="media-grid"
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
          loadingIndicator={
            <div className="status-banner loading-banner load-more-banner">
              <span className="status-label">Loading</span>
              winding to the next reel...
            </div>
          }
          renderItem={(item, index) => (
            <button className="grid-item" onClick={() => handleItemClick(item, index)}>
              <img src={item.thumbnailUrl} alt={item.authorName} loading="lazy" />
              <div className="grid-item-scrim" />
              <span className="frame-number">{frameNumber(index, item.type)}</span>
              {item.type === 'video' && (
                <span className="play-badge">
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M6.5 4.5v11l9-5.5-9-5.5z" />
                  </svg>
                </span>
              )}
              <span className="grid-item-caption">{item.authorName}</span>
            </button>
          )}
        />
      </main>

      {/* Lightbox — used for photos */}
      <Lightbox
        item={lightboxItem}
        isOpen={lightboxItem !== null}
        onClose={() => setLightboxItem(null)}
        className="lightbox-overlay"
        renderContent={(item) => (
          <div className="lightbox-content">
            <img src={item.fullUrl} alt={item.authorName} />
            <div className="lightbox-meta">
              <div>
                <span className="lightbox-eyebrow">Photographer</span>
                <span className="lightbox-name">{item.authorName}</span>
              </div>
              <button
                className="download-btn"
                onClick={() => {
                  trackDownload(item);
                  window.open(item.fullUrl, '_blank');
                }}
              >
                Download print
              </button>
            </div>
          </div>
        )}
      />

      {/* Reel view — used for videos, full-screen vertical swiper */}
      {reelStartIndex !== null && (
        <div className="reel-overlay">
          <button className="reel-close" onClick={() => setReelStartIndex(null)} aria-label="Close">
            ×
          </button>
          <ReelSwiper
            items={items.filter((i) => i.type === 'video')}
            initialIndex={reelStartIndex}
            className="reel-swiper"
            renderItem={(item, index, isActive) => (
              <ReelVideoItem
                key={item.id}
                item={item}
                index={index}
                isActive={isActive}
                onDownload={() => {
                  trackDownload(item);
                  if (item.videoUrl) window.open(item.videoUrl, '_blank');
                }}
              />
            )}
          />
        </div>
      )}
    </div>
  );
}
