import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import QueryClientProvider from '@/providers/query-client-provider';
import { AudioProvider } from "@/contexts/audio-context";
import { MiniPlayer } from "@/components/mini-player";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ByteMusic",
  description: "A modern music streaming platform",
  generator: 'v0.dev'
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
            {children}
            <MiniPlayer />
          </AudioProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}