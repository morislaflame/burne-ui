import { useState } from "react";

import { Calendar } from "@/components/core/Calendar";

export function CalendarGlossDemo() {
  const [date, setDate] = useState<Date | null>(null);

  return <Calendar variant="gloss" mode="single" value={date} onValueChange={setDate} />;
}
