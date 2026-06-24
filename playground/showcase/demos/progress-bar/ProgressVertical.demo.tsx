import { ProgressBar } from "@/components/core/ProgressBar";

export function ProgressVerticalDemo() {
  return (
    <div className="flex flex-wrap items-end gap-mid">
      <ProgressBar orientation="vertical" label="CPU" showValue value={45} className="h-28" />
      <ProgressBar
        orientation="vertical"
        label="RAM"
        showValue
        value={72}
        color="var(--color-info)"
        className="h-28"
      />
    </div>
  );
}
