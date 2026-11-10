import { IoMoon } from "react-icons/io5";
import { Button } from "@/components/core/Button";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SelectionThumbMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("hoverIn")}>play()</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("icon", "hoverIn")}>playSlot(icon)</Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>playAll()</Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>Reset</Button>
      </div>
      <SelectionThumb size="large" motionController={controller} motion={{ root: { hoverIn: { y: -4, duration: 0.28, replay: "rest" }, hoverOut: { y: 0, duration: 0.2 } }, icon: { hoverIn: (ctx) => ctx.fromRest({ rotation: 18, duration: 0.28 }), hoverOut: (ctx) => ctx.to({ rotation: 0, duration: 0.2 }) } }}>
        <SelectionThumb.Icon><IoMoon aria-hidden /></SelectionThumb.Icon>
      </SelectionThumb>
    </div>
  );
}
