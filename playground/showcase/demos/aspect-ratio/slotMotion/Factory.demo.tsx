import { AspectRatio } from "@/components/core/AspectRatio";

export function AspectRatioMotionFactoryDemo() {
  return (
    <AspectRatio ratio="16/9" motion={{ content: { enter: (ctx) => ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }) } }}><span>16/9</span></AspectRatio>
  );
}
