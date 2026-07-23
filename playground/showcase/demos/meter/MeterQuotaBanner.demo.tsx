import { Meter } from "@/components/core/Meter";
import { Text } from "@/components/core/Text";

export function MeterQuotaBannerDemo() {

  const value = 94.2

  return (
    <div className="flex w-full max-w-md flex-col gap-mid rounded-mid border border-warning/30 bg-warning/5 p-large">
      <div className="flex items-baseline justify-between gap-large">
        <Text as="p" variant="small" className="text-warning">
          API quota almost exhausted
        </Text>
      </div>
      <div className="flex flex-col gap-small">
        <Meter
          label="API requests"
          value={value}
          min={0}
          max={100}
          showValue
          color="var(--color-warning)"
          className="w-full"
        />
        <Text as="p" variant="small" className="text-muted mt-small">
          Reset limit — 1st day of the next month.
        </Text>
      </div>
    </div>
  );
}
