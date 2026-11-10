import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputMotionChromeDemo() {
  return (
    <NumberInput
      label="Quantity"
      hint="Whole units"
      error="Enter a quantity"
      defaultValue={1}
      motion={{
        label: {
          enter: (ctx) => ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28 }),
        },
        hint: {
          enter: (ctx) =>
            ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, delay: 0.06 }),
        },
        error: {
          enter: (ctx) =>
            ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, delay: 0.12 }),
        },
      }}
    />
  );
}
