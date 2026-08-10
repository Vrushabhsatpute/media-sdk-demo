import { useEffect, useState } from 'react';
import { useMediaClient } from './MediaProvider';
/** Fetches a single photo or video by id — used by the Lightbox when it needs full detail. */
export function useMediaItem(id, type) {
    const client = useMediaClient();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!id) {
            setItem(null);
            return;
        }
        let cancelled = false;
        setIsLoading(true);
        setError(null);
        const fetcher = type === 'photo' ? client.getPhotoById(id) : client.getVideoById(id);
        fetcher
            .then((result) => {
            if (!cancelled)
                setItem(result);
        })
            .catch((err) => {
            if (!cancelled)
                setError(err instanceof Error ? err : new Error('Failed to fetch media item'));
        })
            .finally(() => {
            if (!cancelled)
                setIsLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, [client, id, type]);
    return { item, isLoading, error };
}
