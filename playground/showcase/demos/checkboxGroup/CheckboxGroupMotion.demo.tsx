import { CheckboxGroupMotionInstantEnterDemo } from "./CheckboxGroupMotionInstantEnter.demo";
import { CheckboxGroupMotionRootWaveDemo } from "./CheckboxGroupMotionRootWave.demo";
import { CheckboxGroupMotionChangeTintDemo } from "./CheckboxGroupMotionChangeTint.demo";

export function CheckboxGroupMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <CheckboxGroupMotionInstantEnterDemo />
      <CheckboxGroupMotionRootWaveDemo />
      <CheckboxGroupMotionChangeTintDemo />
    </div>
  );
}
