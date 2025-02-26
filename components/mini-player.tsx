"use client";

import { useAudio } from "@/contexts/audio-context";
import { Loader2, PauseIcon, PlayIcon, SkipForwardIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function MiniPlayer() {
    const {
        currentMusic,
        isPlaying,
        togglePlayPause,
        currentTime,
        duration,
        seekByPercentage,
        isNavigating,
        setIsNavigating,
        isLoading,
        setIsViewTransition
    } = useAudio();
    const pathname = usePathname();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    // Handle visibility state
    useEffect(() => {
        // Always hide immediately when navigating to music page
        if (pathname.startsWith('/musics/') || isNavigating) {
            setIsVisible(false);
            return;
        }

        // Only show when on other pages and we have music
        if (currentMusic && !isNavigating) {
            // Add delay to prevent flashing during navigation
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [currentMusic, pathname, isNavigating]);

    // Navigate to full player with transition
    const handleNavigateToPlayer = (e: React.MouseEvent) => {
        e.preventDefault();

        if (currentMusic) {
            // Explicitly mark this as a view transition to prevent audio reload
            setIsViewTransition(true);

            // Mark as navigating to prevent mini-player from appearing
            setIsNavigating(true);

            // Hide mini player immediately
            setIsVisible(false);

            // Navigate to music detail page
            router.push(`/musics/${currentMusic.id}`);
        }
    };

    // Calculate progress percentage
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    className="fixed bottom-0 left-0 right-0 bg-card shadow-lg z-50"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%", transition: { duration: 0.2 } }}
                    transition={{
                        type: "spring",
                        bounce: 0.1,
                        duration: 0.4
                    }}
                >
                    <div className="relative">
                        <Slider
                            value={[progressPercentage]}
                            max={100}
                            step={0.1}
                            onValueChange={(value) => seekByPercentage(value[0])}
                            className="h-1 rounded-none"
                        />
                    </div>
                    <div
                        className="flex items-center py-2 px-4 gap-3 h-[60px]"
                        onClick={handleNavigateToPlayer}
                    >
                        <motion.div
                            className="relative size-12 rounded overflow-hidden flex-shrink-0"
                            layoutId={`thumbnail-${currentMusic?.id}`}
                        >
                            <Image
                                src={currentMusic?.snippet.thumbnails?.standard?.url || "/placeholder-image.jpg"}
                                alt={currentMusic?.snippet.title || "Music"}
                                fill
                                className="object-cover rounded"
                            />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                            <motion.p
                                className="text-sm font-medium truncate"
                                layoutId={`title-${currentMusic?.id}`}
                            >
                                {currentMusic?.snippet.title}
                            </motion.p>
                            <motion.p
                                className="text-xs text-muted-foreground truncate"
                                layoutId={`artist-${currentMusic?.id}`}
                            >
                                {currentMusic?.snippet.channelTitle}
                            </motion.p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-4">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePlayPause();
                                }}
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 flex items-center justify-center"
                                disabled={isLoading}
                            >
                                <motion.div layoutId="play-pause-button">
                                    {isLoading ? (
                                        <Loader2 className="size-5 text-foreground animate-spin" />
                                    ) : isPlaying ? (
                                        <PauseIcon className="size-5 text-foreground" />
                                    ) : (
                                        <PlayIcon className="size-5 text-foreground" />
                                    )}
                                </motion.div>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <SkipForwardIcon className="size-5 fill-accent-foreground" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
