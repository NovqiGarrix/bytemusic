"use client"

import { Header } from "@/components/header"
import { ListenAgain } from "@/components/listen-again"
import { MoodChips } from "@/components/mood-chips"
import { MusicForYou } from "@/components/music-for-you"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"
import { Sidebar } from "@/components/sidebar"
import { useAudio } from "@/contexts/audio-context"

// export const metadata: Metadata = {
//   title: "ByteMusic",
//   description: "A modern music streaming platform",
//   generator: 'v0.dev'
// }

export default function Home() {
  const { currentMusic } = useAudio();
  const hasMiniPlayer = !!currentMusic;

  return (
    <PageTransitionWrapper>
      <div className="bg-background h-screen flex flex-col">
        {/* HEADER */}
        <Header />

        <div className="grid lg:grid-cols-[280px_1fr] flex-1 overflow-hidden">
          <Sidebar />

          {/* MAIN CONTENT */}
          <div className="flex flex-col h-full overflow-hidden">
            <main className={`flex-1 overflow-y-auto ${hasMiniPlayer ? 'pb-16' : ''}`}>
              <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="py-6">
                  <MoodChips />

                  {/* LISTEN AGAIN */}
                  <ListenAgain />

                  {/* MUSIC VIDEOS FOR YOU */}
                  <MusicForYou />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  )
}

