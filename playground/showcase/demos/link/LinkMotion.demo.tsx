import { LinkMotionInstantHoverDemo } from "./LinkMotionInstantHover.demo";
import { LinkMotionTextTintDemo } from "./LinkMotionTextTint.demo";
import { LinkMotionTextWaveDemo } from "./LinkMotionTextWave.demo";

export function LinkMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <LinkMotionInstantHoverDemo />
      <LinkMotionTextWaveDemo />
      <LinkMotionTextTintDemo />
    </div>
  );
}
