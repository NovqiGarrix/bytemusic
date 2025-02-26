"use client";

import type { Music } from "@/api/music.api";
import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";

interface AudioContextType {
    currentMusic: Music | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    setCurrentMusic: (music: Music | null) => void;
    togglePlayPause: () => void;
    seek: (time: number) => void;
    seekByPercentage: (percentage: number) => void;
    isNavigating: boolean;
    setIsNavigating: (value: boolean) => void;
    isLoading: boolean;
    isViewTransition: boolean;
    setIsViewTransition: (value: boolean) => void;
    debug: Record<string, any>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Create a single shared audio element outside component lifecycle
let sharedAudioElement: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
    sharedAudioElement = new Audio();
}

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [currentMusic, setCurrentMusicState] = useState<Music | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isViewTransition, setIsViewTransition] = useState(false);

    // Debug state to help troubleshoot
    const [debug, setDebug] = useState<Record<string, any>>({});

    // Use the shared audio element
    const audioRef = useRef<HTMLAudioElement | null>(sharedAudioElement);
    const playPromiseRef = useRef<Promise<void> | null>(null);
    const currentMusicIdRef = useRef<string | null>(null);
    const lastPositionRef = useRef<number>(0);

    // Update debug info
    const updateDebug = useCallback((info: Record<string, any>) => {
        setDebug(prev => ({ ...prev, ...info }));
    }, []);

    // Initialize audio event listeners once
    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        // Store time updates for smooth transitions
        const handleTimeUpdate = () => {
            if (audio) {
                setCurrentTime(audio.currentTime);
                lastPositionRef.current = audio.currentTime;
            }
        };

        const handleMetadata = () => {
            if (audio) {
                setDuration(audio.duration);
                setIsLoading(false);
                updateDebug({ event: "metadata_loaded", duration: audio.duration });
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            lastPositionRef.current = 0;
        };

        const handleCanPlay = () => {
            setIsLoading(false);
            updateDebug({ event: "can_play", src: audio.src });
        };

        const handleError = (e: Event) => {
            const error = (e.target as HTMLMediaElement).error;
            updateDebug({ event: "error", code: error?.code, message: error?.message });
            setIsLoading(false);

            // Only update UI if it's not a transition-related error
            if (!isNavigating && !isViewTransition) {
                setIsPlaying(false);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
        };
    }, [isNavigating, isViewTransition, updateDebug]);

    // Handle setting current music with transition awareness
    const setCurrentMusic = useCallback((music: Music | null) => {
        const audio = audioRef.current;

        if (!music || !audio) {
            setCurrentMusicState(null);
            currentMusicIdRef.current = null;
            return;
        }

        updateDebug({
            action: "set_music",
            id: music.id,
            isViewTransition,
            currentId: currentMusicIdRef.current,
            isSameMusic: music.id === currentMusicIdRef.current
        });

        // Skip audio reloading during transitions between mini and full player
        const isSameMusic = music.id === currentMusicIdRef.current;

        if (isViewTransition && isSameMusic) {
            // Just update state without touching audio
            setCurrentMusicState(music);
            return;
        }

        // Preserve playback state
        const wasPlaying = isPlaying;
        const currentTimeValue = lastPositionRef.current;
        setIsLoading(true);

        // Different music - need to update audio source
        if (!isSameMusic) {
            // Cancel any pending play operations
            if (playPromiseRef.current) {
                playPromiseRef.current.catch(() => { });
                playPromiseRef.current = null;
            }

            // Set new audio source
            audio.pause();
            audio.src = music.streamUri;
            audio.load();
            currentMusicIdRef.current = music.id;
            lastPositionRef.current = 0;
            setCurrentTime(0);
        }
        else if (isViewTransition) {
            // Same music during view transition - maintain position
            try {
                if (currentTimeValue > 0) {
                    audio.currentTime = currentTimeValue;
                }
            } catch (err) {
                console.warn("Couldn't restore position during transition:", err);
            }
        }

        setCurrentMusicState(music);

        // Resume playing if needed after a brief delay to allow transition
        if (wasPlaying && !isNavigating) {
            setTimeout(() => {
                safePlay();
            }, 50);
        }
    }, [isPlaying, isNavigating, isViewTransition, updateDebug]);

    // Safe play function that handles promise rejection gracefully
    const safePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || isNavigating) return;

        try {
            updateDebug({ action: "play_attempt" });
            setIsLoading(true);

            // Store the play promise so we can manage it
            playPromiseRef.current = audio.play();
            playPromiseRef.current
                .then(() => {
                    updateDebug({ action: "play_success" });
                    playPromiseRef.current = null;
                    setIsPlaying(true);
                    setIsLoading(false);
                })
                .catch(err => {
                    updateDebug({ action: "play_error", error: err.message });
                    playPromiseRef.current = null;

                    // Ignore expected errors during transitions
                    if ((err.name === 'AbortError' || err.name === 'NotAllowedError') &&
                        (isNavigating || isViewTransition)) {
                        return;
                    }

                    setIsPlaying(false);
                    setIsLoading(false);
                });
        } catch (err) {
            updateDebug({ action: "play_exception", error: String(err) });
            setIsPlaying(false);
            setIsLoading(false);
        }
    }, [isNavigating, isViewTransition, updateDebug]);

    // Handle toggling play/pause with detailed logic
    const togglePlayPause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || !currentMusic?.id) return;

        updateDebug({
            action: "toggle_play",
            currentState: isPlaying,
            isNavigating,
            hasPromise: !!playPromiseRef.current
        });

        if (isPlaying) {
            // If we have a pending play promise, wait for it before pausing
            if (playPromiseRef.current) {
                playPromiseRef.current
                    .then(() => {
                        if (audio) audio.pause();
                        setIsPlaying(false);
                    })
                    .catch(() => {
                        setIsPlaying(false);
                    });
            } else {
                audio.pause();
                setIsPlaying(false);
            }
        } else {
            setIsPlaying(true);
            safePlay();
        }
    }, [isPlaying, currentMusic?.id, isNavigating, safePlay, updateDebug]);

    // Ensure play state matches the isPlaying flag
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || isNavigating || !currentMusic) return;

        if (isPlaying && audio.paused) {
            safePlay();
        } else if (!isPlaying && !audio.paused && !isLoading) {
            audio.pause();
        }
    }, [isPlaying, isNavigating, currentMusic, isLoading, safePlay]);

    // Handle seeking
    const seek = useCallback((time: number) => {
        const audio = audioRef.current;
        if (!audio || isNavigating) return;

        try {
            audio.currentTime = time;
            setCurrentTime(time);
            lastPositionRef.current = time;
            updateDebug({ action: "seek", time });
        } catch (err) {
            updateDebug({ action: "seek_error", error: String(err) });
        }
    }, [isNavigating, updateDebug]);

    const seekByPercentage = useCallback((percentage: number) => {
        if (audioRef.current && duration > 0) {
            const seekTime = (percentage / 100) * duration;
            seek(seekTime);
        }
    }, [duration, seek]);

    // Cleanup on navigation
    useEffect(() => {
        if (isNavigating) {
            // Just mark as not playing during navigation
            if (playPromiseRef.current) {
                playPromiseRef.current.catch(() => { });
            }

            // Save current position for restoration
            if (audioRef.current) {
                lastPositionRef.current = audioRef.current.currentTime;
            }

            updateDebug({ action: "navigation_start", savedTime: lastPositionRef.current });
        }
    }, [isNavigating, updateDebug]);

    // Reset transition flag after delay
    useEffect(() => {
        if (isViewTransition) {
            updateDebug({ action: "view_transition_start" });

            const timer = setTimeout(() => {
                setIsViewTransition(false);
                updateDebug({ action: "view_transition_end" });
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isViewTransition, updateDebug]);

    return (
        <AudioContext.Provider
            value={{
                currentMusic,
                isPlaying,
                currentTime,
                duration,
                audioRef,
                setCurrentMusic,
                togglePlayPause,
                seek,
                seekByPercentage,
                isNavigating,
                setIsNavigating,
                isLoading,
                isViewTransition,
                setIsViewTransition,
                debug,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
};
