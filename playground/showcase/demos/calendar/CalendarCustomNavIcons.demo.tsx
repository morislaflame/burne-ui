import { IoArrowBack, IoArrowForward } from "react-icons/io5";

import { Calendar } from "@/components/core/Calendar";

export function CalendarCustomNavIconsDemo() {
  return (
    <Calendar
      selectionMode="single"
      previousIcon={<IoArrowBack aria-hidden className="icon-xsmall text-primary" />}
      nextIcon={<IoArrowForward aria-hidden className="icon-xsmall text-primary" />}
    />
  );
}
