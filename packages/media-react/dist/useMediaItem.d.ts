import type { MediaItem, MediaType } from 'media-core';
export interface UseMediaItemResult {
    item: MediaItem | null;
    isLoading: boolean;
    error: Error | null;
}
/** Fetches a single photo or video by id — used by the Lightbox when it needs full detail. */
export declare function useMediaItem(id: string | null, type: MediaType): UseMediaItemResult;
