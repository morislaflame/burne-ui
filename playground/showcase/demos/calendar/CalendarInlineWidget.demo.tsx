import { useState } from "react";

import { Calendar } from "@/components/core/Calendar";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function CalendarInlineWidgetDemo() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Surface variant="secondary" padding="small" className="inline-flex flex-col gap-small">
      <Text as="span" variant="tools" className="px-small text-muted">
        Быстрый выбор даты
      </Text>
      <Calendar mode="single" value={date} onValueChange={setDate} size="small" />
    </Surface>
  );
}
