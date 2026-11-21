import { AspectRatio } from "@/components/core/AspectRatio";

export function AspectRatioMotionVarsDemo() {
  return (
    <AspectRatio ratio="16/9" motion={{ root: { enter: { y: -8, opacity: 0, duration: 0.35 } } }}><span>16/9</span></AspectRatio>
  );
}
