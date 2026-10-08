import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputMotionPartsDemo() {
  return (
    <NumberInput
      label="Quantity"
      defaultValue={1}
      motion={{
        control: {
          enter: (ctx) => ctx.fromTo({ y: 4, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28 }),
        },
        decrement: {
          pressIn: (ctx) => ctx.fromRest({ rotation: -14, yoyo: true, repeat: 1, duration: 0.18 }),
        },
        increment: {
          pressIn: (ctx) => ctx.fromRest({ rotation: 14, yoyo: true, repeat: 1, duration: 0.18 }),
        },
      }}
    />
  );
}
