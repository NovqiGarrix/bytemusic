import { PauseIcon, PlayIcon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useGetMusic } from "@/hooks/use-get-music";
import { useEffect, useRef, useState } from "react";

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export function MobilePlayer() {
    const { data: music } = useGetMusic()!;
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Calculate slider value as a percentage of the current time
    const sliderValue = duration > 0 ? (currentTime / duration) * 100 : 0;

    useEffect(() => {
        // Initialize audio element
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

        // Set audio source when music changes
        if (music?.streamUri) {
            audioRef.current.src = music.streamUri;
            audioRef.current.load();
            setCurrentTime(0);
        }

        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('timeupdate', () => { });
                audioRef.current.removeEventListener('loadedmetadata', () => { });
                audioRef.current.removeEventListener('ended', () => { });
            }
        };
    }, [music]);

    // Add keyboard controls
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // Check if space key was pressed and the target is not an input element
            if (event.code === 'Space' || event.key === ' ') {
                const target = event.target as HTMLElement;
                const isInputField = target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable;

                if (!isInputField) {
                    event.preventDefault(); // Prevent page scrolling
                    togglePlayPause();
                }
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleKeyPress);

        // Clean up
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [isPlaying]); // Re-create when isPlaying changes

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle slider change for seeking
    const handleSeek = (value: number[]) => {
        const seekTime = (value[0] / 100) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    return (
        <div className="px-6 py-5">
            <h1 className="text-2xl font-semibold">{music.snippet.title}</h1>
            <h2 className="mt-1 text-muted-foreground">{music.snippet.channelTitle}</h2>

            {/* Slider */}
            <div className="mt-6 w-full">
                <Slider
                    value={[sliderValue]}
                    max={100}
                    step={0.1}
                    className="w-full"
                    onValueChange={handleSeek}
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
                >
                    {isPlaying ? (
                        <PauseIcon className="size-8 stroke-0 fill-accent" />
                    ) : (
                        <PlayIcon className="size-8 stroke-0 fill-accent" />
                    )}
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