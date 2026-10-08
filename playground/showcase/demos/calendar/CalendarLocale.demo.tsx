import { Calendar } from "@/components/core/Calendar";
import { Text } from "@/components/core/Text";

const OCTOBER = new Date(2026, 9, 1);

export function CalendarLocaleDemo() {
  return (
    <div className="flex flex-wrap items-start gap-2xlarge">
      <div className="flex flex-col items-start gap-large">
        <Text as="span" variant="small" className="font-medium">
          en-GB
        </Text>
        <Calendar locale="en-GB" defaultMonth={OCTOBER}>
          <Calendar.Header />
          <Calendar.Grid />
          <Calendar.Footer />
        </Calendar>
      </div>
      <div className="flex flex-col items-start gap-large">
        <Text as="span" variant="small" className="font-medium">
          ru
        </Text>
        <Calendar locale="ru" defaultMonth={OCTOBER}>
          <Calendar.Header />
          <Calendar.Grid />
          <Calendar.Footer />
        </Calendar>
      </div>
    </div>
  );
}
