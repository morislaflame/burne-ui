import { CardMotionChromeSplitDemo } from "./CardMotionChromeSplit.demo";
import { CardMotionInstantHoverDemo } from "./CardMotionInstantHover.demo";
import { CardMotionPressBounceDemo } from "./CardMotionPressBounce.demo";
import { CardMotionTitlePopDemo } from "./CardMotionTitlePop.demo";

export function CardMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-stretch gap-mid">
      <CardMotionInstantHoverDemo />
      <CardMotionPressBounceDemo />
      <CardMotionTitlePopDemo />
      <CardMotionChromeSplitDemo />
    </div>
  );
}
