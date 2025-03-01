"use client";

import type { Music } from "@/api/music.api";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

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
    switchTrack: (music: Music) => Promise<void>;
    isNavigating: boolean;
    setIsNavigating: (isNavigating: boolean) => void;
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

    // Flag to track user-initiated actions
    const userActionRef = useRef(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Track pending play attempts to avoid race conditions
    const pendingPlayRef = useRef<Promise<void> | null>(null);

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

    // Add keyboard controls for playback
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

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
        }

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [togglePlayPause, currentMusic]);

    // Set up audio event listeners with careful handling
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Focus only on essential events
        const onEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onDurationChange = () => setDuration(audio.duration);
        const onWaiting = () => setIsLoading(true);
        const onCanPlay = () => setIsLoading(false);
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
    }, [togglePlayPause]);

    // Improved setCurrentMusic with reliable loading
    const setCurrentMusic = useCallback((music: Music | null) => {
        const audio = audioRef.current;
        if (!audio) return;

        // Always pause first and reset state
        userActionRef.current = true;
        audio.pause();
        setIsPlaying(false);

        // Clear any pending play attempts
        pendingPlayRef.current = null;

        setIsLoading(music !== null);
        setLoadingProgress(0);
        setCurrentTime(0);

        if (!music) {
            setCurrentMusicState(null);
            audio.src = '';
            return;
        }

        try {
            // Set new source and load
            audio.src = music.streamUri;
            audio.load();
            setCurrentMusicState(music);
        } catch (error) {
            console.error('Error setting music source:', error);
            setIsLoading(false);
        }
    }, []);

    // Improved switchTrack with better error handling
    const switchTrack = useCallback(async (music: Music) => {
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

            // Ensure the audio is fully loaded before playing
            setIsLoading(true);

            // Add a slight delay to ensure audio source is properly set
            await new Promise(resolve => setTimeout(resolve, 100));

            // Start playback with proper error handling
            userActionRef.current = true;
            const playPromise = audio.play();
            pendingPlayRef.current = playPromise;

            await playPromise;
            // Only update state if this is still the active play request
            if (pendingPlayRef.current === playPromise) {
                setIsPlaying(true);
                pendingPlayRef.current = null;
            }
        } catch (error) {
            // Only handle error if this is still the active play request
            if (pendingPlayRef.current === null || error instanceof DOMException && error.name === "AbortError") {
                console.log("Playback was aborted, likely due to a new track selection");
            } else {
                console.error('Failed to play track:', error);
                setIsPlaying(false);
            }
            pendingPlayRef.current = null;
        } finally {
            setIsLoading(false);
        }
    }, [setCurrentMusic]);

    const seek = useCallback((time: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = time;
        setCurrentTime(time);
    }, []);

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
                setIsNavigating
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
