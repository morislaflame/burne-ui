import { Text } from "@/components/core/Text";

export function TextClassNamesFullDemo() {
  return (
    <div className="flex max-w-sm flex-col items-start gap-small">
      <Text variant="header-2" className="text-primary">
        Primary heading
      </Text>
      <Text variant="base" className="text-muted">
        Text is one node. Color and measure come from className.
      </Text>
    </div>
  );
}
