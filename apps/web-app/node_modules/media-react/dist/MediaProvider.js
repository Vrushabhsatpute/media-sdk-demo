import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useRef } from 'react';
import { MediaCore } from 'media-core';
const MediaCoreContext = createContext(null);
/**
 * Wrap your app in this once, near the root. It creates a single MediaCore
 * instance (auth handled here) and shares it via context. No business logic
 * lives here — this is purely wiring.
 */
export function MediaProvider({ config, children }) {
    // useRef ensures MediaCore is instantiated exactly once, even if the
    // config object identity changes on re-render.
    const clientRef = useRef(null);
    if (!clientRef.current) {
        clientRef.current = new MediaCore(config);
    }
    const value = useMemo(() => clientRef.current, []);
    return _jsx(MediaCoreContext.Provider, { value: value, children: children });
}
/** Access the raw MediaCore instance directly, for advanced use cases. */
export function useMediaClient() {
    const client = useContext(MediaCoreContext);
    if (!client) {
        throw new Error('useMediaClient must be used within a <MediaProvider>');
    }
    return client;
}
