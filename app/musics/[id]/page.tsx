"use client"

import { MobilePlayer } from "@/components/mobile-player"
import { MobileMusicThumbnail } from "@/components/MobileMusicThumbnail"
import { useAudio } from "@/contexts/audio-context"
import { ChevronDownIcon, EllipsisVerticalIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

export default function MusicDetailPage() {
  const router = useRouter()
  const { currentMusic, isPlaying, togglePlayPause } = useAudio()

  // Track whether we've initialized playback to prevent re-triggering
  const initialLoadRef = useRef(false)

  // Effect to handle initial load and redirect if no music
  useEffect(() => {
    // If no music, go back to home
    if (!currentMusic) {
      router.replace('/')
      return
    }

    // Only auto-play on first mount, not on subsequent renders
    if (!initialLoadRef.current) {
      // Mark as initialized
      initialLoadRef.current = true

      // Start playback if not already playing
      if (!isPlaying) {
        togglePlayPause()
      }
    }
  }, [currentMusic, router, isPlaying, togglePlayPause])

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.back()
  }

  if (!currentMusic) return null

  return (
    <div className="bg-background h-screen flex flex-col">
      <main className="h-full flex flex-col justify-between overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5">
          <button onClick={handleBackClick}>
            <ChevronDownIcon className="size-5 text-muted-foreground" />
          </button>

          <EllipsisVerticalIcon className="size-5 text-muted-foreground" />
        </div>

        <div>
          <MobileMusicThumbnail />
        </div>

        <div>
          <MobilePlayer />
        </div>
      </main>
    </div>
  )
}