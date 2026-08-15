import gsap from "gsap";

import { Link } from "@/components/core/Link";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

import { preventNav } from "../../shared/utils";

const TL = { overwrite: "auto" as const, force3D: false };

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
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: -1, duration: 0.18 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { y: 0, duration: 0.16 }, 0);
            tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true });
            return tl;
          },
        },
        icon: {
          pressIn: (ctx) =>
            gsap.to(ctx.el, { rotate: 90, scale: 0.88, duration: 0.16, ease: "back.out(1.8)", ...TL }),
          pressOut: (ctx) =>
            gsap.to(ctx.el, { rotate: 0, scale: 1, duration: 0.18, ease: "power2.inOut", ...TL }),
        },
      }}
    >
      Text tint
    </Link>
  );
}
