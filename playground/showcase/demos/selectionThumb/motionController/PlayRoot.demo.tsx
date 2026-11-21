import { IoMoon } from "react-icons/io5";
import { Button } from "@/components/core/Button";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SelectionThumbMotionControllerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "hoverIn")}>Pulse</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("root", "hoverOut")}>Reset</Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0 })}>Snap</Button>
      </div>
      <SelectionThumb size="large" motionController={controller} motion={{ root: { hoverIn: { y: -6, duration: 0.28, replay: "rest" }, hoverOut: { y: 0, duration: 0.2 } } }}>
        <SelectionThumb.Icon><IoMoon aria-hidden /></SelectionThumb.Icon>
      </SelectionThumb>
    </div>
  );
}
