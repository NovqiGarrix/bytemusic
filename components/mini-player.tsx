"use client";

import { useAudio } from "@/contexts/audio-context";
import { Loader2, PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useParams } from "next/navigation";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

export function MiniPlayer() {
    const {
        currentMusic,
        isPlaying,
        togglePlayPause,
        currentTime,
        duration,
        seekByPercentage,
        isLoading,
        isNavigating,
        setIsNavigating
    } = useAudio();
    const pathname = usePathname();
    const { id } = useParams();
    const router = useRouter();

    const inMusicPage = !!id;
    const showMiniPlayer = !isNavigating && !!currentMusic?.id && !inMusicPage;

    // Add explicit handler for play/pause
    const handlePlayPauseClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            togglePlayPause();
        } catch (error) {
            console.error("Error toggling playback:", error);
        }
    };

    // Handle navigation to music detail
    const handleOpenMusicDetail = () => {
        if (!currentMusic) return;

        // Set navigating state to true to hide player immediately
        setIsNavigating(true);
        router.push(`/musics/${currentMusic?.id}`);
    };

    // Show/hide logic
    useEffect(() => {
        // Always hide on music detail pages
        if (pathname.startsWith('/musics/')) {
            return;
        }

        // Reset navigating state when not on music detail page
        setIsNavigating(false);
    }, [pathname]);

    // Calculate progress percentage
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <AnimatePresence>
            {showMiniPlayer && (
                <motion.div
                    className="fixed bottom-0 left-0 right-0 bg-card shadow-lg z-50"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                >
                    {/* Progress bar */}
                    <Slider
                        value={[progressPercentage]}
                        max={100}
                        step={0.1}
                        onValueChange={(value) => seekByPercentage(value[0])}
                        className="h-1 rounded-none"
                    />

                    {/* Player content */}
                    <div
                        className="flex items-center py-2 px-4 gap-3 h-[60px]"
                        onClick={handleOpenMusicDetail}
                    >
                        {/* Thumbnail */}
                        <div className="relative size-12 rounded overflow-hidden flex-shrink-0">
                            <Image
                                src={currentMusic?.snippet.thumbnails?.standard?.url || "/placeholder.jpg"}
                                alt={currentMusic?.snippet.title || "Music"}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Title/Artist */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {currentMusic?.snippet.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {currentMusic?.snippet.channelTitle}
                            </p>
                        </div>

                        {/* Controls */}
                        <Button
                            onClick={handlePlayPauseClick}
                            variant="ghost"
                            size="icon"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : isPlaying ? (
                                <PauseIcon className="size-5" />
                            ) : (
                                <PlayIcon className="size-5" />
                            )}
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
