import { CloseButton } from "@/components/core/CloseButton";

export function CloseButtonMotionInstantHoverDemo() {
  return (
    <CloseButton
      aria-label="Instant hover close"
      motion={{
        root: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}
