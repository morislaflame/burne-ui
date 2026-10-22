import { PinInput } from "@/components/core/PinInput";

export function PinInputMotionNudgeDemo() {
  return (
    <PinInput
      label="Code"
      length={4}
      motion={{
        control: {
          hoverIn: (ctx) => ctx.fromRest({ y: -4, yoyo: true, repeat: 1, duration: 0.18 }),
          hoverOut: false,
        },
      }}
    />
  );
}
