import { ScrollArea } from "@/components/core/ScrollArea";

import { ScrollAreaCityList } from "./cities";

export function ScrollAreaVerticalDemo() {
  return (
    <ScrollArea aria-label="Cities" className="h-48 w-64">
      <ScrollAreaCityList />
    </ScrollArea>
  );
}
