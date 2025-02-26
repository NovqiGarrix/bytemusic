"use client";

import type { Music } from "@/api/music.api";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [currentMusic, setCurrentMusic] = useState<Music | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();

            // Set up audio event listeners
            audioRef.current.addEventListener('timeupdate', () => {
                if (audioRef.current) {
                    setCurrentTime(audioRef.current.currentTime);
                }
            });

            audioRef.current.addEventListener('loadedmetadata', () => {
                if (audioRef.current) {
                    setDuration(audioRef.current.duration);
                }
            });

            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentTime(0);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('timeupdate', () => { });
                audioRef.current.removeEventListener('loadedmetadata', () => { });
                audioRef.current.removeEventListener('ended', () => { });
            }
        };
    }, []);

    // Update audio source when music changes
    useEffect(() => {
        if (currentMusic?.streamUri && audioRef.current) {
            audioRef.current.src = currentMusic.streamUri;
            audioRef.current.load();
            setCurrentTime(0);

            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentMusic]);

    // Handle keyboard controls
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'Space' || event.key === ' ') {
                const target = event.target as HTMLElement;
                const isInputField = target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable;

                if (!isInputField) {
                    event.preventDefault();
                    togglePlayPause();
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [isPlaying]);

    const togglePlayPause = () => {
        if (!audioRef.current || !currentMusic) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const seekByPercentage = (percentage: number) => {
        if (audioRef.current && duration > 0) {
            const seekTime = (percentage / 100) * duration;
            seek(seekTime);
        }
    };

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
