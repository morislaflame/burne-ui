import { Calendar } from "@/components/core/Calendar";

export function CalendarMotionFooterActionsDemo() {
  return (
    <Calendar
      motion={{
        footerToday: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22 }),
        },
        footerClear: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 6, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.22, delay: 0.06 },
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
