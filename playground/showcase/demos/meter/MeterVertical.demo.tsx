import { Meter } from "@/components/core/Meter";

export function MeterVerticalDemo() {
  return (
    <Meter
      orientation="vertical"
      label="Disk"
      showValue
      value={88}
      color="var(--color-warning)"
      className="h-28"
    />
  );
}
