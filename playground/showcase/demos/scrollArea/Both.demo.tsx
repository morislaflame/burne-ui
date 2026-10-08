import { ScrollArea } from "@/components/core/ScrollArea";
import { Text } from "@/components/core/Text";

import { SCROLL_AREA_CITIES } from "./cities";

export function ScrollAreaBothDemo() {
  return (
    <ScrollArea aria-label="City notes" orientation="both" className="h-48 w-64">
      <div className="flex w-max flex-col gap-small p-base">
        {SCROLL_AREA_CITIES.map((city) => (
          <Text key={city} variant="base" className="whitespace-nowrap">
            {city} sits on the coast and keeps a long note so the row runs past the frame.
          </Text>
        ))}
      </div>
    </ScrollArea>
  );
}
