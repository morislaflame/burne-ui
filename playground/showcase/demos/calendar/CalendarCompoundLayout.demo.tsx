import { useState } from "react";

import { Calendar } from "@/components/core/Calendar";
import { Text } from "@/components/core/Text";

function formatDate(d: Date | null) {
  if (!d) return "date not selected";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export function CalendarCompoundLayoutDemo() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="flex w-full max-w-sm flex-col gap-large">
      <Text as="p" textStyle="small" className="font-medium">
        Compound layout
      </Text>
      <Calendar selectionMode="single" value={date} onValueChange={setDate}>
        <Calendar.Header />
        <Calendar.Grid />
        <Calendar.Footer />
      </Calendar>
      <Text as="p" textStyle="xsmall" className="text-muted">
        {formatDate(date)}
      </Text>
    </div>
  );
}
