import { InputMotionAffixOrbitDemo } from "./InputMotionAffixOrbit.demo";
import { InputMotionFileRowExitDemo } from "./InputMotionFileRowExit.demo";
import { InputMotionInstantHoverDemo } from "./InputMotionInstantHover.demo";
import { InputMotionPasswordRevealDemo } from "./InputMotionPasswordReveal.demo";

export function InputMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <InputMotionInstantHoverDemo />
      <InputMotionAffixOrbitDemo />
      <InputMotionFileRowExitDemo />
      <InputMotionPasswordRevealDemo />
    </div>
  );
}
