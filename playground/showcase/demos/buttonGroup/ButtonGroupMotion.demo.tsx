import { ButtonGroupMotionInstantEnterDemo } from "./ButtonGroupMotionInstantEnter.demo";
import { ButtonGroupMotionRootWaveDemo } from "./ButtonGroupMotionRootWave.demo";
import { ButtonGroupMotionTextTintDemo } from "./ButtonGroupMotionTextTint.demo";

export function ButtonGroupMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <ButtonGroupMotionInstantEnterDemo />
      <ButtonGroupMotionRootWaveDemo />
      <ButtonGroupMotionTextTintDemo />
    </div>
  );
}
