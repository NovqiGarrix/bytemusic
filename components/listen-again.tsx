import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { VideoCard } from "./video-card";
import { EmblaCarouselType } from 'embla-carousel';

const listenAgainItems = [
    {
        title: "All I Need Is You (Live)",
        artist: "Hillsong UNITED",
        views: "16M views",
        imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
    },
    {
        title: "Beautiful Exchange (Live)",
        artist: "Joel Houston & Hillsong Worship",
        views: "7.5M views",
        imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
    },
    {
        title: "Battle Belongs (Preview)",
        artist: "Phil Wickham",
        views: "58M views",
        imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
    },
    {
        title: "Beautiful Savior",
        artist: "Natasha Midori",
        views: "",
        imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
    },
    {
        title: "How Great Is Our God",
        artist: "Chris Tomlin",
        views: "100M views",
        imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
    },
    {
        title: "Oceans (Where Feet May Fail)",
        artist: "Hillsong UNITED",
        views: "80M views",
        imageUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
    },
]

export function ListenAgain() {
    const [api, setApi] = useState<CarouselApi>();
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [canScrollPrev, setCanScrollPrev] = useState(false);

    useEffect(() => {
        if (!api) return;

        function handleCanScrollNext(cb: EmblaCarouselType) {
            setCanScrollNext(cb.canScrollNext());
            setCanScrollPrev(cb.canScrollPrev());
        }

        api.on('select', handleCanScrollNext);
        handleCanScrollNext(api);

        return () => {
            api.off('select', handleCanScrollNext);
        }

    }, [api]);

    return (
        <section className="mt-3">
            <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Listen again</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">NOVQIGARRIX</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button disabled={!canScrollPrev} variant="outline" size="icon" className="h-8 w-8" onClick={() => api?.scrollPrev()}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button disabled={!canScrollNext} variant="outline" size="icon" className="h-8 w-8" onClick={() => api?.scrollNext()}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    slidesToScroll: 1,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {listenAgainItems.map((item, index) => (
                        <CarouselItem key={index} className="basis-full xs:basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                            <VideoCard
                                title={item.title}
                                artist={item.artist}
                                views={item.views}
                                imageUrl={item.imageUrl}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    )
}
