import { CardMotionControllerExcludeDemo } from "./CardMotionControllerExclude.demo";
import { CardMotionControllerHighlightDemo } from "./CardMotionControllerHighlight.demo";
import { CardMotionControllerInsideDemo } from "./CardMotionControllerInside.demo";
import { CardMotionControllerSetDemo } from "./CardMotionControllerSet.demo";
import { CardMotionControllerStaggerDemo } from "./CardMotionControllerStagger.demo";
import { CardMotionEventsCancelDemo } from "./CardMotionEventsCancel.demo";
import { CardMotionEventsCheckoutDemo } from "./CardMotionEventsCheckout.demo";
import { CardMotionEventsFinishedDemo } from "./CardMotionEventsFinished.demo";
import { CardMotionEventsPressableDemo } from "./CardMotionEventsPressable.demo";

export function CardMotionControllerGalleryDemo() {
  return (
    <div className="flex w-full flex-col gap-2xlarge">
      <CardMotionEventsCheckoutDemo />
      <CardMotionEventsFinishedDemo />
      <CardMotionEventsCancelDemo />
      <CardMotionEventsPressableDemo />
      <CardMotionControllerInsideDemo />
      <CardMotionControllerHighlightDemo />
      <CardMotionControllerStaggerDemo />
      <CardMotionControllerExcludeDemo />
      <CardMotionControllerSetDemo />
    </div>
  );
}
