import { Kbd } from "@/components/core/Kbd";

export function KbdMotionInstantHoverDemo() {
  return (
    <Kbd motion={{ root: { hoverIn: false, hoverOut: false } }}>Esc</Kbd>
  );
}
