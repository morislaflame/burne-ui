import { Select } from "@/components/core/Select";

const options = [
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

export function SelectMotionMenuEnterDemo() {
  return (
    <Select
      className="w-64"
      items={options}
      defaultValue="pro"
      defaultOpen
      label="Plan"
      motion={{
        popover: {
          enter: (ctx) =>
            ctx.fromTo({ y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }),
          leave: (ctx) => ctx.to({ y: 8, opacity: 0, duration: 0.2 }),
        },
      }}
    />
  );
}
