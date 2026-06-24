import { Meter } from "@/components/core/Meter";
import { Text } from "@/components/core/Text";

export function MeterQuotaBannerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-small rounded-mid border border-warning/30 bg-warning/5 p-mid">
      <div className="flex items-baseline justify-between gap-mid">
        <Text as="p" variant="base" className="font-medium text-warning">
          Квота API почти исчерпана
        </Text>
        <Text as="span" variant="tools" className="tabular-nums text-muted">
          9 420 / 10 000
        </Text>
      </div>
      <Meter
        label="API requests"
        value={94.2}
        min={0}
        max={100}
        showValue
        color="var(--color-warning)"
        className="w-full"
      />
      <Text as="p" variant="small" className="text-muted">
        Сброс лимита — 1-го числа следующего месяца.
      </Text>
    </div>
  );
}
