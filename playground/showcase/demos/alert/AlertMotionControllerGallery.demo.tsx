import { AlertMotionControllerCancelDemo } from "./AlertMotionControllerCancel.demo";
import { AlertMotionControllerDemo } from "./AlertMotionController.demo";
import { AlertMotionControllerExcludeDemo } from "./AlertMotionControllerExclude.demo";
import { AlertMotionControllerInsideDemo } from "./AlertMotionControllerInside.demo";
import { AlertMotionControllerPlayVsSlotDemo } from "./AlertMotionControllerPlayVsSlot.demo";
import { AlertMotionControllerSignalDemo } from "./AlertMotionControllerSignal.demo";
import { AlertMotionControllerStaggerDemo } from "./AlertMotionControllerStagger.demo";
import { AlertMotionEventsFinishedDemo } from "./AlertMotionEventsFinished.demo";
import { AlertMotionEventsOffDemo } from "./AlertMotionEventsOff.demo";
import { AlertMotionEventsPingDemo } from "./AlertMotionEventsPing.demo";
import { AlertMotionEventsSaveDemo } from "./AlertMotionEventsSave.demo";
import { AlertMotionEventsTargetsDemo } from "./AlertMotionEventsTargets.demo";

export function AlertMotionControllerGalleryDemo() {
  return (
    <div className="flex w-full flex-col gap-2xlarge">
      <AlertMotionControllerDemo />
      <AlertMotionControllerPlayVsSlotDemo />
      <AlertMotionControllerInsideDemo />
      <AlertMotionControllerStaggerDemo />
      <AlertMotionControllerExcludeDemo />
      <AlertMotionControllerCancelDemo />
      <AlertMotionControllerSignalDemo />
      <AlertMotionEventsPingDemo />
      <AlertMotionEventsSaveDemo />
      <AlertMotionEventsFinishedDemo />
      <AlertMotionEventsTargetsDemo />
      <AlertMotionEventsOffDemo />
    </div>
  );
}
