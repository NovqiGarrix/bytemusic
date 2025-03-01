'use client';

import QueryClientProvider from '@/providers/query-client-provider';
import { AudioProvider } from "@/contexts/audio-context";
import { MiniPlayer } from "@/components/mini-player";
import { PlayerTransitionLayout } from "@/components/player-transition-layout";
import { AudioDebugger } from "@/components/audio-debugger";
import { AnimatePresence } from "motion/react";

export function ClientRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <QueryClientProvider>
            <AudioProvider>
                <PlayerTransitionLayout>
                    <AnimatePresence mode="wait">
                        {children}
                    </AnimatePresence>
                    {process.env.NODE_ENV === 'development' && <AudioDebugger />}
                    <MiniPlayer />
                </PlayerTransitionLayout>
            </AudioProvider>
        </QueryClientProvider>
    );
}
