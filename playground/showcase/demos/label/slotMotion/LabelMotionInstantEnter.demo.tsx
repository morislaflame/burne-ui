import { Label } from "@/components/core/Label";

export function LabelMotionInstantEnterDemo() {
  return <Label required motion={{ root: { enter: false } }}>Instant enter</Label>;
}
