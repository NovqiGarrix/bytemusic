"use client";

import type { Music } from "@/api/music.api";
import { audioPreloader } from "@/utils/audio-preloader";
import { useLoadingComplete } from "@/hooks/use-loading-complete";
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
    loadingProgress: number;
    isViewTransition: boolean;
    setIsViewTransition: (value: boolean) => void;
    debug: Record<string, any>;
    // New function to set music and start playing
    setAndPlayMusic: (music: Music | null) => void;
    isUserPaused: boolean;
    switchTrack: (music: Music) => Promise<void>; // New method for smooth track switching
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Create a single shared audio element outside component lifecycle
let sharedAudioElement: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
    sharedAudioElement = new Audio();
    sharedAudioElement.preload = "auto"; // Force preloading
}

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [currentMusic, setCurrentMusicState] = useState<Music | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isViewTransition, setIsViewTransition] = useState(false);

    // Debug state to help troubleshoot
    const [debug, setDebug] = useState<Record<string, any>>({});

    // Use the shared audio element
    const audioRef = useRef<HTMLAudioElement | null>(sharedAudioElement);
    const playPromiseRef = useRef<Promise<void> | null>(null);
    const currentMusicIdRef = useRef<string | null>(null);
    const lastPositionRef = useRef<number>(0);
    const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const userPausedRef = useRef<boolean>(false);

    // Update debug info
    const updateDebug = useCallback((info: Record<string, any>) => {
        setDebug(prev => ({ ...prev, ...info }));
    }, []);

    // Clear loading timeout if exists
    const clearLoadingTimeout = useCallback(() => {
        if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
            loadTimeoutRef.current = null;
        }
    }, []);

    // Use loading complete hook to ensure progress reaches 100%
    useLoadingComplete({
        currentValue: loadingProgress,
        targetValue: 100,
        threshold: 95,
        timeout: 2000,
        onComplete: () => {
            setLoadingProgress(100);
            updateDebug({ action: "loading_complete_forced" });
        }
    });

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
            setLoadingProgress(100);
            clearLoadingTimeout();
            updateDebug({ event: "can_play", src: audio.src });
        };

        const handleError = (e: Event) => {
            const error = (e.target as HTMLMediaElement).error;
            updateDebug({ event: "error", code: error?.code, message: error?.message });
            setIsLoading(false);
            setLoadingProgress(0);
            clearLoadingTimeout();

            // Only update UI if it's not a transition-related error
            if (!isNavigating && !isViewTransition) {
                setIsPlaying(false);
            }
        };

        // Track loading progress
        const handleProgress = () => {
            if (audio && audio.buffered.length > 0 && audio.duration > 0) {
                const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
                const progress = Math.min(100, Math.round((bufferedEnd / audio.duration) * 100));

                // Consider loading complete if we're above 98% to avoid getting stuck
                if (progress >= 98) {
                    setLoadingProgress(100);
                    setIsLoading(false);
                } else {
                    setLoadingProgress(progress);
                }

                updateDebug({
                    event: "progress",
                    value: progress,
                    bufferedEnd,
                    duration: audio.duration,
                    setTo: progress >= 98 ? 100 : progress
                });
            }
        };

        // Add waiting event handler
        const handleWaiting = () => {
            setIsLoading(true);
            updateDebug({ event: "waiting" });
        };

        // Add playing event handler
        const handlePlaying = () => {
            setIsLoading(false);

            // Force loading to be complete after a delay once playing starts
            setTimeout(() => {
                setLoadingProgress(100);
            }, 2000);

            clearLoadingTimeout();
            updateDebug({ event: "playing" });
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('progress', handleProgress);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('playing', handlePlaying);

        // Start a progress timer when loading
        if (isLoading && !progressTimerRef.current) {
            progressTimerRef.current = setInterval(() => {
                // Simulate gradual progress if real progress isn't moving
                if (loadingProgress < 90) {
                    setLoadingProgress(prev => {
                        // Calculate a new progress that increases more slowly as it approaches 90%
                        const increment = Math.max(0.5, (90 - prev) / 10);
                        return Math.min(90, prev + increment);
                    });

                    // Force a progress event check
                    handleProgress();
                }
            }, 300);
        } else if (!isLoading && progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
        }

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('progress', handleProgress);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('playing', handlePlaying);

            // Clean up timer
            if (progressTimerRef.current) {
                clearInterval(progressTimerRef.current);
                progressTimerRef.current = null;
            }
        };
    }, [isNavigating, isViewTransition, updateDebug, clearLoadingTimeout, loadingProgress]);

    // Properly reset audio element when switching tracks
    const resetAudioElement = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Cancel any pending play operations
        if (playPromiseRef.current) {
            playPromiseRef.current.catch(() => { });
            playPromiseRef.current = null;
        }

        // Stop any active playback immediately to prevent audio overlap
        try {
            audio.pause();
            // Reset source to stop any buffering/downloading
            audio.removeAttribute('src');
            audio.load();
        } catch (e) {
            console.warn("Error resetting audio element:", e);
        }
    }, []);

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

        // Different music - need to update audio source
        if (!isSameMusic) {
            // Reset audio element completely to avoid glitches between tracks
            resetAudioElement();

            // Clear any existing loading timeout
            clearLoadingTimeout();

            setIsLoading(true);
            setLoadingProgress(0); // Reset to 0

            // Set a timeout to force loading state to complete if taking too long
            loadTimeoutRef.current = setTimeout(() => {
                setIsLoading(false);
                setLoadingProgress(100); // Force to 100% after timeout
                updateDebug({ action: "loading_timeout_triggered" });
            }, 8000); // 8 second timeout

            // Try to use preloaded audio if available
            const preloaded = audioPreloader.getPreloaded(music.streamUri);
            if (preloaded) {
                // Use the preloaded audio element
                if (sharedAudioElement !== preloaded) {
                    // Release previous shared audio element if different
                    if (sharedAudioElement) {
                        sharedAudioElement.pause();
                        sharedAudioElement.src = '';
                    }

                    // Replace the shared audio element
                    sharedAudioElement = preloaded;
                    audioRef.current = preloaded;

                    // Start at 50% progress since we already preloaded
                    setLoadingProgress(50);
                    updateDebug({ action: "using_preloaded_audio", progress: 50 });
                }
            } else {
                // Set new audio source
                audio.pause();
                audio.src = music.streamUri;
                audio.load();

                // Start at 5% to show immediate feedback
                setLoadingProgress(5);
                updateDebug({ action: "loading_new_audio", progress: 5 });
            }

            currentMusicIdRef.current = music.id;
            lastPositionRef.current = 0;
            setCurrentTime(0);

            // Start preloading next track if available
            if (music?.nextTrackUri) {
                audioPreloader.preload(music.nextTrackUri)
                    .catch(err => updateDebug({ action: "preload_error", error: err.message }));
            }
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
    }, [isPlaying, isNavigating, isViewTransition, updateDebug, clearLoadingTimeout, resetAudioElement]);

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

                    // If we're able to play, and buffered significantly, consider loading done
                    if (audio.buffered.length > 0 && audio.duration > 0) {
                        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
                        const progress = (bufferedEnd / audio.duration) * 100;
                        if (progress > 50) {
                            setIsLoading(false);
                            // Force progress to 100% after a delay if playback starts successfully
                            setTimeout(() => {
                                setLoadingProgress(100);
                            }, 1500);
                        }
                    }
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
            // Mark this as a user-initiated pause
            userPausedRef.current = true;

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
            // User is playing, clear the paused flag
            userPausedRef.current = false;
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

    // Handle keyboard shortcuts for playback control
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Skip if we're in an input, textarea, or contentEditable element
            if (
                e.target instanceof HTMLElement &&
                (e.target.tagName === 'INPUT' ||
                    e.target.tagName === 'TEXTAREA' ||
                    e.target.isContentEditable)
            ) {
                return;
            }

            // Space key toggles play/pause
            if (e.code === 'Space' && currentMusic) {
                e.preventDefault(); // Prevent page scrolling
                togglePlayPause();
                updateDebug({ action: "keyboard_shortcut", key: "Space" });
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentMusic, togglePlayPause, updateDebug]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            clearLoadingTimeout();

            // Also clear any progress timers that might be running
            if (progressTimerRef.current) {
                clearInterval(progressTimerRef.current);
                progressTimerRef.current = null;
            }

            audioPreloader.clearCache();
        };
    }, [clearLoadingTimeout]);

    // New function to set music and start playing in one step
    const setAndPlayMusic = useCallback((music: Music | null) => {
        setCurrentMusic(music);

        if (music && !isPlaying) {
            // Short timeout to ensure music is set before playing
            setTimeout(() => {
                setIsPlaying(true);
                safePlay();
            }, 50);
        }
    }, [isPlaying, setCurrentMusic, safePlay]);

    // Add new method for smooth track switching
    const switchTrack = useCallback(async (music: Music): Promise<void> => {
        // Release any previous playing audio and preloaded tracks to avoid memory issues
        if (currentMusic?.streamUri) {
            audioPreloader.releaseAudio(currentMusic.streamUri);
        }

        // Reset audio element to stop any ongoing playback
        resetAudioElement();

        // Mark that we're loading a new track
        setIsLoading(true);
        setLoadingProgress(0);

        try {
            // Preload the new track immediately to minimize delay
            await audioPreloader.preload(music.streamUri);

            // Now set the music with the preloaded track
            setCurrentMusic(music);

            // Start playing automatically after a short delay
            setTimeout(() => {
                setIsPlaying(true);
                safePlay();
                userPausedRef.current = false;
            }, 50);
        } catch (error) {
            console.error("Error switching tracks:", error);
            // Fallback to regular loading if preload fails
            setCurrentMusic(music);
        }

        return Promise.resolve();
    }, [currentMusic, resetAudioElement, setCurrentMusic, safePlay]);

    const isUserPaused = userPausedRef.current;

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
                loadingProgress,
                isViewTransition,
                setIsViewTransition,
                debug,
                setAndPlayMusic, // Add the new function to the context
                isUserPaused,
                switchTrack, // Add the new method
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
