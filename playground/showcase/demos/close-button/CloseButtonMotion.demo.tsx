import { CloseButtonMotionIconTintDemo } from "./CloseButtonMotionIconTint.demo";
import { CloseButtonMotionIconWaveDemo } from "./CloseButtonMotionIconWave.demo";
import { CloseButtonMotionInstantHoverDemo } from "./CloseButtonMotionInstantHover.demo";

export function CloseButtonMotionDemo() {
  return (
    <div className="flex w-full items-center gap-large">
      <CloseButtonMotionInstantHoverDemo />
      <CloseButtonMotionIconWaveDemo />
      <CloseButtonMotionIconTintDemo />
    </div>
  );
}
