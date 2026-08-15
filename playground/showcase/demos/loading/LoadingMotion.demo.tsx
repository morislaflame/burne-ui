import { LoadingMotionInstantEnterDemo } from "./LoadingMotionInstantEnter.demo";
import { LoadingMotionRootWaveDemo } from "./LoadingMotionRootWave.demo";
import { LoadingMotionEnterTintDemo } from "./LoadingMotionEnterTint.demo";

export function LoadingMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <LoadingMotionInstantEnterDemo />
      <LoadingMotionRootWaveDemo />
      <LoadingMotionEnterTintDemo />
    </div>
  );
}
