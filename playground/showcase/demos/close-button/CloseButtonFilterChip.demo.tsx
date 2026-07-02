import { CloseButton } from "@/components/core/CloseButton";
import { Text } from "@/components/core/Text";

export function CloseButtonFilterChipDemo() {
  return (
    <div className="inline-flex items-center gap-small rounded-full border-token bg-tertiary py-xsmall pl-mid pr-xsmall shadow-token-base">
      <Text as="span" variant="small" className="text-muted">
        Фильтр: опубликовано
      </Text>
      <CloseButton
        aria-label="Сбросить фильтр"
        variant="outline"
        size="small"
        className="size-7 min-h-0 rounded-full border-0 bg-surface"
      />
    </div>
  );
}
