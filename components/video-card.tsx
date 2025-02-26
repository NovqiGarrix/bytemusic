import Image from "next/image";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  title: string;
  artist: string;
  views?: string;
  imageUrl: string;
  className?: string;
}

export function VideoCard({
  title,
  artist,
  views,
  imageUrl,
  className,
}: VideoCardProps) {
  return (
    <div className={cn("space-y-3 cursor-pointer group", className)}>
      <div className="overflow-hidden rounded-md relative aspect-video">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-all group-hover:scale-105"
        />
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-tight line-clamp-2">{title}</h3>
        <p className="text-xs text-muted-foreground">{artist}</p>
        {views && <p className="text-xs text-muted-foreground">{views}</p>}
      </div>
    </div>
  );
}

