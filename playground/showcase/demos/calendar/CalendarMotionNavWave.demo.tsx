import gsap from "gsap";

import { Calendar } from "@/components/core/Calendar";

const TL = { overwrite: "auto" as const, force3D: false };

export function CalendarMotionNavWaveDemo() {
  return (
    <Calendar
      motion={{
        navPrev: {
          hoverIn: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { x: -3, rotate: -8, duration: 0.2 }, 0);
            if (ctx.targets.navNext) {
              tl.to(ctx.targets.navNext, { x: 3, rotate: 8, duration: 0.2 }, 0);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.to(ctx.el, { x: 0, rotate: 0, duration: 0.16 }, 0);
            if (ctx.targets.navNext) {
              tl.to(ctx.targets.navNext, { x: 0, rotate: 0, duration: 0.16 }, 0);
            }
            return tl;
          },
        },
      }}
    />
  );
}
