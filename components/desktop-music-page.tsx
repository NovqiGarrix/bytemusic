import { motion } from "motion/react"
import { UpNextAndLyricsTab } from "@/components/up-next-and-lyric-tab"
import Image from "next/image"
import { Music } from "@/api/music.api"
import { MobilePlayer } from "./mobile-player"

export function DesktopMusicPage({ music }: { music: Music | null }) {

    return (
        <div className="hidden lg:flex h-full items-center justify-around overflow-hidden p-5">

            <div className="w-full">
                <motion.div
                    className="w-full max-w-2xl mx-auto aspect-video relative rounded-md shadow-lg"
                    layoutId={`thumbnail-${music?.id}`}
                >
                    <Image
                        src={music?.snippet.thumbnails?.standard?.url || "/placeholder-image.jpg"}
                        alt={music?.snippet.title ?? "Music Thumbnail"}
                        fill
                        className="object-cover rounded-md"
                    />
                </motion.div>

                <MobilePlayer />
            </div>

            <div className="h-full shrink-0 max-w-sm">
                <UpNextAndLyricsTab />
            </div>

        </div>
    )

}