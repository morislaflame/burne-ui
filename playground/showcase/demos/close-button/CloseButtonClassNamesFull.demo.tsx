import { CloseButton } from "@/components/core/CloseButton";

export function CloseButtonClassNamesFullDemo() {
  return (
    <CloseButton
      variant="outline"
      size="mid"
      classNames={{
        root: "border-info/50 bg-info/5 shadow-token-base hover:bg-info/10",
        icon: "text-info",
      }}
      aria-label="Закрыть с кастомными classNames"
    />
  );
}
