import { FormMotionInstantEnterDemo } from "./FormMotionInstantEnter.demo";
import { FormMotionRootWaveDemo } from "./FormMotionRootWave.demo";
import { FormMotionErrorChangeDemo } from "./FormMotionErrorChange.demo";

export function FormMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <FormMotionInstantEnterDemo />
      <FormMotionRootWaveDemo />
      <FormMotionErrorChangeDemo />
    </div>
  );
}
