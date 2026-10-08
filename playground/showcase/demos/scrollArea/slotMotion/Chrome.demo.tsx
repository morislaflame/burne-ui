import { ScrollArea } from "@/components/core/ScrollArea";

import { ScrollAreaCityList } from "../cities";

export function ScrollAreaMotionChromeDemo() {
  return (
    <ScrollArea
      aria-label="Cities"
      visibility="always"
      className="h-48 w-64"
      classNames={{ thumb: "bg-primary" }}
      motion={{
        thumb: {
          hoverIn: { scale: 1.08, duration: 0.16 },
          hoverOut: { scale: 1, duration: 0.16 },
        },
      }}
    >
      <ScrollAreaCityList />
    </ScrollArea>
  );
}
