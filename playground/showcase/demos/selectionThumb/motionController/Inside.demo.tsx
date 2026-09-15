import { IoMoon } from "react-icons/io5";
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "thumb:nudge": { rotation: 16, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

function IconPulse() {
  const controller = useMotionController();
  return (
    <SelectionThumb.Icon onPointerEnter={() => controller.playSlot("icon", "thumb:nudge")}>
      <IoMoon aria-hidden />
    </SelectionThumb.Icon>
  );
}

export function SelectionThumbMotionControllerInsideDemo() {
  return (
    <SelectionThumb size="large" motion={{ events }}>
      <IconPulse />
    </SelectionThumb>
  );
}
