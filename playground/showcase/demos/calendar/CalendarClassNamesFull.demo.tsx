import { Calendar } from "@/components/core/Calendar";

export function CalendarClassNamesFullDemo() {
  return (
    <Calendar
      mode="single"
      classNames={{
        root: "rounded-large border-info/40 bg-info/5",
        header: "gap-small",
        headerTitle: "font-semibold text-info",
        navPrev: "text-info",
        navNext: "text-info",
        weekdayCell: "text-info/70",
        dayCell: "rounded-full",
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
