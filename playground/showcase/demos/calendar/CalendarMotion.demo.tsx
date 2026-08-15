import { CalendarMotionInstantHoverDemo } from "./CalendarMotionInstantHover.demo";
import { CalendarMotionNavTintDemo } from "./CalendarMotionNavTint.demo";
import { CalendarMotionNavWaveDemo } from "./CalendarMotionNavWave.demo";

export function CalendarMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-start gap-large">
      <CalendarMotionInstantHoverDemo />
      <CalendarMotionNavWaveDemo />
      <CalendarMotionNavTintDemo />
    </div>
  );
}
