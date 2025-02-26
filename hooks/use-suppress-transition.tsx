"use client";

import { useAudio } from "@/contexts/audio-context";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * A hook that helps suppress the mini-player during transitions
 * to prevent the flicker effect when going to the music detail page
 */
export function useSuppressTransition() {
    const { setIsNavigating } = useAudio();
    const pathname = usePathname();

    // Suppress transitions when going to or from the music detail page
    useEffect(() => {
        const isMusicPage = pathname.startsWith('/musics/');

        // When music page loads, temporarily mark as navigating
        if (isMusicPage) {
            setIsNavigating(true);

            // Reset after animation completes
            const timer = setTimeout(() => {
                setIsNavigating(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [pathname, setIsNavigating]);
}
