"use client"

import { Header } from "@/components/header"
import { ListenAgain } from "@/components/listen-again"
import { MoodChips } from "@/components/mood-chips"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { VideoCard } from "@/components/video-card"

export default function Home() {

  return (
    <div className="bg-background h-screen flex flex-col">
      {/* HEADER */}
      <Header />

      <div className="grid lg:grid-cols-[280px_1fr] flex-1 overflow-hidden">
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex flex-col h-full overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="py-6">
                <MoodChips />

                {/* LISTEN AGAIN */}
                <ListenAgain />

                {/* MUSIC VIDEOS FOR YOU */}
                <section className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Music videos for you</h2>
                    <Button>Play all</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {new Array(10).fill(0).map((_, index) => (
                      <VideoCard
                        key={index}
                        title={`Video Title ${index + 1}`}
                        artist={`Artist ${index + 1}`}
                        views={`100M views`}
                        imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png"
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

