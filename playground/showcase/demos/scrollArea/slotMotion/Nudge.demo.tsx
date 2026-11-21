import { ScrollArea } from "@/components/core/ScrollArea";

import { ScrollAreaCityList } from "../cities";

export function ScrollAreaMotionNudgeDemo() {
  return (
    <ScrollArea
      aria-label="Cities"
      visibility="always"
      className="h-48 w-64"
      motion={{
        thumb: {
          hoverIn: (ctx) => ctx.fromRest({ y: -4, yoyo: true, repeat: 1, duration: 0.18 }),
          hoverOut: false,
        },
      }}
    >
      <ScrollAreaCityList />
    </ScrollArea>
  );
}
