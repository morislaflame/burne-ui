import { ScrollArea } from "@/components/core/ScrollArea";

import { ScrollAreaCityList } from "./cities";

export function ScrollAreaCompoundDemo() {
  return (
    <ScrollArea aria-label="Cities" className="h-48 w-64">
      <ScrollArea.Viewport>
        <ScrollAreaCityList />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea>
  );
}
