import { useGetMusic } from "@/hooks/use-get-music";
import Image from "next/image";


export function MobileMusicThumbnail() {
    const { data: music } = useGetMusic()!;

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[640px] aspect-video relative rounded-lg overflow-hidden bg-muted">
                    <Image
                        src={music.snippet.thumbnails.standard.url}
                        alt={music.snippet.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}