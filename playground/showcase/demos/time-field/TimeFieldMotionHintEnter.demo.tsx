import { TimeField } from "@/components/core/TimeField";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function TimeFieldMotionHintEnterDemo() {
  return (
    <TimeField
      className="w-72"
      label="Shift start"
      hint="24-hour format."
      error="Must be a valid time."
      defaultValue="09:30"
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
