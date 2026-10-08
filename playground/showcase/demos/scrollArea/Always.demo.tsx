import { ScrollArea } from "@/components/core/ScrollArea";

import { ScrollAreaCityList } from "./cities";

export function ScrollAreaAlwaysDemo() {
  return (
    <ScrollArea aria-label="Cities" visibility="always" className="h-48 w-64">
      <ScrollAreaCityList />
    </ScrollArea>
  );
}
