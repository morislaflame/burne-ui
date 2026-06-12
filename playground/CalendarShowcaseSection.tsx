import { useState } from "react";

import { Calendar, type CalendarRangeValue } from "@/components/core/Calendar";
import { Text } from "@/components/core/Text";

function formatDate(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

/** Изолированный блок календаря — не перерисовывается при смене состояния остального showcase. */
export function CalendarShowcaseSection() {
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);
  const [calendarRange, setCalendarRange] = useState<CalendarRangeValue>({ start: null, end: null });
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);

  return (
    <div className="flex flex-col gap-xlarge">
      <div className="flex flex-col items-start gap-mid">
        <Text as="span" variant="small" className="font-medium">
          Одна дата
        </Text>
        <Calendar mode="single" value={calendarDate} onValueChange={setCalendarDate} />
        <Text as="p" variant="small" className="text-muted">
          Выбрано: <span className="font-medium text-foreground">{formatDate(calendarDate)}</span>
        </Text>
      </div>
      <div className="flex flex-col items-start gap-mid">
        <Text as="span" variant="small" className="font-medium">
          Диапазон
        </Text>
        <Calendar mode="range" value={calendarRange} onValueChange={setCalendarRange} />
        <Text as="p" variant="small" className="text-muted">
          От <span className="font-medium text-foreground">{formatDate(calendarRange.start)}</span> до{" "}
          <span className="font-medium text-foreground">{formatDate(calendarRange.end)}</span>
        </Text>
      </div>
      <div className="flex flex-col items-start gap-mid">
        <Text as="span" variant="small" className="font-medium">
          Несколько дат
        </Text>
        <Calendar mode="multiple" value={calendarDates} onValueChange={setCalendarDates} />
        <Text as="p" variant="small" className="text-muted">
          Выбрано:{" "}
          <span className="font-medium text-foreground">
            {calendarDates.length > 0 ? calendarDates.map((d) => formatDate(d)).join(", ") : "—"}
          </span>
        </Text>
      </div>
      <div className="flex flex-col items-start gap-mid">
        <Text as="span" variant="small" className="font-medium">
          С футером
        </Text>
        <Calendar mode="single" value={calendarDate} onValueChange={setCalendarDate}>
          <Calendar.Header />
          <Calendar.Grid />
          <Calendar.Footer />
        </Calendar>
      </div>
    </div>
  );
}
