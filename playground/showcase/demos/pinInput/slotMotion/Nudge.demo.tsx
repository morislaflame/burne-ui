import { PinInput } from "@/components/core/PinInput";

export function PinInputMotionNudgeDemo() {
  return (
    <PinInput
      label="Code"
      length={4}
      motion={{
        field: {
          hoverIn: (ctx) => ctx.fromRest({ y: -4, yoyo: true, repeat: 1, duration: 0.18 }),
          hoverOut: false,
        },
      }}
    />
  );
}
