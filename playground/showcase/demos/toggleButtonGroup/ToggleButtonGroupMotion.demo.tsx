import { ToggleButtonGroupMotionInstantEnterDemo } from "./ToggleButtonGroupMotionInstantEnter.demo";
import { ToggleButtonGroupMotionRootWaveDemo } from "./ToggleButtonGroupMotionRootWave.demo";
import { ToggleButtonGroupMotionChangeTintDemo } from "./ToggleButtonGroupMotionChangeTint.demo";

export function ToggleButtonGroupMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <ToggleButtonGroupMotionInstantEnterDemo />
      <ToggleButtonGroupMotionRootWaveDemo />
      <ToggleButtonGroupMotionChangeTintDemo />
    </div>
  );
}
