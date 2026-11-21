import { ComboBox } from "@/components/core/ComboBox";

const options = [
  { value: "berlin", label: "Berlin" },
  { value: "lisbon", label: "Lisbon" },
  { value: "tokyo", label: "Tokyo" },
];

export function ComboBoxMotionMenuEnterDemo() {
  return (
    <ComboBox
      className="w-64"
      items={options}
      defaultValue="lisbon"
      defaultOpen
      label="City"
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
