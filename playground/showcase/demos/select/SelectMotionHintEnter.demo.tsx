import { Select } from "@/components/core/Select";

const options = [
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

export function SelectMotionHintEnterDemo() {
  return (
    <Select
      className="w-64"
      options={options}
      defaultValue="pro"
      label="Plan"
      hint="You can change this later."
      error="Enterprise needs a contract."
      motion={{
        label: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26 }),
        },
        hint: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.06 },
            ),
        },
        error: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.1 },
            ),
        },
      }}
    />
  );
}
