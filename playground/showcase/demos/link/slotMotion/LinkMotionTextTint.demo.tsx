import { Link } from "@/components/core/Link";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

import { preventNav } from "../../../shared/utils";

export function LinkMotionTextTintDemo() {
  return (
    <Link
      href="#"
      onClick={preventNav}
      underline
      showDefaultIcon
      motion={{
        text: {
          hoverIn: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { y: -1, duration: 0.18 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { y: 0, duration: 0.16 }, 0);
            tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true });
            return tl;
          },
        },
        icon: {
          pressIn: (ctx) =>
            ctx.to({ rotate: 90, scale: 0.88, duration: 0.16, ease: "back.out(1.8)" }),
          pressOut: (ctx) =>
            ctx.to({ rotate: 0, scale: 1, duration: 0.18, ease: "power2.inOut" }),
        },
      }}
    >
      Text tint
    </Link>
  );
}
