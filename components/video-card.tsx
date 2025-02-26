import { Play } from "lucide-react"
import Image from "next/image"

interface VideoCardProps {
  title: string
  artist: string
  views: string
  imageUrl: string
}

export function VideoCard({ title, artist, views, imageUrl }: VideoCardProps) {
  return (
    <button className="relative group w-full h-full cursor-pointer">
      <div className="relative aspect-video rounded overflow-hidden">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 group-hover:bg-black/40 bg-black/10">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white"
          >
            <Play className="h-8 w-8 fill-current" />
          </div>
        </div>
      </div>
      <div className="mt-2 text-left">
        <h3 className="font-semibold line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{artist}</p>
        {views && <p className="text-sm text-muted-foreground">{views}</p>}
      </div>
    </button>
  )
}

