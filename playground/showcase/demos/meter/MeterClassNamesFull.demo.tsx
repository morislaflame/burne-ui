import { Meter } from "@/components/core/Meter";

export function MeterClassNamesFullDemo() {
  return (
    <Meter
      label="Хранилище"
      hint="Read-only шкала заполненности"
      showValue
      value={68}
      color="var(--color-primary)"
      classNames={{
        root: "rounded-mid border border-primary/25 p-base",
        value: "text-primary font-semibold",
        track: "bg-primary/10",
        fill: "opacity-95",
        hint: "text-muted/80",
      }}
    />
  );
}
