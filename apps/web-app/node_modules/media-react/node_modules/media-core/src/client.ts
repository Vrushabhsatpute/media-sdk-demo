import { MediaEventEmitter, createDefaultLogger } from './events';
import { InMemoryCache } from './cache';
import type {
  MediaCoreConfig,
  MediaItem,
  PagedResult,
  SearchParams,
  CuratedParams,
  PexelsPhoto,
  PexelsVideo,
} from './types';

const DEFAULT_BASE_URL = 'https://api.pexels.com/v1';
const DEFAULT_VIDEO_BASE_URL = 'https://api.pexels.com/videos';
const DEFAULT_CACHE_TTL_MS = 60_000;

export class MediaApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'MediaApiError';
  }
}

function mapPhoto(photo: PexelsPhoto): MediaItem {
  return {
    id: `photo_${photo.id}`,
    type: 'photo',
    width: photo.width,
    height: photo.height,
    thumbnailUrl: photo.src.medium,
    fullUrl: photo.src.large2x,
    authorName: photo.photographer,
    authorUrl: photo.photographer_url,
    sourceUrl: photo.url,
  };
}

function mapVideo(video: PexelsVideo): MediaItem {
  // Pick a directly-playable mp4 file. Some Pexels videos list an HLS
  // stream (.m3u8) first, which a plain <video> tag can't play without
  // extra library support — it fails silently, showing only the poster
  // with no controls. We explicitly prefer real mp4 files over that.
  const mp4Files = video.video_files.filter((f) => f.file_type === 'video/mp4');
  const bestFile =
    mp4Files.find((f) => f.quality === 'hd') ??
    mp4Files.find((f) => f.quality === 'sd') ??
    mp4Files[0] ??
    video.video_files[0];

  return {
    id: `video_${video.id}`,
    type: 'video',
    width: video.width,
    height: video.height,
    thumbnailUrl: video.image,
    fullUrl: video.image,
    videoUrl: bestFile?.link,
    durationSeconds: video.duration,
    authorName: video.user.name,
    authorUrl: video.user.url,
    sourceUrl: video.url,
  };
}

/**
 * Framework-agnostic core SDK for Pexels. No React, no DOM, no RN imports —
 * this file (and everything it imports) must stay portable enough to run in
 * a plain Node script or a CLI tool with zero changes.
 */
export class MediaCore {
  private apiKey: string;
  private baseUrl: string;
  private videoBaseUrl: string;
  private cache: InMemoryCache;

  public readonly events: MediaEventEmitter;
  private stopDefaultLogger: () => void;

  constructor(config: MediaCoreConfig) {
    if (!config.apiKey) {
      throw new Error('MediaCore: apiKey is required');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.videoBaseUrl = config.baseUrl
      ? config.baseUrl.replace('/v1', '/videos')
      : DEFAULT_VIDEO_BASE_URL;
    this.cache = new InMemoryCache(config.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS);

    this.events = new MediaEventEmitter();
    // A default console logger is attached automatically, per the spec.
    // Consumers can still subscribe independently via `.events.on(...)`.
    this.stopDefaultLogger = createDefaultLogger(this.events);
  }

  /** Stops the default console logger. Consumer-added listeners are unaffected. */
  disableDefaultLogger(): void {
    this.stopDefaultLogger();
  }

  private async request<T>(url: string): Promise<T> {
    return this.cache.wrap(url, async () => {
      const response = await fetch(url, {
        headers: { Authorization: this.apiKey },
      });

      if (!response.ok) {
        throw new MediaApiError(response.status, `Pexels request failed: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<T>;
    });
  }

  async searchPhotos(params: SearchParams): Promise<PagedResult<MediaItem>> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 20;
    const url = `${this.baseUrl}/search?query=${encodeURIComponent(params.query)}&page=${page}&per_page=${perPage}`;

    const data = await this.request<{
      photos: PexelsPhoto[];
      page: number;
      per_page: number;
      total_results: number;
      next_page?: string;
    }>(url);

    return {
      items: data.photos.map(mapPhoto),
      page: data.page,
      perPage: data.per_page,
      totalResults: data.total_results,
      hasNextPage: Boolean(data.next_page),
    };
  }

  async getCuratedPhotos(params: CuratedParams = {}): Promise<PagedResult<MediaItem>> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 20;
    const url = `${this.baseUrl}/curated?page=${page}&per_page=${perPage}`;

    const data = await this.request<{
      photos: PexelsPhoto[];
      page: number;
      per_page: number;
      next_page?: string;
    }>(url);

    return {
      items: data.photos.map(mapPhoto),
      page: data.page,
      perPage: data.per_page,
      hasNextPage: Boolean(data.next_page),
    };
  }

  async searchVideos(params: SearchParams): Promise<PagedResult<MediaItem>> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 20;
    const url = `${this.videoBaseUrl}/search?query=${encodeURIComponent(params.query)}&page=${page}&per_page=${perPage}`;

    const data = await this.request<{
      videos: PexelsVideo[];
      page: number;
      per_page: number;
      total_results: number;
      next_page?: string;
    }>(url);

    return {
      items: data.videos.map(mapVideo),
      page: data.page,
      perPage: data.per_page,
      totalResults: data.total_results,
      hasNextPage: Boolean(data.next_page),
    };
  }

  async getPopularVideos(params: CuratedParams = {}): Promise<PagedResult<MediaItem>> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 20;
    const url = `${this.videoBaseUrl}/popular?page=${page}&per_page=${perPage}`;

    const data = await this.request<{
      videos: PexelsVideo[];
      page: number;
      per_page: number;
      next_page?: string;
    }>(url);

    return {
      items: data.videos.map(mapVideo),
      page: data.page,
      perPage: data.per_page,
      hasNextPage: Boolean(data.next_page),
    };
  }

  async getPhotoById(id: string): Promise<MediaItem> {
    const numericId = id.replace('photo_', '');
    const data = await this.request<PexelsPhoto>(`${this.baseUrl}/photos/${numericId}`);
    return mapPhoto(data);
  }

  async getVideoById(id: string): Promise<MediaItem> {
    const numericId = id.replace('video_', '');
    const data = await this.request<PexelsVideo>(`${this.videoBaseUrl}/videos/${numericId}`);
    return mapVideo(data);
  }

  /** Call when a user views an item — emits the `view` event. */
  trackView(item: MediaItem): void {
    this.events.emit('view', { item, timestamp: Date.now() });
  }

  /** Call when a user downloads/saves an item — emits the `download` event. */
  trackDownload(item: MediaItem): void {
    this.events.emit('download', { item, timestamp: Date.now() });
  }
}
