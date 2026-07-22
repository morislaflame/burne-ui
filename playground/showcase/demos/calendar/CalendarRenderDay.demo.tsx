import { Calendar } from "@/components/core/Calendar";

const eventDays = new Set([3, 12, 18, 25]);

export function CalendarRenderDayDemo() {
  return (
    <Calendar
      mode="single"
      renderDay={(date, { day, selected }) => (
        <span className="relative inline-flex flex-col items-center gap-[2px]">
          <span>{day}</span>
          {eventDays.has(date.getDate()) ? (
            <span
              aria-hidden
              className={
                selected
                  ? "h-1 w-1 rounded-full bg-primary-foreground"
                  : "h-1 w-1 rounded-full bg-primary"
              }
            />
          ) : null}
        </span>
      )}
    />
  );
}
