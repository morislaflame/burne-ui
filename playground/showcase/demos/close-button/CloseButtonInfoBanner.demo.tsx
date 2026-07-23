import { CloseButton } from "@/components/core/CloseButton";
import { Text } from "@/components/core/Text";

export function CloseButtonInfoBannerDemo() {
  return (
    <div className="flex w-full max-w-md items-start gap-large rounded-mid border-l-4 border-info bg-info/10 p-large">
      <div className="min-w-0 flex-1">
        <Text as="p" variant="base" className="font-medium text-info">
          New version available
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Update CLI, to get gloss-topic.
        </Text>
      </div>
      <CloseButton
        aria-label="Hide notification"
        variant="ghost"
        size="small"
        className="shrink-0 text-info hover:bg-info/15"
      />
    </div>
  );
}
