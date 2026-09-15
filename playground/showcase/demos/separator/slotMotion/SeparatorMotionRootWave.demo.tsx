import { Separator } from "@/components/core/Separator";

export function SeparatorMotionRootWaveDemo() {
  return (
    <Separator
      className="w-full"
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ scaleX: 0.2, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.4 }),
        },
      }}
    />
  );
}
