import { IoTimeOutline } from "react-icons/io5";

import { TimeField } from "@/components/core/TimeField";

export function TimeFieldCompoundSegmentedDemo() {
  return (
    <div className="flex flex-col gap-mid items-center w-full">
      <TimeField status="default" className="w-64" compact>
        <TimeField.Label>End of shift (compound)</TimeField.Label>
        <TimeField.Control
          defaultValue="18:00"
          prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
        />
        <TimeField.Hint>24-hour format</TimeField.Hint>
      </TimeField>
      <TimeField
        label="Segmented"
        variant="segmented"
        defaultValue="14:30"
        hint="Segmented input"
        className="w-64"
      />
    </div>
  );
}
