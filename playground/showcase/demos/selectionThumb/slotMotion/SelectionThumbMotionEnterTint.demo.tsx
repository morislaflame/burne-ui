import { SelectionThumb } from "@/components/core/SelectionThumb";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function SelectionThumbMotionEnterTintDemo() {
  return (
    <SelectionThumb
      motion={{
        root: {
          enter: (ctx) => {
            const tl = ctx.timeline();
            tl.fromTo(ctx.el, { rotate: -20 }, { rotate: 0, duration: 0.28 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    />
  );
}
