import { CloseButton } from "@/components/core/CloseButton";

export function CloseButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-small">
      <CloseButton aria-label="Закрыть" />
      <CloseButton aria-label="Закрыть outline" variant="outline" />
    </div>
  );
}
