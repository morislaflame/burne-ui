import { IoMoon } from "react-icons/io5";
import { Button } from "@/components/core/Button";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function SelectionThumbMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn", { stagger: 0.08 })}>Stagger</Button>
      <SelectionThumb size="large" motionController={controller} motion={{ root: { hoverIn: { y: -4, duration: 0.28, replay: "rest" } }, icon: { hoverIn: (ctx) => ctx.fromRest({ rotation: 18, duration: 0.28 }) } }}>
        <SelectionThumb.Icon><IoMoon aria-hidden /></SelectionThumb.Icon>
      </SelectionThumb>
    </div>
  );
}
