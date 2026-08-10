import React, { createContext, useContext, useMemo, useRef } from 'react';
import { MediaCore, type MediaCoreConfig } from 'media-core';

const MediaCoreContext = createContext<MediaCore | null>(null);

export interface MediaProviderProps {
  config: MediaCoreConfig;
  children: React.ReactNode;
}

/**
 * Wrap your app in this once, near the root. It creates a single MediaCore
 * instance (auth handled here) and shares it via context. No business logic
 * lives here — this is purely wiring.
 */
export function MediaProvider({ config, children }: MediaProviderProps) {
  // useRef ensures MediaCore is instantiated exactly once, even if the
  // config object identity changes on re-render.
  const clientRef = useRef<MediaCore | null>(null);
  if (!clientRef.current) {
    clientRef.current = new MediaCore(config);
  }

  const value = useMemo(() => clientRef.current as MediaCore, []);

  return <MediaCoreContext.Provider value={value}>{children}</MediaCoreContext.Provider>;
}

/** Access the raw MediaCore instance directly, for advanced use cases. */
export function useMediaClient(): MediaCore {
  const client = useContext(MediaCoreContext);
  if (!client) {
    throw new Error('useMediaClient must be used within a <MediaProvider>');
  }
  return client;
}
