import { Button } from "@/components/core/Button";

export function MotionVarsDemo() {
  return (
    <Button
      motion={{
        root: { hoverIn: { y: -2, duration: 0.2 }, hoverOut: { y: 0 } },
      }}
    >
      Nudge
    </Button>
  );
}
