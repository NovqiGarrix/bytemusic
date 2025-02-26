import { getMusicById } from "@/api/music.api";
import type { Metadata } from "next"
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>
    children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const music = await getMusicById(resolvedParams.id);


    if (!music) {
        return notFound();
    }

    return {
        title: `Now Playing | ${music.snippet.title}`,
        description: `Listen to ${music.snippet.title} on ByteMusic`,
        openGraph: {
            title: `Now Playing | ${music.snippet.title}`,
            description: `Listen to ${music.snippet.title} on ByteMusic`,
            type: "music.song",
        }
    }
}

export default function MusicDetailLayout({ children }: Props) {
    return <>{children}</>
}
