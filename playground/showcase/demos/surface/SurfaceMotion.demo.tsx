import { SurfaceMotionInstantEnterDemo } from "./SurfaceMotionInstantEnter.demo";
import { SurfaceMotionRootWaveDemo } from "./SurfaceMotionRootWave.demo";
import { SurfaceMotionEnterTintDemo } from "./SurfaceMotionEnterTint.demo";

export function SurfaceMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <SurfaceMotionInstantEnterDemo />
      <SurfaceMotionRootWaveDemo />
      <SurfaceMotionEnterTintDemo />
    </div>
  );
}
