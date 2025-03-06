"use client"

import { getMusicById } from "@/api/music.api"
import { Header } from "@/components/header"
import { MobilePlayer } from "@/components/mobile-player"
import { MobileMusicThumbnail } from "@/components/MobileMusicThumbnail"
import { Sidebar } from "@/components/sidebar"
import { useAudio } from "@/contexts/audio-context"
import { useQuery } from "@tanstack/react-query"
import { ChevronDownIcon, EllipsisVerticalIcon, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"
import { motion } from "motion/react"
import Image from "next/image"
import { UpNextAndLyricsTab } from "@/components/up-next-and-lyric-tab"

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

  // Track whether we've initialized playback to prevent re-triggering
  const initialLoadRef = useRef(false);

  // Effect to handle initial load and redirect if no music
  useEffect(() => {
    if (!isGettingMusicFromParamsId) return;

    // If no music, go back to home
    if (!currentMusic?.id) {
      switchTrack(queriedMusic!);
      return;
    }

    // Only auto-play on first mount, not on subsequent renders
    if (!initialLoadRef.current) {
      // Mark as initialized
      initialLoadRef.current = true;

      // Start playback if not already playing
      if (!isPlaying) {
        togglePlayPause();
      }
    }
  }, [currentMusic?.id, router, isPlaying, togglePlayPause, isGettingMusicFromParamsId, queriedMusic, switchTrack]);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.back();
  };

  if (!currentMusic && isGettingMusicFromParamsId)
    return (
      <div className="bg-background h-screen flex flex-col ">
        <Loader2 className="size-10 text-foreground animate-spin m-auto" />
      </div>
    );

  return (
    <div className="bg-background h-screen flex flex-col">
      <Suspense>
        <Header />
      </Suspense>

      <div className="grid lg:grid-cols-[280px_1fr] flex-1 overflow-hidden">
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex h-full items-center justify-around overflow-hidden p-5">

          <motion.div
            className="w-full max-w-xl h-max aspect-video relative rounded-md shadow-lg"
            layoutId={`thumbnail-${currentMusic?.id}`}
          >
            <Image
              src={currentMusic?.snippet.thumbnails?.standard?.url || "/placeholder-image.jpg"}
              alt={currentMusic?.snippet.title ?? "Music Thumbnail"}
              fill
              className="object-cover rounded-md"
            />
          </motion.div>

          <UpNextAndLyricsTab />

        </div>
      </div>

      <main className="h-full flex flex-col justify-between overflow-y-auto merah lg:hidden">
        <div className="flex items-center justify-between px-6 py-5 lg:hidden">
          <button onClick={handleBackClick} className="text-foreground">
            <ChevronDownIcon className="size-6" />
          </button>
          <EllipsisVerticalIcon className="size-6 text-foreground" />
        </div>
        <div className="flex-1 flex flex-col lg:flex-row merah">
          <div className="flex-1 flex items-center justify-center">
            <MobileMusicThumbnail />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center lg:justify-start lg:items-start lg:px-8 lg:hidden">
            <div className="text-center lg:text-left mt-4 lg:mt-0">
              <h1 className="text-2xl font-bold text-foreground">
                {currentMusic?.snippet.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentMusic?.snippet.channelTitle}
              </p>
            </div>
            <div className="mt-4 lg:mt-8 w-full lg:hidden">
              <MobilePlayer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}