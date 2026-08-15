import { ButtonMotionCompoundPartsDemo } from "./ButtonMotionCompoundParts.demo";
import { ButtonMotionDefaultDemo } from "./ButtonMotionDefault.demo";
import { ButtonMotionHoverYDemo } from "./ButtonMotionHoverY.demo";
import { ButtonMotionIconColorDemo } from "./ButtonMotionIconColor.demo";
import { ButtonMotionNoPressDemo } from "./ButtonMotionNoPress.demo";
import { ButtonMotionWiggleDemo } from "./ButtonMotionWiggle.demo";

export function ButtonMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <div className="flex flex-wrap items-center gap-mid">
        <ButtonMotionDefaultDemo />
        <ButtonMotionNoPressDemo />
        <ButtonMotionHoverYDemo />
      </div>
      <ButtonMotionWiggleDemo />
      <ButtonMotionIconColorDemo />
      <ButtonMotionCompoundPartsDemo />
    </div>
  );
}
