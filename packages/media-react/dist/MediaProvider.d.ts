import React from 'react';
import { MediaCore, type MediaCoreConfig } from 'media-core';
export interface MediaProviderProps {
    config: MediaCoreConfig;
    children: React.ReactNode;
}
/**
 * Wrap your app in this once, near the root. It creates a single MediaCore
 * instance (auth handled here) and shares it via context. No business logic
 * lives here — this is purely wiring.
 */
export declare function MediaProvider({ config, children }: MediaProviderProps): React.JSX.Element;
/** Access the raw MediaCore instance directly, for advanced use cases. */
export declare function useMediaClient(): MediaCore;
