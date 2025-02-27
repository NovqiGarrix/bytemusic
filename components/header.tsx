"use client"

import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Music2, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { MobileNav } from "./mobile-nav"
import { Button } from "./ui/button"
import { useQueryState } from "nuqs"

export function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [_, setSearchQuery] = useQueryState("q")

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (inputValue.trim()) {
            await setSearchQuery(inputValue.trim())
            setIsSearchOpen(false)
        }
    }

    const handleDesktopSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (inputValue.trim()) {
            await setSearchQuery(inputValue.trim())
        }
    }

    return (
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-6 w-full">
                <MobileNav />

                <div className="py-2">
                    <Link href="/" className="flex items-center gap-2">
                        <Music2 className="h-6 w-6 text-red-500" />
                        <h1 className="text-xl font-semibold hidden xs:inline-block">Music</h1>
                    </Link>
                </div>

                {/* Desktop search */}
                <div className="hidden md:flex flex-1 max-w-xl w-full">
                    <form onSubmit={handleDesktopSearch} className="relative flex-1 max-w-2xl w-full">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Search songs, albums, artists"
                            className="pl-9 bg-muted/50"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </form>
                </div>

                {/* Mobile search dialog */}
                <Dialog
                    open={isSearchOpen}
                    onOpenChange={setIsSearchOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            className="md:hidden ml-auto"
                            variant="ghost"
                            size="icon"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md p-4">
                        <DialogHeader>
                            <DialogTitle>Search Musics</DialogTitle>
                            <DialogDescription>
                                Search any musics just like you do in Youtube.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSearchSubmit} className="space-y-4">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    placeholder="Search songs, albums, artists"
                                    className="pl-9 bg-muted/50 w-full"
                                    autoFocus
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsSearchOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Search
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/premium" className="text-sm font-semibold text-muted-foreground">
                    Upgrade
                </Link>
            </div>
        </header>
    )
}