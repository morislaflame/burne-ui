import { PinInput } from "@/components/core/PinInput";

export function PinInputMotionHoverOffDemo() {
  return (
    <PinInput
      label="Code"
      length={4}
      motion={{
        field: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}
