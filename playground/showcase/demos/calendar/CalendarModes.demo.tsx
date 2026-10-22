import { useState } from "react";

import { Calendar, type CalendarRangeValue } from "@/components/core/Calendar";
import { Text } from "@/components/core/Text";

function formatDate(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export function CalendarModesDemo() {
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<CalendarRangeValue>({ start: null, end: null });
  const [dates, setDates] = useState<Date[]>([]);

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-col items-start gap-large">
        <Text as="span" textStyle="small" className="font-medium">
          One date
        </Text>
        <Calendar selectionMode="single" value={date} onValueChange={setDate} />
        <Text as="p" textStyle="small" className="text-muted">
          Selected: <span className="font-medium text-foreground">{formatDate(date)}</span>
        </Text>
      </div>
      <div className="flex flex-col items-start gap-large">
        <Text as="span" textStyle="small" className="font-medium">
          Range
        </Text>
        <Calendar selectionMode="range" value={range} onValueChange={setRange} />
        <Text as="p" textStyle="small" className="text-muted">
          From <span className="font-medium text-foreground">{formatDate(range.start)}</span> to{" "}
          <span className="font-medium text-foreground">{formatDate(range.end)}</span>
        </Text>
      </div>
      <div className="flex flex-col items-start gap-large">
        <Text as="span" textStyle="small" className="font-medium">
          Multiple dates
        </Text>
        <Calendar selectionMode="multiple" values={dates} onValuesChange={setDates} />
        <Text as="p" textStyle="small" className="text-muted">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {dates.length > 0 ? dates.map((d) => formatDate(d)).join(", ") : "—"}
          </span>
        </Text>
      </div>
      <div className="flex flex-col items-start gap-large">
        <Text as="span" textStyle="small" className="font-medium">
          With footer
        </Text>
        <Calendar selectionMode="single" value={date} onValueChange={setDate}>
          <Calendar.Header />
          <Calendar.Grid />
          <Calendar.Footer />
        </Calendar>
      </div>
    </div>
  );
}
