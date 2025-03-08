import { Music } from "@/api/music.api";
import { getMusics } from "@/api/musics.api";
import { useAudio } from "@/contexts/audio-context";
import { useRouter } from '@bprogress/next/app';
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button } from "./ui/button";
import { VideoCard } from "./video-card";

export function MusicForYou() {
    const router = useRouter();
    const { data: musics, fetchNextPage, hasNextPage, error } = useSuspenseInfiniteQuery({
        queryKey: ['musics'],
        queryFn: ({ pageParam }) => getMusics(pageParam),
        getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
        initialPageParam: 1,
    });

    const { switchTrack, setIsNavigating } = useAudio();

    function handleOnClick(music: Music) {
        try {
            setIsNavigating(true);
            switchTrack(music);
            router.push(`/musics/${music.id}`);
        } catch (error) {
            console.error("Error playing track:", error);
            router.push(`/musics/${music.id}`);
        }
    }

    const musicList = musics.pages.flatMap((page) => page.data);

    return (
        <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Musics for you</h2>
                <Button size="sm" className="hidden sm:flex">Play all</Button>
            </div>
            <InfiniteScroll
                dataLength={musicList.length}
                next={fetchNextPage}
                hasMore={hasNextPage}
                loader={<></>}
                className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                scrollThreshold={0.3}
                scrollableTarget="main-content"
            >
                {musicList.map((music) => (
                    <button key={music.id} onClick={() => handleOnClick(music)}>
                        <VideoCard
                            title={music.snippet.title}
                            artist={music.snippet.channelTitle}
                            views="1M views"
                            imageUrl={(music.snippet.thumbnails.standard ?? music.snippet.thumbnails.high).url}
                        />
                    </button>
                ))}
            </InfiniteScroll>
        </section>
    );
}