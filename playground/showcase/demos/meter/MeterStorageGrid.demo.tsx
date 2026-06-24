import { Meter } from "@/components/core/Meter";
import { Text } from "@/components/core/Text";

const METRICS = [
  { label: "SSD", value: 92, color: "var(--color-danger)" },
  { label: "RAM", value: 61, color: "var(--color-warning)" },
  { label: "CPU", value: 34, color: "var(--color-success)" },
] as const;

export function MeterStorageGridDemo() {
  return (
    <div className="grid w-full max-w-lg grid-cols-1 gap-mid sm:grid-cols-3">
      {METRICS.map((metric) => (
        <div
          key={metric.label}
          className="flex flex-col gap-small rounded-mid border-token bg-secondary p-mid"
        >
          <Text as="p" variant="small" className="font-medium">
            {metric.label}
          </Text>
          <Meter
            label={metric.label}
            value={metric.value}
            min={0}
            max={100}
            showValue
            color={metric.color}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}
