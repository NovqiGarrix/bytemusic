"use client"

import { Header } from "@/components/header"
import { ListenAgain } from "@/components/listen-again"
import { MoodChips } from "@/components/mood-chips"
import { MusicForYou } from "@/components/music-for-you"
import { PageTransitionWrapper } from "@/components/page-transition-wrapper"
import { SearchResults } from "@/components/search-results"
import { Sidebar } from "@/components/sidebar"
import { useAudio } from "@/contexts/audio-context"
import { useQueryState } from "nuqs"

export default function Page() {
  const { currentMusic } = useAudio();
  const hasMiniPlayer = !!currentMusic;

  const [searchQuery] = useQueryState("q");

  return (
    <PageTransitionWrapper>
      <div className="bg-background h-screen flex flex-col">
        {/* HEADER */}
        <Header />

        <div className="grid lg:grid-cols-[280px_1fr] flex-1 overflow-hidden">
          <Sidebar />

          {/* MAIN CONTENT */}
          <div className="flex flex-col h-full overflow-hidden">
            <main
              className={`flex-1 overflow-y-auto ${hasMiniPlayer ? 'pb-16' : ''}`}
            >
              <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="py-6">
                  {searchQuery ? (
                    // Search results when query parameter is present
                    <SearchResults query={searchQuery} />
                  ) : (
                    // Regular content when no search query
                    <>
                      <MoodChips />
                      <ListenAgain />
                      <MusicForYou />
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </PageTransitionWrapper>
  )
}