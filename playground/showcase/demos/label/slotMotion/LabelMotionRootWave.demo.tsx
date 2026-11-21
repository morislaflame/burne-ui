import { Label } from "@/components/core/Label";

export function LabelMotionRootWaveDemo() {
  return (
    <Label
      required
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ x: -8, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 }),
        },
        text: {
          hoverIn: { y: -2, duration: 0.16 },
          hoverOut: { y: 0, duration: 0.14 },
        },
      }}
    >
      Label wave
    </Label>
  );
}
