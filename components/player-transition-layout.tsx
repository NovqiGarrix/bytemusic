"use client";

import { useAudio } from "@/contexts/audio-context";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PlayerTransitionLayout({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const { currentMusic } = useAudio();
    const [isPlayerPage, setIsPlayerPage] = useState(false);

    // Check if we're on a player page
    useEffect(() => {
        setIsPlayerPage(pathname.startsWith('/musics/'));
    }, [pathname]);

    return (
        <>
            {children}

            {/* Add a spacer when mini player is visible */}
            {currentMusic && !isPlayerPage && (
                <div className="h-16"></div>
            )}
        </>
    );
}
