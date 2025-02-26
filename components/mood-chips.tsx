import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const moods = ["Energize", "Feel good", "Commute", "Relax", "Romance", "Sad", "Workout", "Sleep", "Party", "Focus"]

export function MoodChips() {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-none">
      <div className="flex gap-2 pb-4">
        {moods.map((mood) => (
          <Button key={mood} variant="secondary" className="rounded-full">
            {mood}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

