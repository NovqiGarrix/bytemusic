"use client"

import Link from "next/link"
import { Home, Compass, Library, Crown, PlusCircle, Music2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Sidebar() {
  return (
    <div className="pb-12 border-r">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/" className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-red-500" />
            <h1 className="text-xl font-semibold">Music</h1>
          </Link>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="h-5 w-5" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Compass className="h-5 w-5" />
              Explore
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Library className="h-5 w-5" />
              Library
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Crown className="h-5 w-5" />
              Upgrade
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <Button variant="secondary" className="w-full justify-start gap-2">
            <PlusCircle className="h-5 w-5" />
            New playlist
          </Button>
        </div>
        <div className="px-3">
          <ScrollArea className="h-[300px]">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                Liked Music
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                Marsada
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                2024 Recap
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                Sounds from Shorts
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                Bible Camp
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                2022 Recap
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                Episodes for Later
              </Button>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

