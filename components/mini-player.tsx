"use client";

import { useAudio } from "@/contexts/audio-context";
import { Loader2, PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export function MiniPlayer() {
    const {
        currentMusic,
        isPlaying,
        togglePlayPause,
        currentTime,
        duration,
        seekByPercentage,
        isLoading
    } = useAudio();
    const pathname = usePathname();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    // Add explicit handler for play/pause
    const handlePlayPauseClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            togglePlayPause();
        } catch (error) {
            console.error("Error toggling playback:", error);
        }
    };

    // Show/hide logic
    useEffect(() => {
        if (pathname.startsWith('/musics/')) {
            setIsVisible(false);
            return;
        }

        setIsVisible(!!currentMusic);
    }, [currentMusic, pathname]);

    if (!isVisible) return null;

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
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
                onClick={() => router.push(`/musics/${currentMusic?.id}`)}
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
                    onClick={handlePlayPauseClick} // Use the handler
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
    );
}
