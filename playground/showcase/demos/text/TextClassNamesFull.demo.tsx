import { Text } from "@/components/core/Text";

export function TextClassNamesFullDemo() {
  return (
    <div className="flex max-w-sm flex-col items-start gap-small">
      <Text textStyle="header-2" className="text-primary">
        Primary heading
      </Text>
      <Text textStyle="base" className="text-muted">
        Text is one node. Color and measure come from className.
      </Text>
    </div>
  );
}
