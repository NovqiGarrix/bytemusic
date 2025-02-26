"use client"

import { useState, useCallback } from "react"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Sidebar } from "@/components/sidebar"
import { VideoCard } from "@/components/video-card"
import { MoodChips } from "@/components/mood-chips"
import { ChevronLeft, ChevronRight } from "lucide-react"

const listenAgainItems = [
  {
    title: "All I Need Is You (Live)",
    artist: "Hillsong UNITED",
    views: "16M views",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
  },
  {
    title: "Beautiful Exchange (Live)",
    artist: "Joel Houston & Hillsong Worship",
    views: "7.5M views",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
  },
  {
    title: "Battle Belongs (Preview)",
    artist: "Phil Wickham",
    views: "58M views",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
  },
  {
    title: "Beautiful Savior",
    artist: "Natasha Midori",
    views: "",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
  },
  {
    title: "How Great Is Our God",
    artist: "Chris Tomlin",
    views: "100M views",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
  },
  {
    title: "Oceans (Where Feet May Fail)",
    artist: "Hillsong UNITED",
    views: "80M views",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png",
  },
]

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 4

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : listenAgainItems.length - itemsPerPage))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex < listenAgainItems.length - itemsPerPage ? prevIndex + 1 : 0))
  }, [])

  const visibleItems = listenAgainItems.slice(currentIndex, currentIndex + itemsPerPage)

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input placeholder="Search songs, albums, artists, podcasts" className="pl-9 bg-muted/50" />
              </div>
              <Avatar>
                <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <MoodChips />
                <section className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">Listen again</h2>
                      <p className="text-sm text-muted-foreground">NOVQIGARRIX</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={handlePrev}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleNext}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="w-full -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="flex gap-4 pb-4 px-4 sm:px-6 lg:px-8">
                      {visibleItems.map((item, index) => (
                        <VideoCard
                          key={`${item.title}-${index}`}
                          title={item.title}
                          artist={item.artist}
                          views={item.views}
                          imageUrl={item.imageUrl}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </section>
                <section className="mt-12">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Music videos for you</h2>
                    <Button>Play all</Button>
                  </div>
                  <ScrollArea className="w-full -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="flex gap-4 pb-4 px-4 sm:px-6 lg:px-8">
                      <VideoCard
                        title="Anti-Hero"
                        artist="Taylor Swift"
                        views=""
                        imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png"
                      />
                      <VideoCard
                        title="Be Still"
                        artist="Hillsong Worship"
                        views=""
                        imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png"
                      />
                      <VideoCard
                        title="Holy Forever"
                        artist="Phil Wickham"
                        views=""
                        imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png"
                      />
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

