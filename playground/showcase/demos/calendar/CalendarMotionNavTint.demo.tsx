import gsap from "gsap";

import { Calendar } from "@/components/core/Calendar";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function CalendarMotionNavTintDemo() {
  return (
    <Calendar>
      <Calendar.Header>
        <Calendar.NavPrev
          motion={{
            hoverIn: (ctx) => {
              const tl = gsap.timeline({ ...TL });
              tl.to(ctx.el, { x: -2, duration: 0.16 }, 0);
              tweenCssColor(ctx.el, "var(--color-primary)");
              return tl;
            },
            hoverOut: (ctx) => {
              const tl = gsap.timeline({ ...TL });
              tl.to(ctx.el, { x: 0, duration: 0.14 }, 0);
              tweenCssColor(ctx.el, "var(--color-foreground)", { clearOnComplete: true });
              return tl;
            },
          }}
        />
        <Calendar.Title />
        <Calendar.NavNext
          motion={{
            pressIn: (ctx) =>
              gsap.to(ctx.el, { rotate: 12, scale: 0.88, duration: 0.16, ease: "back.out(1.8)", ...TL }),
            pressOut: (ctx) =>
              gsap.to(ctx.el, { rotate: 0, scale: 1, duration: 0.18, ease: "power2.inOut", ...TL }),
          }}
        />
      </Calendar.Header>
      <Calendar.Grid />
    </Calendar>
  );
}
