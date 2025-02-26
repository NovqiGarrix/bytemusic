import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { VideoCard } from "./video-card";

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

    return (
        <section className="mt-3">
            <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Listen again</h2>
                    <p className="text-sm text-muted-foreground">NOVQIGARRIX</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button disabled={!api?.canScrollPrev} variant="outline" size="icon" onClick={() => api?.scrollPrev()}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button disabled={!!!api?.canScrollNext} variant="outline" size="icon" onClick={() => api?.scrollNext()}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    slidesToScroll: 1,
                    duration: 20,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {listenAgainItems.map((item, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
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
