import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputMotionNudgeDemo() {
  return (
    <NumberInput
      label="Quantity"
      defaultValue={1}
      motion={{
        increment: {
          pressIn: (ctx) => ctx.fromRest({ y: -4, yoyo: true, repeat: 1, duration: 0.18 }),
        },
      }}
    />
  );
}
