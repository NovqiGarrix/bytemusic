"use client"

import { Header } from "@/components/header"
import { HomePageMainSection } from "@/components/home-page-main-section"
import { Sidebar } from "@/components/sidebar"
import { useAudio } from "@/contexts/audio-context"
import { Suspense } from "react"
import { ProgressProvider } from '@bprogress/next/app';

export default function Page() {
  const { currentMusic } = useAudio();
  const hasMiniPlayer = !!currentMusic;

  return (
    <div className="bg-background h-screen flex flex-col">
      {/* HEADER */}
      <Suspense>
        <Header />
      </Suspense>

      <div className="grid lg:grid-cols-[280px_1fr] flex-1 overflow-hidden">
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex flex-col h-full overflow-hidden">
          <main
            className={`flex-1 overflow-y-auto ${hasMiniPlayer ? 'pb-16' : ''}`}
          >
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="py-6">
                <Suspense>
                  <HomePageMainSection />
                </Suspense>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}