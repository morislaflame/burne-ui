import { Meter } from "@/components/core/Meter";

export function MeterHorizontalDemo() {
  return (
    <div className="flex flex-col gap-mid">
      <Meter label="Диск" value={78} min={0} max={100} showValue className="w-120" />
      <Meter
        label="Память"
        value={45}
        min={0}
        max={100}
        color="var(--color-warning)"
        showValue
        className="w-120"
      />
    </div>
  );
}
