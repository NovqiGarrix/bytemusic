'use client';

import { Inter } from "next/font/google";
import type React from "react";
import QueryClientProvider from '@/providers/query-client-provider';
import { AudioProvider } from "@/contexts/audio-context";
import { MiniPlayer } from "@/components/mini-player";
import { PlayerTransitionLayout } from "@/components/player-transition-layout";
import { AudioDebugger } from "@/components/audio-debugger";
import "./globals.css";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAudio } from "@/contexts/audio-context";

const inter = Inter({ subsets: ["latin"] });

function NavigationEvents() {
  const pathname = usePathname();
  const { setIsNavigating } = useAudio();

  useEffect(() => {
    // Set navigation state to prevent mini-player flicker
    setIsNavigating(true);

    // Reset after a short delay
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, setIsNavigating]);

  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryClientProvider>
          <AudioProvider>
            <PlayerTransitionLayout>
              <NavigationEvents />
              <AnimatePresence mode="wait">
                {children}
              </AnimatePresence>
              {process.env.NODE_ENV === 'development' && <AudioDebugger />}
              <MiniPlayer />
            </PlayerTransitionLayout>
          </AudioProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}