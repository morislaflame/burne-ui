import { Separator } from "@/components/core/Separator";

export function SeparatorMotionInstantEnterDemo() {
  return <Separator className="w-full" motion={{ root: { enter: false } }} />;
}
