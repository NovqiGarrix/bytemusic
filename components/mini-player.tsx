"use client";

import { useAudio } from "@/contexts/audio-context";
import { PauseIcon, PlayIcon, SkipForwardIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

export function MiniPlayer() {
    const { currentMusic, isPlaying, togglePlayPause, currentTime, duration, seekByPercentage } = useAudio();
    const pathname = usePathname();

    // Don't show mini player on the music detail page
    if (!currentMusic || pathname.startsWith('/musics/')) {
        return null;
    }

    // Calculate progress percentage
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-card shadow-lg z-50 h-16">
            <div className="relative">
                <Slider
                    value={[progressPercentage]}
                    max={100}
                    step={0.1}
                    onValueChange={(value) => seekByPercentage(value[0])}
                    className="h-1 rounded-none"
                />
            </div>
            <Link href={`/musics/${currentMusic.id}`}>
                <div className="flex items-center py-2 px-4 gap-3">
                    <div className="relative size-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                            src={currentMusic.snippet.thumbnails.standard.url || "/placeholder-image.jpg"}
                            alt={currentMusic.snippet.title}
                            fill
                            className="object-cover rounded"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{currentMusic.snippet.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{currentMusic.snippet.channelTitle}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-4">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                togglePlayPause();
                            }}
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 flex items-center justify-center"
                        >
                            {isPlaying ? (
                                <PauseIcon className="size-5 text-foreground" />
                            ) : (
                                <PlayIcon className="size-5 text-foreground" />
                            )}
                        </Button>
                        <Button variant="ghost" size="icon">
                            <SkipForwardIcon className="size-5 fill-accent-foreground" />
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
}
