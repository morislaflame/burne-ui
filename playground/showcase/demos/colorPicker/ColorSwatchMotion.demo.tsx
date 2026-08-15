import { ColorSwatchMotionInstantHoverDemo } from "./ColorSwatchMotionInstantHover.demo";
import { ColorSwatchMotionPressSpinDemo } from "./ColorSwatchMotionPressSpin.demo";
import { ColorSwatchMotionPulseDemo } from "./ColorSwatchMotionPulse.demo";

export function ColorSwatchMotionDemo() {
  return (
    <div className="flex w-full items-center gap-large">
      <ColorSwatchMotionInstantHoverDemo />
      <ColorSwatchMotionPulseDemo />
      <ColorSwatchMotionPressSpinDemo />
    </div>
  );
}
