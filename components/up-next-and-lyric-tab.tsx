import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { LyricTabContent } from "./lyric-tab-content"
import { UpNextTabContent } from "./up-next-tab-content"

export function UpNextAndLyricsTab() {
  return (
    <Tabs defaultValue="up-next" className="w-full max-w-md flex flex-col overflow-hidden">
      <TabsList className="grid w-full grid-cols-2 shrink-0">
        <TabsTrigger value="up-next" className="uppercase">Up Next</TabsTrigger>
        <TabsTrigger value="lyrics" className="uppercase">Lyrics</TabsTrigger>
      </TabsList>
      <div className="flex-grow overflow-auto">
        <UpNextTabContent />
        <LyricTabContent />
      </div>
    </Tabs>
  )
}
