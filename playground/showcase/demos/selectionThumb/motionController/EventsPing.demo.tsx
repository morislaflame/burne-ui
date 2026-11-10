import { IoMoon } from "react-icons/io5";
import { Button } from "@/components/core/Button";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "thumb:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

export function SelectionThumbMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("thumb:nudge")}>Nudge</Button>
      <SelectionThumb size="large" motionController={controller} motion={{ events }}>
        <SelectionThumb.Icon><IoMoon aria-hidden /></SelectionThumb.Icon>
      </SelectionThumb>
    </div>
  );
}
