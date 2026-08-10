/**
 * This package must never import from media-core or media-react.
 * These types describe only the minimal shape a consumer needs to pass in —
 * the components have no idea Pexels or any SDK exists.
 */

/** Minimal shape Grid/Lightbox need for any single media item. */
export interface UiMediaItem {
  id: string;
  thumbnailUrl: string;
  fullUrl: string;
  videoUrl?: string;
  width?: number;
  height?: number;
  alt?: string;
}
