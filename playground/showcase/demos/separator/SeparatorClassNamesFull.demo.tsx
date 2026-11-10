import { Separator } from "@/components/core/Separator";
import { Text } from "@/components/core/Text";

export function SeparatorClassNamesFullDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Text textStyle="small">Above</Text>
      <Separator className="border-t-danger" />
      <Text textStyle="small">Below</Text>
    </div>
  );
}
