import { CloseButton } from "@/components/core/CloseButton";

export function CloseButtonSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-small">
      <CloseButton aria-label="Small" size="small" variant="outline" />
      <CloseButton aria-label="Base" size="base" variant="outline" />
      <CloseButton aria-label="Mid" size="mid" variant="outline" />
      <CloseButton aria-label="Large" size="large" variant="outline" />
    </div>
  );
}
