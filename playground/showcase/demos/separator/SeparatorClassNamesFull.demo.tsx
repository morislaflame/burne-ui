import { Separator } from "@/components/core/Separator";
import { Text } from "@/components/core/Text";

export function SeparatorClassNamesFullDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Text variant="small">Above</Text>
      <Separator className="border-t-danger" />
      <Text variant="small">Below</Text>
    </div>
  );
}
