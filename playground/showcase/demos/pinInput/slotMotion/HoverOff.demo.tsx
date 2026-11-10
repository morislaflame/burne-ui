import { PinInput } from "@/components/core/PinInput";

export function PinInputMotionHoverOffDemo() {
  return (
    <PinInput
      label="Code"
      length={4}
      motion={{
        control: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}
