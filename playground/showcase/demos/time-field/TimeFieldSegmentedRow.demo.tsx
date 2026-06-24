import { useState } from "react";

import { Text } from "@/components/core/Text";
import { TimeField } from "@/components/core/TimeField";

export function TimeFieldSegmentedRowDemo() {
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("17:30");

  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Интервал доставки
      </Text>
      <div className="flex flex-wrap items-end gap-mid">
        <TimeField compact>
          <TimeField.Label>С</TimeField.Label>
          <TimeField.Control variant="segmented" value={start} onValueChange={setStart} />
        </TimeField>
        <Text as="span" variant="tools" className="pb-small text-muted">
          —
        </Text>
        <TimeField compact>
          <TimeField.Label>До</TimeField.Label>
          <TimeField.Control variant="segmented" value={end} onValueChange={setEnd} />
        </TimeField>
      </div>
      <Text as="p" variant="tools" className="text-muted">
        Два compact compound TimeField с segmented variant.
      </Text>
    </div>
  );
}
