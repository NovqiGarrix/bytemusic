"use client"

import { getMusicById } from "@/api/music.api"
import { MobilePlayer } from "@/components/mobile-player"
import { MobileMusicThumbnail } from "@/components/MobileMusicThumbnail"
import { useAudio } from "@/contexts/audio-context"
import { useQuery } from "@tanstack/react-query"
import { ChevronDownIcon, EllipsisVerticalIcon, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

export default function MusicDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id?: string }>();
  const { currentMusic, isPlaying, togglePlayPause, switchTrack } = useAudio();

  // Get music by ID (if it is not already loaded)
  const { data: queriedMusic, isLoading: isGettingMusicFromParamsId } = useQuery({
    queryKey: ["musics", currentMusic?.id],
    queryFn: () => getMusicById(id!),
    enabled: !currentMusic?.id && !!id,
  });

  // console.log(!currentMusic?.id && !!id);

  // Track whether we've initialized playback to prevent re-triggering
  const initialLoadRef = useRef(false)

  // Effect to handle initial load and redirect if no music
  useEffect(() => {
    if (!isGettingMusicFromParamsId) return;

    // If no music, go back to home
    if (!currentMusic?.id) {
      switchTrack(queriedMusic!);
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
  }, [currentMusic?.id, router, isPlaying, togglePlayPause, isGettingMusicFromParamsId, queriedMusic, switchTrack]);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.back()
  }

  if (!currentMusic && isGettingMusicFromParamsId) return (
    <div className="bg-background h-screen flex flex-col ">
      <Loader2 className="size-10 text-foreground animate-spin m-auto" />
    </div>
  );

  return (
    <div className="bg-background h-screen flex flex-col">
      <main className="h-full flex flex-col justify-between overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5">
          <button onClick={handleBackClick}>
            <ChevronDownIcon className="size-5 text-muted-foreground" />
          </button>

          <EllipsisVerticalIcon className="size-5 text-muted-foreground" />
        </div>

        <MobileMusicThumbnail />

        <div>
          <MobilePlayer />
        </div>
      </main>
    </div>
  )
}