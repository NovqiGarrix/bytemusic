import { getNextMusics } from "@/api/musics.api"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import {
    TabsContent,
} from "@/components/ui/tabs"
import { useAudio } from "@/contexts/audio-context"
import { cn } from "@/lib/utils"
import { useInfiniteQuery } from "@tanstack/react-query"
import { ListPlusIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { NextMusicsSkeletonLoading } from "./next-musics-skeleton-loading"
import InfiniteScroll from 'react-infinite-scroll-component';

export function UpNextTabContent() {

    const { currentMusic, playlistId } = useAudio();

    const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
        queryKey: [playlistId, "nextMusics"],
        queryFn: ({ pageParam }) => getNextMusics({ channelTitle: currentMusic?.snippet.channelTitle!, currentMusicId: currentMusic?.id!, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
        initialPageParam: 1,
        enabled: !!currentMusic && !!playlistId,
        refetchOnWindowFocus: false,
    });

    const musics = useMemo(() => data?.pages.flatMap(page => page.data) || [], [data]);

    return (
        <TabsContent value="up-next" className="h-full">
            <Card className="h-full flex flex-col border-none">
                <CardContent className="w-full h-full px-2 mt-5 flex flex-col">
                    <div className="flex items-center justify-between gap-2 shrink-0">
                        <div>
                            <CardDescription>
                                Playing Now
                            </CardDescription>
                            <CardTitle className="text-base font-medium">
                                {currentMusic?.snippet.title} - {currentMusic?.snippet.channelTitle}
                            </CardTitle>
                        </div>

                        <Button className="rounded-full">
                            <ListPlusIcon className="size-5 text-black" /> Save
                        </Button>
                    </div>

                    <div id="next-music-container" className="w-full mt-5 overflow-y-auto h-[calc(100vh-280px)]">
                        {isPending ? (
                            <NextMusicsSkeletonLoading />
                        ) : (
                            <InfiniteScroll
                                dataLength={musics.length}
                                next={fetchNextPage}
                                hasMore={hasNextPage}
                                loader={<></>}
                                scrollableTarget="next-music-container"
                                scrollThreshold={0.8}
                            >
                                {musics.map((music, index) => (
                                    <Link key={music.id} href={`/musics/${music.id}`}>
                                        <div className={cn("flex items-center rounded-md justify-between py-2 px-3 border-b w-full hover:bg-muted-foreground/10", music.id === currentMusic?.id ? "bg-muted-foreground/10 border-b-muted" : "border-b-muted/50")}>
                                            {/* Thumbnail and music info */}
                                            <div className="gap-3 flex items-center">
                                                <Image
                                                    src={(music.snippet.thumbnails.standard ?? music.snippet.thumbnails?.high).url || "/placeholder-image.jpg"}
                                                    alt={music.snippet.title}
                                                    width={55}
                                                    height={55}
                                                    className="object-cover"
                                                />

                                                <div>
                                                    <h3 className="text-sm font-medium text-neutral-200">{music.snippet.title}</h3>
                                                    <p className="text-xs font-light mt-0.5 text-muted-foreground">{music.snippet.channelTitle}</p>
                                                </div>
                                            </div>

                                            {/* Duration */}
                                            {/* TODO */}
                                            <p className="text-xs text-muted-foreground">4:00</p>
                                        </div>
                                    </Link>
                                ))}
                            </InfiniteScroll>
                        )}
                    </div>

                </CardContent>
            </Card>
        </TabsContent>
    )
}