"use client";

import { useAudio } from "@/contexts/audio-context";
import { motion } from "motion/react";
import Image from "next/image";

export function MobileMusicThumbnail() {
    const { currentMusic } = useAudio();

    if (!currentMusic) return null;

    return (
        <div className="flex-1 flex items-center justify-center px-8">
            <motion.div
                className="w-full max-w-md aspect-square relative rounded-md overflow-hidden shadow-lg"
                layoutId={`thumbnail-${currentMusic.id}`}
            >
                <Image
                    src={currentMusic.snippet.thumbnails?.standard?.url || "/placeholder-image.jpg"}
                    alt={currentMusic.snippet.title}
                    fill
                    className="object-cover"
                />
            </motion.div>
        </div>
    );
}