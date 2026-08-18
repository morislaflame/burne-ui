import { Loading } from "@/components/core/Loading";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function LoadingMotionEnterTintDemo() {
  return (
    <Loading
      type="spinner"
      motion={{
        spinner: {
          enter: (ctx) => {
            const tl = ctx.timeline();
            tl.fromTo(ctx.el, { rotate: -40, opacity: 0 }, { rotate: 0, opacity: 1, duration: 0.35 }, 0);
            tweenCssColor(ctx.el, "var(--color-info)");
            return tl;
          },
        },
      }}
    />
  );
}
