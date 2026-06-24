import { useState } from "react";
import { IoTimeOutline } from "react-icons/io5";

import { TimeField } from "@/components/core/TimeField";

export function TimeFieldSimpleDemo() {
  const [timeValue, setTimeValue] = useState("09:30");

  return (
    <TimeField
      label="Начало смены"
      hint="Формат: ЧЧ:ММ (24 часа)"
      value={timeValue}
      onValueChange={setTimeValue}
      prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      className="w-64"
    />
  );
}
