import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { LyricTabContent } from "./lyric-tab-content"
import { UpNextTabContent } from "./up-next-tab-content"

export function UpNextAndLyricsTab() {
  return (
    <Tabs defaultValue="up-next" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="up-next" className="uppercase">Up Next</TabsTrigger>
        <TabsTrigger value="lyrics" className="uppercase">Lyrics</TabsTrigger>
      </TabsList>
      <UpNextTabContent />
      <LyricTabContent />
    </Tabs>
  )
}
