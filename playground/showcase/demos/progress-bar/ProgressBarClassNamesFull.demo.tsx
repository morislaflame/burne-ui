import { ProgressBar } from "@/components/core/ProgressBar";

export function ProgressBarClassNamesFullDemo() {
  return (
    <ProgressBar
      label="Загрузка файла"
      hint="Оставшееся время зависит от скорости сети"
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
