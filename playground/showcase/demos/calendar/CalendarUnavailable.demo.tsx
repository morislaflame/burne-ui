import { useState } from "react";

import { Calendar } from "@/components/core/Calendar";
import { Text } from "@/components/core/Text";

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function CalendarUnavailableDemo() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col items-start gap-large">
      <Calendar selectionMode="single" value={date} onValueChange={setDate} isDateUnavailable={isWeekend} />
      <Text as="p" textStyle="small" className="text-muted">
        Weekends stay in the grid and cannot be selected.
      </Text>
    </div>
  );
}
