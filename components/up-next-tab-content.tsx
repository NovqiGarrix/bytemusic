import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ListPlusIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function UpNextTabContent() {
    return (
        <TabsContent value="up-next">
            <Card>
                <CardContent className="w-full p-5">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <CardDescription>
                                Playing Now
                            </CardDescription>
                            <CardTitle className="text-base font-medium">No Longer Slaves (LIVE) - Jonathan and Melissa</CardTitle>
                        </div>

                        <Button className="rounded-full">
                            <ListPlusIcon className="size-5 text-black" /> Save
                        </Button>
                    </div>

                    <div className="w-full mt-5">
                        {new Array(10).fill(0).map((_, index) => (
                            <Link key={index} href="/musics/1">
                                <div className={cn("flex items-center justify-between py-2 px-3 border-b w-full", index === 0 ? "bg-muted-foreground/10 border-b-muted" : "border-b-muted/50")}>
                                    {/* Thumbnail and music info */}
                                    <div className="gap-3 flex items-center">
                                        <Image
                                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-24%20at%2004-54-48%20YouTube%20Music-PjwbGZnYNbOGSGMV6GHLU8DoHA2FHn.png"
                                            alt="No Longer Slaves"
                                            width={55}
                                            height={55}
                                            className="object-cover"
                                        />

                                        <div>
                                            <h3 className="text-sm font-medium text-neutral-200">No Longer Slaves (LIVE) - Jonathan and Melissa</h3>
                                            <p className="text-xs font-light mt-0.5 text-muted-foreground">Bethel Music</p>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <p className="text-xs text-muted-foreground">4:00</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    )
}