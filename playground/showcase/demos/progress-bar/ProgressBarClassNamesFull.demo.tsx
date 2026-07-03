import { ProgressBar } from "@/components/core/ProgressBar";

export function ProgressBarClassNamesFullDemo() {
  return (
    <ProgressBar
      label="Uploading a file"
      hint="The remaining time depends on the network speed"
      showValue
      value={72}
      color="var(--color-primary)"
      classNames={{
        root: "rounded-mid border border-primary/25 p-base",
        value: "text-primary font-semibold",
        track: "bg-primary/10",
        fill: "opacity-95",
        hint: "text-muted/80",
      }}
    />
  );
}
