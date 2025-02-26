"use client"

import { MobilePlayer } from "@/components/mobile-player"
import { MobileMusicThumbnail } from "@/components/MobileMusicThumbnail"
import { ChevronDownIcon, EllipsisVerticalIcon } from "lucide-react"
import Link from "next/link"

export default function MusicDetailPage() {
  return (
    <div className="bg-background h-screen flex flex-col">
      <main className="h-full flex flex-col justify-between overflow-y-auto">

        {/* Home and more actions buttons */}
        <div className="flex items-center justify-between px-6 py-5">
          <Link href="/">
            <ChevronDownIcon className="size-5 text-muted-foreground" />
          </Link>

          <EllipsisVerticalIcon className="size-5 text-muted-foreground" />
        </div>

        {/* Video/Thumbnail Section */}
        <MobileMusicThumbnail />

        {/* Player section */}
        <MobilePlayer />
      </main>
    </div>
  )
}