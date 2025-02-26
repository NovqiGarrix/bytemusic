import { Play } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface VideoCardProps {
  title: string
  artist: string
  views: string
  imageUrl: string
}

export function VideoCard({ title, artist, views, imageUrl }: VideoCardProps) {
  return (
    <div className="relative group w-[250px] md:w-[300px]">
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white hover:text-white hover:bg-white/20"
          >
            <Play className="h-8 w-8 fill-current" />
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="font-semibold line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{artist}</p>
        {views && <p className="text-sm text-muted-foreground">{views}</p>}
      </div>
    </div>
  )
}

