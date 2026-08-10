/**
 * Types for the Pexels API responses and for this SDK's own config.
 * Kept intentionally close to Pexels' real API shape so mapping stays simple.
 */
export interface PexelsPhotoSrc {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
}
export interface PexelsPhoto {
    id: number;
    width: number;
    height: number;
    url: string;
    photographer: string;
    photographer_url: string;
    avg_color: string | null;
    src: PexelsPhotoSrc;
    alt: string;
}
export interface PexelsVideoFile {
    id: number;
    quality: 'hd' | 'sd' | 'hls' | string;
    file_type: string;
    width: number | null;
    height: number | null;
    link: string;
}
export interface PexelsVideoPicture {
    id: number;
    picture: string;
    nr: number;
}
export interface PexelsVideo {
    id: number;
    width: number;
    height: number;
    url: string;
    image: string;
    duration: number;
    user: {
        id: number;
        name: string;
        url: string;
    };
    video_files: PexelsVideoFile[];
    video_pictures: PexelsVideoPicture[];
}
/** A single normalized media item — photo or video, unified for the UI layer. */
export type MediaType = 'photo' | 'video';
export interface MediaItem {
    id: string;
    type: MediaType;
    width: number;
    height: number;
    thumbnailUrl: string;
    fullUrl: string;
    /** Only present for videos: playable file URL */
    videoUrl?: string;
    durationSeconds?: number;
    authorName: string;
    authorUrl: string;
    sourceUrl: string;
}
export interface SearchParams {
    query: string;
    page?: number;
    perPage?: number;
}
export interface CuratedParams {
    page?: number;
    perPage?: number;
}
export interface PagedResult<T> {
    items: T[];
    page: number;
    perPage: number;
    totalResults?: number;
    hasNextPage: boolean;
}
export interface MediaCoreConfig {
    apiKey: string;
    /** Override for testing; defaults to the real Pexels API */
    baseUrl?: string;
    /** How long (ms) to keep GET responses cached in memory. Default 60s. */
    cacheTtlMs?: number;
}
