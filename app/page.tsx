"use client"

import { Header } from "@/components/header"
import { HomePageMainSection } from "@/components/home-page-main-section"
import { Sidebar } from "@/components/sidebar"
import { useAudio } from "@/contexts/audio-context"
import { Suspense } from "react"

export default function Page() {
  const { currentMusic } = useAudio();
  const hasMiniPlayer = !!currentMusic;

  return (
    <div className="bg-background h-screen flex flex-col">
      {/* HEADER */}
      <Suspense>
        <Header />
      </Suspense>

      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />

        {/* MAIN CONTENT */}
        <main
          className={`px-4 py-6 sm:px-6 lg:px-8 ${hasMiniPlayer ? 'pb-16' : 'pb-8'}`}
          id="main-content"
        >
          <Suspense>
            <HomePageMainSection />
          </Suspense>
        </main>
      </div>
    </div>
  )
}