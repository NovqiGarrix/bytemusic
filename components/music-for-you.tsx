import { getMusics } from "@/api/musics.api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { VideoCard } from "./video-card";
import { Music } from "@/api/music.api";
import { useAudio } from "@/contexts/audio-context";
import { useRouter } from "next/navigation";

export function MusicForYou() {
    const router = useRouter();
    const { data: musics } = useSuspenseQuery({
        queryKey: ['musics'],
        queryFn: () => getMusics()
    });

    const { setCurrentMusic, setIsNavigating } = useAudio();

    function handleOnClick(music: Music) {
        // First mark that we're navigating to prevent mini-player flicker
        setIsNavigating(true);

        // Set the current music before navigation
        setCurrentMusic(music);

        // Delay the navigation very slightly to ensure state updates
        setTimeout(() => {
            router.push(`/musics/${music.id}`);
        }, 5);
    }

    return (
        <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Musics for you</h2>
                <Button size="sm" className="hidden sm:flex">Play all</Button>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {musics.map((music) => (
                    <button key={music.id} onClick={() => handleOnClick(music)}>
                        <VideoCard
                            title={music.snippet.title}
                            artist={music.snippet.channelTitle}
                            views="1M views"
                            imageUrl={music.snippet.thumbnails.standard.url}
                        />
                    </button>
                ))}
            </div>
        </section>
    )
}