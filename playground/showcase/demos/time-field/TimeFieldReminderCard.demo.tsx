import { useState } from "react";
import { IoTimerOutline } from "react-icons/io5";

import { TimeField } from "@/components/core/TimeField";

export function TimeFieldReminderCardDemo() {
  const [value, setValue] = useState("01:30:00");

  return (
    <TimeField className="w-full max-w-xs">
      <TimeField.Label>Длительность таймера</TimeField.Label>
      <TimeField.Control
        format="HH:mm:ss"
        value={value}
        onValueChange={setValue}
        variant="outline"
        prefix={<IoTimerOutline className="icon-base shrink-0 text-warning" aria-hidden />}
        suffix={<span className="text-tools font-medium text-muted">ч:м:с</span>}
      />
      <TimeField.Hint>Три spinbutton-сегмента с format=&quot;HH:mm:ss&quot;.</TimeField.Hint>
    </TimeField>
  );
}
