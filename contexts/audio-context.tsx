"use client";

import { getNextTrack, type Music } from "@/api/music.api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface AudioContextType {
    currentMusic: Music | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    isLoading: boolean;
    loadingProgress: number;
    setCurrentMusic: (music: Music | null) => void;
    togglePlayPause: () => void;
    seek: (time: number) => void;
    seekByPercentage: (percentage: number) => void;
    switchTrack: (music: Music) => void;
    isNavigating: boolean;
    setIsNavigating: (isNavigating: boolean) => void;
    playlistId: string | null;
    setPlaylistId: (playlistId: string | null) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    // Core state
    const [currentMusic, setCurrentMusicState] = useState<Music | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isNavigating, setIsNavigating] = useState(false);
    const [playlistId, setPlaylistId] = useState<string | null>(null);

    const router = useRouter();

    // Flag to track user-initiated actions
    const userActionRef = useRef(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Track pending play attempts to avoid race conditions
    const pendingPlayRef = useRef<Promise<void> | null>(null);

    // Get the next track
    const { data: nextTrack } = useQuery({
        queryKey: ['nextTrack', currentMusic?.id],
        queryFn: async () => getNextTrack(currentMusic?.id!),
        enabled: !!currentMusic?.id,
    });

    // Initialize audio element only once
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const audio = new Audio();
        audio.preload = "auto";
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    const togglePlayPause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || !currentMusic) return;

        // Explicitly check audio element's state instead of React state
        if (!audio.paused) {
            // Currently playing, so pause
            audio.pause();
            // Directly update state without waiting for events
            setIsPlaying(false);
        } else {
            // Currently paused, so play
            setIsLoading(true);
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((error) => {
                    console.error("Play error:", error);
                    setIsPlaying(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [currentMusic]);


    const seek = useCallback((time: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = time;
        setCurrentTime(time);
    }, []);

    // Add keyboard controls for playback
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            // Skip if user is typing in an input field or textarea
            if (
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement ||
                document.activeElement?.getAttribute('contenteditable') === 'true' ||
                e.metaKey ||
                e.ctrlKey ||
                e.altKey
            ) {
                return;
            }

            // Space to toggle play/pause
            if (e.code === 'Space' && currentMusic) {
                e.preventDefault(); // Prevent page scroll
                togglePlayPause();
            }

            // Right arrow to forward 10 seconds
            if (e.code === 'ArrowRight' && currentMusic) {
                e.preventDefault();
                const newTime = Math.min(currentTime + 10, duration);
                seek(newTime);
            }

            // Left arrow to rewind 10 seconds
            if (e.code === 'ArrowLeft' && currentMusic) {
                e.preventDefault();
                const newTime = Math.max(currentTime - 10, 0);
                seek(newTime);
            }
        }

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [togglePlayPause, currentMusic, currentTime, duration, seek]);

    // Improved setCurrentMusic with reliable loading
    const setCurrentMusic = useCallback((music: Music | null) => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            // Reset states first
            setIsPlaying(false);
            setIsLoading(music !== null);
            setLoadingProgress(0);
            setCurrentTime(0);

            // Cleanup current audio
            audio.pause();
            audio.currentTime = 0;

            if (!music) {
                setCurrentMusicState(null);
                audio.src = '';
                audio.load();
                return;
            }

            // Update state and set new source
            setCurrentMusicState(music);
            audio.src = music.streamUri;
            audio.load();
        } catch (error) {
            console.error('Error in setCurrentMusic:', error);
            setIsLoading(false);
            setIsPlaying(false);
            toast.error("Failed to load audio");
        }
    }, []);

    // Improved switchTrack with better error handling
    const switchTrack = useCallback((music: Music) => {
        const audio = audioRef.current;
        if (!audio) return;

        // Cancel any existing play attempts to avoid conflicts
        if (pendingPlayRef.current) {
            pendingPlayRef.current = null;
        }

        try {
            // First pause any current playback
            userActionRef.current = true;
            audio.pause();

            // Set new track
            setCurrentMusic(music);
            router.push(`/musics/${music.id}`);
        } catch (error) {
            // Only handle error if this is still the active play request
            if (pendingPlayRef.current === null || error instanceof DOMException && error.name === "AbortError") {
                console.log("Playback was aborted, likely due to a new track selection");
            } else {
                console.error('Failed to play track:', error);
                toast.error("Failed to play track");
                setIsPlaying(false);
            }
            pendingPlayRef.current = null;
        } finally {
            setIsLoading(false);
        }
    }, [setCurrentMusic]);

    // Handle playing next track
    const playNextTrack = useCallback(() => {
        if (!nextTrack) return;

        try {
            const audio = audioRef.current;
            if (!audio) return;

            // Clean up current playback
            audio.pause();
            setIsPlaying(false);
            setCurrentTime(0);

            // Switch to next track
            switchTrack(nextTrack);
        } catch (error) {
            console.error('Error in playNextTrack:', error);
            toast.error("Failed to play next track");
        }
    }, [nextTrack, switchTrack]);

    // Set up audio event listeners with careful handling
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Focus only on essential events
        const onEnded = () => {
            // It's good practice to get the current audio instance from the ref
            // inside the event handler, though `audio` from useEffect's scope is likely fine.
            const currentAudio = audioRef.current;
            if (!currentAudio) return;

            if (nextTrack) {
                // switchTrack calls setCurrentMusic, which handles resetting isPlaying,
                // currentTime, loading the new track. Then onCanPlay handles playing.
                switchTrack(nextTrack);
            } else {
                // No next track, so update UI to reflect that playback has stopped.
                setIsPlaying(false);
                // Reset currentTime to 0 so if the user replays the current track (if possible via other controls)
                // or if another action loads a track, it starts fresh.
                currentAudio.currentTime = 0; // Directly affect the audio element
                setCurrentTime(0);     // Update React state
            }
        };

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onDurationChange = () => setDuration(audio.duration);
        const onWaiting = () => setIsLoading(true);
        const onCanPlay = () => {
            setIsLoading(false);
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch((err) => {
                // This error would throw if we force to play when the user
                // just refresh the music page
                // We can just ignore it, because its browser error
                if (!err.message.startsWith("NotAllowedError")) {
                    // TODO: Setup Sentry
                }
            });
        }
        const onError = () => {
            console.error('Audio error');
            setIsPlaying(false);
            setIsLoading(false);
        };

        // Add event listeners
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('durationchange', onDurationChange);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('error', onError);

        return () => {
            // Remove event listeners
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('durationchange', onDurationChange);
            audio.removeEventListener('waiting', onWaiting);
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('error', onError);
        };
    }, [togglePlayPause, playNextTrack]);

    const seekByPercentage = useCallback((percentage: number) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;
        const time = (percentage / 100) * duration;
        seek(time);
    }, [duration, seek]);

    return (
        <AudioContext.Provider
            value={{
                currentMusic,
                isPlaying,
                currentTime,
                duration,
                isLoading,
                loadingProgress,
                setCurrentMusic,
                togglePlayPause,
                seek,
                seekByPercentage,
                switchTrack,
                isNavigating,
                setIsNavigating,
                playlistId,
                setPlaylistId,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
};
