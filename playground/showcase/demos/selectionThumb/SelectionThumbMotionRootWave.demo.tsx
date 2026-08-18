import { SelectionThumb } from "@/components/core/SelectionThumb";

export function SelectionThumbMotionRootWaveDemo() {
  return (
    <SelectionThumb
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.28 }),
          hoverIn: { y: -3, duration: 0.16 },
          hoverOut: { y: 0, duration: 0.14 },
        },
      }}
    />
  );
}
