import type { MediaItem, MediaType } from 'media-core';
export interface UseMediaSearchOptions {
    /** 'photo' or 'video' — determines which Pexels endpoint is used */
    type: MediaType;
    /** Search query. Empty string triggers curated/popular results instead. */
    query: string;
    perPage?: number;
    /** Debounce delay (ms) before a query change triggers a fetch. Default 400. */
    debounceMs?: number;
}
export interface UseMediaSearchResult {
    items: MediaItem[];
    isLoading: boolean;
    isLoadingMore: boolean;
    error: Error | null;
    hasNextPage: boolean;
    loadMore: () => void;
    refresh: () => void;
}
/**
 * Handles search + curated/popular fallback + pagination state for a
 * single query. This is the hook the Grid component's consumer will use.
 */
export declare function useMediaSearch({ type, query, perPage, debounceMs }: UseMediaSearchOptions): UseMediaSearchResult;
