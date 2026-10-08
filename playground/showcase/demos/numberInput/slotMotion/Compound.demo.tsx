import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputMotionCompoundDemo() {
  return (
    <NumberInput defaultValue={2} classNames={{ shell: "bg-primary-tint", control: "font-w-mid" }}>
      <NumberInput.Label
        motion={{
          enter: (ctx) => ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28 }),
        }}
      >
        Quantity
      </NumberInput.Label>
      <NumberInput.Decrement />
      <NumberInput.Control
        motion={{
          enter: (ctx) => ctx.fromTo({ opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.05 }),
        }}
      />
      <NumberInput.Increment
        motion={{
          pressIn: (ctx) => ctx.fromRest({ y: -5, yoyo: true, repeat: 1, duration: 0.16 }),
        }}
      />
      <NumberInput.Hint
        motion={{
          enter: (ctx) => ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, delay: 0.1 }),
        }}
      >
        Units
      </NumberInput.Hint>
    </NumberInput>
  );
}
