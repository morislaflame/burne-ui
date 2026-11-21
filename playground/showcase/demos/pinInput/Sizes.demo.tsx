import { PinInput } from "@/components/core/PinInput";

export function PinInputSizesDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-small">
      <PinInput size="small" label="Small" length={4} name="pin-small" />
      <PinInput size="base" label="Base" length={4} name="pin-base" />
      <PinInput size="mid" label="Mid" length={4} name="pin-mid" />
      <PinInput size="large" label="Large" length={4} name="pin-large" />
    </div>
  );
}
