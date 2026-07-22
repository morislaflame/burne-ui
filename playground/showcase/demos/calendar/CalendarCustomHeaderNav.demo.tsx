import { Calendar, useCalendar } from "@/components/core/Calendar";

function CustomTitleLabel() {
  const { viewDate, view } = useCalendar();
  if (view === "years") {
    const start = Math.floor(viewDate.getFullYear() / 10) * 10;
    return (
      <span>
        {start}–{start + 9}
      </span>
    );
  }
  if (view === "months") {
    return <span>{viewDate.getFullYear()}</span>;
  }
  return (
    <span>
      {viewDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
    </span>
  );
}

export function CalendarCustomHeaderNavDemo() {
  return (
    <Calendar mode="single">
      <Calendar.Header>
        <Calendar.NavNext className="text-primary" />
        <Calendar.Title className="font-semibold text-primary">
          <CustomTitleLabel />
        </Calendar.Title>
        <Calendar.NavPrev className="text-primary" />
      </Calendar.Header>
      <Calendar.Grid />
    </Calendar>
  );
}
