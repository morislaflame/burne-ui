import { useState } from "react";

import { Calendar, type CalendarRangeValue } from "@/components/core/Calendar";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

function formatDate(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function CalendarBookingPanelDemo() {
  const [range, setRange] = useState<CalendarRangeValue>({ start: null, end: null });

  return (
    <Surface variant="secondary" padding="mid" className="flex w-full max-w-sm flex-col gap-mid">
      <div className="flex flex-col gap-xsmall">
        <Text as="p" variant="small" className="font-medium">
          Booking
        </Text>
        <Text as="p" variant="tools" className="text-muted">
          {formatDate(range.start)} — {formatDate(range.end)}
        </Text>
      </div>
      <Calendar mode="range" value={range} onValueChange={setRange}>
        <Calendar.Header />
        <Calendar.Grid />
        <Calendar.Footer />
      </Calendar>
    </Surface>
  );
}
