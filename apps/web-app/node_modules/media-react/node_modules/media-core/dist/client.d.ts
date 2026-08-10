import { MediaEventEmitter } from './events';
import type { MediaCoreConfig, MediaItem, PagedResult, SearchParams, CuratedParams } from './types';
export declare class MediaApiError extends Error {
    status: number;
    constructor(status: number, message: string);
}
/**
 * Framework-agnostic core SDK for Pexels. No React, no DOM, no RN imports —
 * this file (and everything it imports) must stay portable enough to run in
 * a plain Node script or a CLI tool with zero changes.
 */
export declare class MediaCore {
    private apiKey;
    private baseUrl;
    private videoBaseUrl;
    private cache;
    readonly events: MediaEventEmitter;
    private stopDefaultLogger;
    constructor(config: MediaCoreConfig);
    /** Stops the default console logger. Consumer-added listeners are unaffected. */
    disableDefaultLogger(): void;
    private request;
    searchPhotos(params: SearchParams): Promise<PagedResult<MediaItem>>;
    getCuratedPhotos(params?: CuratedParams): Promise<PagedResult<MediaItem>>;
    searchVideos(params: SearchParams): Promise<PagedResult<MediaItem>>;
    getPopularVideos(params?: CuratedParams): Promise<PagedResult<MediaItem>>;
    getPhotoById(id: string): Promise<MediaItem>;
    getVideoById(id: string): Promise<MediaItem>;
    /** Call when a user views an item — emits the `view` event. */
    trackView(item: MediaItem): void;
    /** Call when a user downloads/saves an item — emits the `download` event. */
    trackDownload(item: MediaItem): void;
}
