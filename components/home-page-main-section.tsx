import { useQueryState } from "nuqs"
import { ListenAgain } from "@/components/listen-again"
import { MoodChips } from "@/components/mood-chips"
import { MusicForYou } from "@/components/music-for-you"
import { SearchResults } from "@/components/search-results"

export function HomePageMainSection() {
    const [searchQuery] = useQueryState("q");

    return (
        <>
            {searchQuery ? (
                // Search results when query parameter is present
                <SearchResults query={searchQuery} />
            ) : (
                // Regular content when no search query
                <>
                    <MoodChips />
                    <ListenAgain />
                    <MusicForYou />
                </>
            )}
        </>
    )
}