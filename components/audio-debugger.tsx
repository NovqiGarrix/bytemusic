"use client";

import { useAudio } from "@/contexts/audio-context";
import { useState } from "react";

export function AudioDebugger() {
    const { debug, currentMusic, isPlaying, currentTime, isNavigating, isViewTransition, isLoading } = useAudio();
    const [showDebug, setShowDebug] = useState(false);

    if (!showDebug) {
        return (
            <button
                className="fixed top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-50 z-50 text-xs"
                onClick={() => setShowDebug(true)}
            >
                Debug
            </button>
        );
    }

    return (
        <div className="fixed top-0 left-0 right-0 bg-black/80 text-white p-2 z-50 text-xs overflow-auto max-h-[40vh]">
            <button
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                onClick={() => setShowDebug(false)}
            >
                X
            </button>
            <h3>Audio Debug</h3>
            <div>
                <p>Music: {currentMusic?.snippet.title || 'none'} [{currentMusic?.id || 'none'}]</p>
                <p>Playing: {isPlaying ? 'yes' : 'no'} | Time: {currentTime.toFixed(1)}s</p>
                <p>States: Nav:{isNavigating ? 'yes' : 'no'} | View:{isViewTransition ? 'yes' : 'no'} | Loading:{isLoading ? 'yes' : 'no'}</p>
                <pre className="text-xs mt-2 whitespace-pre-wrap">
                    {JSON.stringify(debug, null, 2)}
                </pre>
            </div>
        </div>
    );
}
