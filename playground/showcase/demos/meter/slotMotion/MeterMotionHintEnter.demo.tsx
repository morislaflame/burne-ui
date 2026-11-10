import { Meter } from "@/components/core/Meter";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function MeterMotionHintEnterDemo() {
  return (
    <Meter
      className="w-full max-w-sm"
      label="Storage"
      showValue
      value={72}
      hint="Includes drafts and cache."
      error="Upgrade before you hit the cap."
      motion={{
        label: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28 }),
        },
        hint: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.06 },
            ),
        },
        error: {
          enter: (ctx) => {
            const tl = ctx.timeline();
            tl.fromTo(ctx.el, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28 }, 0.1);
            tweenCssColor(ctx.el, "var(--color-danger)");
            return tl;
          },
        },
      }}
    />
  );
}
