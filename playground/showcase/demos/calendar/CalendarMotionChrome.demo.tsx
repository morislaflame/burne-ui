import { Calendar } from "@/components/core/Calendar";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function CalendarMotionChromeDemo() {
  return (
    <Calendar
      motion={{
        header: {
          enter: (ctx) =>
            ctx.fromTo({ y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28 }),
        },
        headerTitle: {
          hoverIn: (ctx) => tweenCssColor(ctx.el, "var(--color-primary)", { duration: 0.2 }),
          hoverOut: (ctx) =>
            tweenCssColor(ctx.el, "var(--color-foreground)", {
              duration: 0.18,
              clearOnComplete: true,
            }),
        },
        cellText: {
          hoverIn: (ctx) => ctx.to({ y: -1, duration: 0.14 }),
          hoverOut: (ctx) => ctx.to({ y: 0, duration: 0.14 }),
        },
        footer: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.28, delay: 0.08 },
            ),
        },
      }}
    >
      <Calendar.Header />
      <Calendar.Grid />
      <Calendar.Footer />
    </Calendar>
  );
}
