import { NumberInput } from "@/components/core/NumberInput";

export function NumberInputMotionWaveDemo() {
  return (
    <NumberInput
      label="Quantity"
      defaultValue={1}
      motion={{
        shell: {
          hoverIn: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { y: -2, duration: 0.22 }, 0);
            if (ctx.targets.decrement) tl.to(ctx.targets.decrement, { y: -4, duration: 0.2 }, 0);
            if (ctx.targets.control) tl.to(ctx.targets.control, { scale: 1.06, duration: 0.2 }, 0.04);
            if (ctx.targets.increment) tl.to(ctx.targets.increment, { y: -4, duration: 0.2 }, 0.08);
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { y: 0, duration: 0.18 }, 0);
            if (ctx.targets.decrement) tl.to(ctx.targets.decrement, { y: 0, duration: 0.16 }, 0);
            if (ctx.targets.control) tl.to(ctx.targets.control, { scale: 1, duration: 0.16 }, 0);
            if (ctx.targets.increment) tl.to(ctx.targets.increment, { y: 0, duration: 0.16 }, 0);
            return tl;
          },
        },
      }}
    />
  );
}
