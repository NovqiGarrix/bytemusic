import { useAudio } from "@/contexts/audio-context";
import { useGetMusic } from "@/hooks/use-get-music";
import { Loader2, PauseIcon, PlayIcon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export function MobilePlayer() {
    const { data: music } = useGetMusic()!;
    const {
        isPlaying,
        currentTime,
        duration,
        togglePlayPause,
        seekByPercentage,
        setCurrentMusic,
        isLoading,
        loadingProgress,
        currentMusic,
        isViewTransition
    } = useAudio();

    // Keep track of initialization
    const hasInitialized = useRef(false);

    // Set current music only once on initial load
    useEffect(() => {
        // Set music if: 
        // 1. We have music data
        // 2. Either we haven't initialized yet OR this is a different music (not a view transition)
        if (music && (!hasInitialized.current || (!isViewTransition && currentMusic?.id !== music.id))) {
            setCurrentMusic(music);
            hasInitialized.current = true;
        }
    }, [music, setCurrentMusic, currentMusic?.id, isViewTransition]);

    // Calculate slider value as a percentage of the current time
    const sliderValue = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Handle slider change for seeking
    const handleSeek = (value: number[]) => {
        seekByPercentage(value[0]);
    };

    return (
        <div className="px-6 py-5">
            <motion.h1
                className="text-2xl font-semibold"
                layoutId={`title-${music?.id}`}
            >
                {music?.snippet.title}
            </motion.h1>
            <motion.h2
                className="mt-1 text-muted-foreground"
                layoutId={`artist-${music?.id}`}
            >
                {music?.snippet.channelTitle}
            </motion.h2>

            {/* Slider */}
            <div className="mt-6 w-full">
                <Slider
                    value={[sliderValue]}
                    max={100}
                    step={0.1}
                    className="w-full"
                    onValueChange={handleSeek}
                    disabled={isLoading}
                />

                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">{formatTime(currentTime)}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(duration)}</p>
                </div>
            </div>

            {/* Player actions */}
            <div className="flex items-center justify-between mt-6">
                <Button variant="ghost" size="icon">
                    <ShuffleIcon className="size-6 stroke-1" />
                </Button>
                <Button variant="ghost" size="icon">
                    <SkipBackIcon className="size-6 fill-accent-foreground" />
                </Button>

                <Button
                    className="rounded-full p-5 bg-accent-foreground size-18"
                    onClick={togglePlayPause}
                    disabled={isLoading && loadingProgress < 10} // Only disable at very beginning of loading
                >
                    <motion.div layoutId="play-pause-button" className="relative">
                        {isLoading && loadingProgress < 80 ? (
                            <div className="relative flex items-center justify-center">
                                <Loader2 className="size-10 stroke-2 text-accent animate-spin" />
                                <span className="absolute text-[8px] font-semibold text-accent">
                                    {Math.round(loadingProgress)}%
                                </span>
                            </div>
                        ) : isPlaying ? (
                            <PauseIcon className="size-8 stroke-0 fill-accent" />
                        ) : (
                            <PlayIcon className="size-8 stroke-0 fill-accent" />
                        )}
                    </motion.div>
                </Button>

                <Button variant="ghost" size="icon">
                    <SkipForwardIcon className="size-6 fill-accent-foreground" />
                </Button>
                <Button variant="ghost" size="icon">
                    <RepeatIcon className="size-6 stroke-1" />
                </Button>
            </div>

            <div className="flex items-center justify-around mt-13">
                <Button variant="ghost" size="icon">
                    Up Next
                </Button>

                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    Lyrics
                </Button>
            </div>
        </div>
    )
}