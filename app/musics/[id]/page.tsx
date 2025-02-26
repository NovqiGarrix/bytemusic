"use client"

import { MobilePlayer } from "@/components/mobile-player"
import { MobileMusicThumbnail } from "@/components/MobileMusicThumbnail"
import { useAudio } from "@/contexts/audio-context"
import { ChevronDownIcon, EllipsisVerticalIcon } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MusicDetailPage() {
  const router = useRouter()
  const { currentMusic, setIsNavigating, setIsViewTransition } = useAudio()

  // Reset navigation state when component mounts
  useEffect(() => {
    // Small delay to ensure view has rendered before resetting navigation state
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 200);

    // Redirect if no music
    if (!currentMusic) {
      router.replace('/')
    }

    return () => clearTimeout(timer);
  }, [currentMusic, router, setIsNavigating]);

  // Explicitly handle back navigation
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Mark as view transition to prevent audio reload
    setIsViewTransition(true);

    // Mark as navigating to manage transition
    setIsNavigating(true);

    // Navigate back home
    router.push('/');
  };

  if (!currentMusic) return null;

  return (
    <motion.div
      className="bg-background h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <main className="h-full flex flex-col justify-between overflow-y-auto">

        {/* Home and more actions buttons */}
        <div className="flex items-center justify-between px-6 py-5">
          <button onClick={handleBackClick}>
            <ChevronDownIcon className="size-5 text-muted-foreground" />
          </button>

          <EllipsisVerticalIcon className="size-5 text-muted-foreground" />
        </div>

        {/* Video/Thumbnail Section with shared animation */}
        <motion.div layoutId={`thumbnail-container-${currentMusic.id}`}>
          <MobileMusicThumbnail />
        </motion.div>

        {/* Player section with motion transitions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <MobilePlayer />
        </motion.div>
      </main>
    </motion.div>
  )
}