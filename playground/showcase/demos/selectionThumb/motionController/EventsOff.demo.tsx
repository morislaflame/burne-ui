import { IoMoon } from "react-icons/io5";
import { Button } from "@/components/core/Button";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({ "thumb:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });
const off = createMotionEvents({ "thumb:nudge": false });

export function SelectionThumbMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("thumb:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("thumb:nudge")}>Off</Button>
      </div>
      <div className="flex items-center gap-large">
        <SelectionThumb size="large" motionController={liveController} motion={{ events: live }}>
          <SelectionThumb.Icon><IoMoon aria-hidden /></SelectionThumb.Icon>
        </SelectionThumb>
        <SelectionThumb size="large" motionController={offController} motion={{ events: off }}>
          <SelectionThumb.Icon><IoMoon aria-hidden /></SelectionThumb.Icon>
        </SelectionThumb>
      </div>
    </div>
  );
}
