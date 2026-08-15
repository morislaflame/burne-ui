import { SkeletonMotionInstantEnterDemo } from "./SkeletonMotionInstantEnter.demo";
import { SkeletonMotionRootWaveDemo } from "./SkeletonMotionRootWave.demo";
import { SkeletonMotionRegionEnterDemo } from "./SkeletonMotionRegionEnter.demo";

export function SkeletonMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <SkeletonMotionInstantEnterDemo />
      <SkeletonMotionRootWaveDemo />
      <SkeletonMotionRegionEnterDemo />
    </div>
  );
}
