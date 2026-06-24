import { useState } from "react";

import { Calendar } from "@/components/core/Calendar";
import { Text } from "@/components/core/Text";

function formatDate(d: Date | null) {
  if (!d) return "дата не выбрана";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export function CalendarCompoundLayoutDemo() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Compound layout
      </Text>
      <Calendar mode="single" value={date} onValueChange={setDate}>
        <Calendar.Header />
        <Calendar.Grid />
        <Calendar.Footer />
      </Calendar>
      <Text as="p" variant="tools" className="text-muted">
        {formatDate(date)}
      </Text>
    </div>
  );
}
