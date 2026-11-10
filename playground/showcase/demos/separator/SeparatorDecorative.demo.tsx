import { Separator } from "@/components/core/Separator";
import { Text } from "@/components/core/Text";

export function SeparatorDecorativeDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-mid">
      <Text textStyle="small">Keeps the separator role</Text>
      <Separator />
      <Text textStyle="small">decorative hides it from assistive tech</Text>
      <Separator decorative />
    </div>
  );
}
