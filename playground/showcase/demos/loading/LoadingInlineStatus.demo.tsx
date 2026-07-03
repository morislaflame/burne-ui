import { Loading } from "@/components/core/Loading";
import { Text } from "@/components/core/Text";

export function LoadingInlineStatusDemo() {
  return (
    <div className="flex w-full max-w-sm items-center gap-mid rounded-mid border-token bg-secondary px-mid py-small">
      <Loading size="small" color="info" />
      <div className="min-w-0">
        <Text as="p" variant="small" className="font-medium">
          Sync Theme
        </Text>
        <Text as="p" variant="tools" className="text-muted">
          Usually takes a few seconds
        </Text>
      </div>
    </div>
  );
}
