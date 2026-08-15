import { AlertMotionCompoundTitleDemo } from "./AlertMotionCompoundTitle.demo";
import { AlertMotionOrchestratedDemo } from "./AlertMotionOrchestrated.demo";
import { AlertMotionPerPartDemo } from "./AlertMotionPerPart.demo";
import { AlertMotionTimelineDemo } from "./AlertMotionTimeline.demo";
import { AlertMotionTitleColorDemo } from "./AlertMotionTitleColor.demo";
import { AlertMotionTitleLiftDemo } from "./AlertMotionTitleLift.demo";

export function AlertMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <AlertMotionTitleLiftDemo />
      <AlertMotionCompoundTitleDemo />
      <AlertMotionOrchestratedDemo />
      <AlertMotionTitleColorDemo />
      <AlertMotionPerPartDemo />
      <AlertMotionTimelineDemo />
    </div>
  );
}
