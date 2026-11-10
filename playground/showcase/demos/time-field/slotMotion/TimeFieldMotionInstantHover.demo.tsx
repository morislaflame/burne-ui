import { IoAlarmOutline, IoTimeOutline } from "react-icons/io5";

import { TimeField } from "@/components/core/TimeField";

export function TimeFieldMotionInstantHoverDemo() {
  return (
    <TimeField
      className="w-64"
      label="Instant hover"
      defaultValue="09:30"
      hint="shell.hoverIn / hoverOut: false"
      prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      suffix={<IoAlarmOutline className="icon-base shrink-0" aria-hidden />}
      motion={{
        shell: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}
