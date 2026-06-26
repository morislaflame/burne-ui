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
        <Meter
          key={metric.label}
          className="flex flex-col gap-small rounded-mid border-token bg-secondary p-mid"
        >
          <Meter.Header className="flex-col items-start gap-0">
            <Meter.Label>
              <Text as="span" variant="tools" className="uppercase tracking-wide text-muted">
                {metric.label}
              </Text>
            </Meter.Label>
            <Meter.Value className="text-header-2 font-semibold text-foreground">
              {metric.value}%
            </Meter.Value>
          </Meter.Header>
          <Meter.Track
            value={metric.value}
            min={0}
            max={100}
            color={metric.color}
            className="w-full"
          />
        </Meter>
      ))}
    </div>
  );
}
