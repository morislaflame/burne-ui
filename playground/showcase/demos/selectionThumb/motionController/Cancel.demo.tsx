import { IoMoon } from "react-icons/io5";
import { Button } from "@/components/core/Button";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "thumb:pulse": (ctx) => ctx.fromRest({ y: -4, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" }) });

export function SelectionThumbMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("thumb:pulse")}>Loop</Button>
        <Button size="small" variant="ghost" onClick={() => { controller.cancel(); controller.set("root", { y: 0 }); }}>Cancel</Button>
      </div>
      <SelectionThumb size="large" motionController={controller} motion={{ events }}>
        <SelectionThumb.Icon><IoMoon aria-hidden /></SelectionThumb.Icon>
      </SelectionThumb>
    </div>
  );
}
