"use client";

import { searchVideos, Video } from "@/api/musics.api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { VideoCard } from "./video-card";
import { useAudio } from "@/contexts/audio-context";
import { getMusicByVideoId } from "@/api/music.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
    query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
    const router = useRouter();

    const {
        data: videos,
        isPending,
    } = useQuery({
        queryKey: ['videos', query],
        queryFn: () => searchVideos(query),
    });

    const { setCurrentMusic, setIsNavigating, isPlaying, togglePlayPause } = useAudio();

    async function handleOnClick(video: Video) {
        // Fetch the music based on the video ID
        const music = await getMusicByVideoId(video.id.videoId);
        console.log(music);

        // First mark that we're navigating to prevent mini-player flicker
        setIsNavigating(true);

        // Set the current music before navigation
        setCurrentMusic(music);

        // If not already playing, start playback
        if (!isPlaying) {
            togglePlayPause();
        }

        // Delay the navigation very slightly to ensure state updates
        setTimeout(() => {
            router.push(`/musics/${music.id}`);
        }, 5);
    }

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!videos?.items.length) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-semibold mb-2">No results found</h2>
                <p className="text-muted-foreground">
                    We couldn't find any videos matching "{query}"
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
                Search results for "{query}"
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.items.map((video) => (
                    <button
                        key={video.id.videoId}
                        onClick={() => toast.promise(() => handleOnClick(video), {
                            loading: 'Getting your music...',
                            error: 'Failed to load music',
                            position: 'top-center',
                        })}
                    >
                        <VideoCard
                            key={video.id.videoId}
                            title={video.snippet.title}
                            artist={video.snippet.channelTitle}
                            imageUrl={video.snippet.thumbnails.high.url}
                        />
                    </button>
                ))}
            </div>
        </div >
    );
}
