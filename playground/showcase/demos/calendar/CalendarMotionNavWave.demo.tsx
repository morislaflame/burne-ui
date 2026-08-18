import { Calendar } from "@/components/core/Calendar";

export function CalendarMotionNavWaveDemo() {
  return (
    <Calendar
      motion={{
        navPrev: {
          hoverIn: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { x: -3, rotate: -8, duration: 0.2 }, 0);
            if (ctx.targets.navNext) {
              tl.to(ctx.targets.navNext, { x: 3, rotate: 8, duration: 0.2 }, 0);
            }
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = ctx.timeline();
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
