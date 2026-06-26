import { Meter } from "@/components/core/Meter";

export function MeterSizesDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-mid">
      <Meter size="small" label="Small" value={62} showValue className="w-full" />
      <Meter size="base" label="Base" value={62} showValue className="w-full" />
      <Meter size="mid" label="Mid" value={62} showValue className="w-full" />
      <Meter size="large" label="Large" value={62} showValue className="w-full" />
    </div>
  );
}
