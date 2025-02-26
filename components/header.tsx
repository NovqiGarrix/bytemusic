import { Input } from "@/components/ui/input"
import { Music2, Search } from "lucide-react"
import Link from "next/link"

export function Header() {
    return (
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center space-x-6 w-full">
                <div className="px-4 py-2">
                    <Link href="/" className="flex items-center gap-2">
                        <Music2 className="h-6 w-6 text-red-500" />
                        <h1 className="text-xl font-semibold">Music</h1>
                    </Link>
                </div>
                <div className="flex-1 max-w-xl w-full gap-4">
                    <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input placeholder="Search songs, albums, artists, podcasts" className="pl-9 bg-muted/50" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/premium" className="text-sm font-semibold text-muted-foreground">
                    Upgrade
                </Link>
            </div>
        </header>
    )
}