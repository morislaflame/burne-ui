import gsap from "gsap";

import { CloseButton } from "@/components/core/CloseButton";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function CloseButtonMotionIconTintDemo() {
  return (
    <CloseButton
      aria-label="Icon tint close"
      motion={{
        icon: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { rotate: 12, duration: 0.18 }, 0);
            tweenCssColor(ctx.el, "var(--color-danger)");
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { rotate: 0, duration: 0.16 }, 0);
            tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true });
            return tl;
          },
          pressIn: (ctx) =>
            gsap.to(ctx.el, { rotate: 90, scale: 0.82, duration: 0.16, ease: "back.out(1.8)", ...TL }),
          pressOut: (ctx) =>
            gsap.to(ctx.el, { rotate: 0, scale: 1, duration: 0.18, ease: "power2.inOut", ...TL }),
        },
      }}
    />
  );
}
