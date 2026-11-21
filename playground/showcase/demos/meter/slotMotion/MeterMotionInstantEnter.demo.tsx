import { Meter } from "@/components/core/Meter";

export function MeterMotionInstantEnterDemo() {
  return <Meter label="Storage" value={42} showValue motion={{ track: { enter: false } }} />;
}
