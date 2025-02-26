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
    TabsContent,
} from "@/components/ui/tabs"

export function LyricTabContent() {
    return (
        <TabsContent value="lyrics">
            <Card>
                <CardContent className="h-full p-5">
                    <div>
                        <CardDescription>
                            Playing Now
                        </CardDescription>
                        <CardTitle className="text-base font-medium">No Longer Slaves (LIVE) - Jonathan and Melissa</CardTitle>
                    </div>
                    <p className="mt-5 text-sm text-muted-foreground">We do not have lyrics for this music</p>
                </CardContent>
            </Card>
        </TabsContent>
    )
}