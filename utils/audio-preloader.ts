export class AudioPreloader {
    private cache: Map<string, { audio: HTMLAudioElement, promise: Promise<void> }> = new Map();
    private maxCacheSize = 3; // Limit cache to 3 items

    /**
     * Preload an audio track and store it in cache
     */
    preload(uri: string): Promise<void> {
        // Return existing promise if already preloading/preloaded
        if (this.cache.has(uri)) {
            return this.cache.get(uri)!.promise;
        }

        // Create a new audio element for preloading
        const audio = new Audio();
        audio.preload = "auto"; // Force preloading

        // Create a promise that resolves when preloading is done
        const promise = new Promise<void>((resolve, reject) => {
            // Track progress events for debugging
            const onProgress = () => {
                if (audio.buffered.length > 0 && audio.duration > 0) {
                    const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
                    const progress = Math.min(100, Math.round((bufferedEnd / audio.duration) * 100));
                    console.log(`[Preloader] ${uri} progress: ${progress}%`);
                }
            };

            const onCanPlayThrough = () => {
                console.log(`[Preloader] ${uri} canplaythrough fired`);
                audio.removeEventListener('canplaythrough', onCanPlayThrough);
                audio.removeEventListener('error', onError);
                audio.removeEventListener('progress', onProgress);
                resolve();
            };

            const onError = (e: Event) => {
                audio.removeEventListener('canplaythrough', onCanPlayThrough);
                audio.removeEventListener('error', onError);
                audio.removeEventListener('progress', onProgress);
                const error = (e.target as HTMLMediaElement).error;
                reject(new Error(`Failed to preload audio: ${error?.message}`));
            };

            audio.addEventListener('canplaythrough', onCanPlayThrough);
            audio.addEventListener('error', onError);
            audio.addEventListener('progress', onProgress);

            // Set a timeout to resolve anyway after 5 seconds
            // This prevents hanging if canplaythrough doesn't fire
            setTimeout(() => {
                if (audio.readyState >= 3) { // HAVE_FUTURE_DATA or better
                    console.log(`[Preloader] ${uri} resolved by timeout with readyState ${audio.readyState}`);
                    audio.removeEventListener('canplaythrough', onCanPlayThrough);
                    audio.removeEventListener('error', onError);
                    audio.removeEventListener('progress', onProgress);
                    resolve();
                }
            }, 5000);
        });

        // Set source and start loading
        audio.src = uri;
        audio.load();

        // Store in cache
        this.cache.set(uri, { audio, promise });

        // Manage cache size
        this.pruneCache();

        return promise;
    }

    /**
     * Get a preloaded audio element if available
     */
    getPreloaded(uri: string): HTMLAudioElement | null {
        const cached = this.cache.get(uri);
        if (cached) {
            // Remove from cache as it's now being used
            this.cache.delete(uri);
            console.log(`[Preloader] Using preloaded audio for ${uri}`);
            return cached.audio;
        }
        console.log(`[Preloader] No preloaded audio found for ${uri}`);
        return null;
    }

    /**
     * Release a preloaded audio element from the cache
     */
    releaseAudio(uri: string): void {
        const cached = this.cache.get(uri);
        if (cached) {
            // Stop any ongoing loading/buffering
            cached.audio.src = '';
            this.cache.delete(uri);
            console.log(`[Preloader] Released audio for ${uri}`);
        }
    }

    /**
     * Get all preloaded URIs
     */
    getPreloadedUris(): string[] {
        return Array.from(this.cache.keys());
    }

    /**
     * Keep cache size under limit by removing oldest entries
     */
    private pruneCache(): void {
        if (this.cache.size <= this.maxCacheSize) return;

        const keysIterator = this.cache.keys();
        // Remove the oldest entry (first key)
        const oldestKey = keysIterator.next().value;
        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }

    /**
     * Clear the entire preload cache, properly releasing audio elements
     */
    clearCache(): void {
        // Properly release all audio elements
        this.getPreloadedUris().forEach(uri => this.releaseAudio(uri));
        this.cache.clear();
    }
}

// Create singleton instance
export const audioPreloader = new AudioPreloader();
