import { AlertDialogMotionChromeSplitDemo } from "./AlertDialogMotionChromeSplit.demo";
import { AlertDialogMotionIndicatorPopDemo } from "./AlertDialogMotionIndicatorPop.demo";
import { AlertDialogMotionInstantPanelDemo } from "./AlertDialogMotionInstantPanel.demo";
import { AlertDialogMotionOverlayHoldDemo } from "./AlertDialogMotionOverlayHold.demo";

export function AlertDialogMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-center gap-mid">
      <AlertDialogMotionInstantPanelDemo />
      <AlertDialogMotionIndicatorPopDemo />
      <AlertDialogMotionChromeSplitDemo />
      <AlertDialogMotionOverlayHoldDemo />
    </div>
  );
}
