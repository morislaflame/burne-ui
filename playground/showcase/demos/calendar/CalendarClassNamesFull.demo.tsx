import { Calendar } from "@/components/core/Calendar";

export function CalendarClassNamesFullDemo() {
  return (
    <Calendar
      selectionMode="single"
      classNames={{
        root: "rounded-large border-info/40 bg-info/5",
        header: "gap-small",
        title: "font-semibold text-info",
        navPrev: "text-info",
        navNext: "text-info",
        navIconWrap: "text-info",
        weekdayCell: "text-info/70",
        dayEmpty: "opacity-40",
        day: "rounded-full",
        cellFill: "rounded-full bg-info",
        cellTodayDot: "bg-info",
        footer: "border-info/30",
        footerToday: "text-info",
      }}
    >
      <Calendar.Header />
      <Calendar.Grid />
      <Calendar.Footer />
    </Calendar>
  );
}
