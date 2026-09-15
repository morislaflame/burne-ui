import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonMotionInstantFillDemo() {
  return (
    <ToggleButton
      variant="outline"
      defaultPressed
      motion={{ fill: { check: false, uncheck: false } }}
    >
      Instant fill
    </ToggleButton>
  );
}
