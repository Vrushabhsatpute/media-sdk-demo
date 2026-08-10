import { useEffect } from 'react';
import { useMediaClient } from './MediaProvider';
/**
 * Subscribe to a media-core event (`view` or `download`) for as long as
 * the component is mounted. Auto-unsubscribes on unmount.
 *
 * Example: useMediaEvent('download', ({ item }) => analytics.track(...))
 */
export function useMediaEvent(event, handler) {
    const client = useMediaClient();
    useEffect(() => {
        const unsubscribe = client.events.on(event, handler);
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, event]);
}
/** Convenience hook exposing trackView/trackDownload without reaching into the raw client. */
export function useMediaTracking() {
    const client = useMediaClient();
    return {
        trackView: (item) => client.trackView(item),
        trackDownload: (item) => client.trackDownload(item),
    };
}
