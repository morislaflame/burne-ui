import { useState } from "react";
import { IoTimeOutline } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import { TimeField } from "@/components/core/TimeField";

export function TimeFieldShiftWindowDemo() {
  const [value, setValue] = useState("09:30");

  return (
    <TimeField className="w-full max-w-xs">
      <TimeField.Label>Начало смены</TimeField.Label>
      <TimeField.Control
        variant="segmented"
        value={value}
        onValueChange={setValue}
        prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
        suffix={
          <Text as="span" variant="small" className="font-medium text-muted">
            МСК
          </Text>
        }
      />
      <TimeField.Hint>Segmented-сегменты + affixes внутри оболочки.</TimeField.Hint>
    </TimeField>
  );
}
