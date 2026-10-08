import { ScrollArea } from "@/components/core/ScrollArea";

import { ScrollAreaCityList } from "./cities";

export function ScrollAreaClassNamesDemo() {
  return (
    <ScrollArea
      aria-label="Cities"
      visibility="always"
      className="h-48 w-64"
      classNames={{
        scrollbar: "bg-primary-tint",
        thumb: "bg-primary",
      }}
    >
      <ScrollAreaCityList />
    </ScrollArea>
  );
}
