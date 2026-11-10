import { ScrollArea } from "@/components/core/ScrollArea";

import { ScrollAreaCityRow } from "./cities";

export function ScrollAreaHorizontalDemo() {
  return (
    <ScrollArea aria-label="Cities" orientation="horizontal" className="h-16 w-64">
      <ScrollAreaCityRow />
    </ScrollArea>
  );
}
