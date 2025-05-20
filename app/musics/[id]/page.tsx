"use client"

import { getMusicById } from "@/api/music.api"
import { DesktopMusicPage } from "@/components/desktop-music-page"
import { Header } from "@/components/header"
import { MobilePlayer } from "@/components/mobile-player"
import { MobileMusicThumbnail } from "@/components/MobileMusicThumbnail"
import { Sidebar } from "@/components/sidebar"
import { useAudio } from "@/contexts/audio-context"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"

export default function MusicDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id?: string }>();
  const { currentMusic, isPlaying, togglePlayPause, switchTrack, setPlaylistId } = useAudio();

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
    if (isGettingMusicFromParamsId) return;

    // If no music, go back to home
    if (!currentMusic?.id) {
      setPlaylistId(queriedMusic?.id!);
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
        <DesktopMusicPage music={currentMusic!} />
      </div>

      <main className="h-full flex flex-col justify-between overflow-y-auto lg:hidden">
        <div className="flex-1 flex flex-col lg:flex-row">
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