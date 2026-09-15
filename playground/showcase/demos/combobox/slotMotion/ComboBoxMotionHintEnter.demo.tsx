import { ComboBox } from "@/components/core/ComboBox";

const options = [
  { value: "berlin", label: "Berlin" },
  { value: "lisbon", label: "Lisbon" },
  { value: "tokyo", label: "Tokyo" },
];

export function ComboBoxMotionHintEnterDemo() {
  return (
    <ComboBox
      className="w-64"
      options={options}
      defaultValue="lisbon"
      label="City"
      hint="Type to filter."
      error="Unknown city."
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
