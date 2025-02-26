"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { Compass, Home, Library, Menu, PlusCircle } from "lucide-react"
import { useState } from "react"
import { ScrollArea } from "./ui/scroll-area"

export function MobileNav() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="size-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 pt-10">
                <SheetHeader className="p-0">
                    <SheetTitle asChild>
                        <VisuallyHidden>ByteMusic Sidebar</VisuallyHidden>
                    </SheetTitle>
                    <SheetDescription>
                        <VisuallyHidden>ByteMusic Sidebar Description</VisuallyHidden>
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 py-4">
                    <div className="px-3">
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Home className="h-5 w-5" />
                                Home
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Compass className="h-5 w-5" />
                                Explore
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Library className="h-5 w-5" />
                                Library
                            </Button>
                        </div>
                    </div>
                    <div className="px-3 py-2">
                        <Button variant="secondary" className="w-full justify-start gap-2">
                            <PlusCircle className="h-5 w-5" />
                            New playlist
                        </Button>
                    </div>
                    <div className="px-3">
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-1">
                                <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                                    Liked Music
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                                    Marsada
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                                    2024 Recap
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                                    Sounds from Shorts
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                                    Bible Camp
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                                    2022 Recap
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm font-normal">
                                    Episodes for Later
                                </Button>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
