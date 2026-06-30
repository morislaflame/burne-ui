import { IoTimeOutline } from "react-icons/io5";

import { TimeField } from "@/components/core/TimeField";

export function TimeFieldClassNamesFullDemo() {
  return (
    <TimeField
      className="max-w-sm"
      classNames={{
        root: "rounded-mid border border-primary/20 p-base",
        shell: "ring-1 ring-primary/15",
        segment: "font-semibold",
        prefix: "text-primary",
        hint: "text-foreground/70",
        error: "font-medium",
      }}
      label="Время встречи"
      defaultValue="09:30"
      status="danger"
      hint="24-часовой формат"
      error="Укажите корректное время."
      prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
    />
  );
}

export function TimeFieldClassNamesCompoundDemo() {
  return (
    <TimeField
      className="max-w-sm"
      classNames={{
        root: "rounded-mid border border-info/25 p-base",
        shell: "border-info/30 bg-info/5",
        segments: "text-info",
        segment: "font-medium",
        prefix: "text-info",
        hint: "text-info/80",
      }}
    >
      <TimeField.Label>Начало смены</TimeField.Label>
      <TimeField.Control
        defaultValue="14:30"
        variant="segmented"
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      />
      <TimeField.Hint>Слоты shell, segments и segment через classNames.</TimeField.Hint>
    </TimeField>
  );
}
