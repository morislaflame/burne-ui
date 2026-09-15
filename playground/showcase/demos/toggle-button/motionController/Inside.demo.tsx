import { ToggleButton } from "@/components/core/ToggleButton";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";
import { IoHeartOutline } from "react-icons/io5";

const events = createMotionEvents({
  "like:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function HeartIcon() {
  const controller = useMotionController();
  return (
    <ToggleButton.IconStart onPointerEnter={() => controller.play("like:nudge")}>
      <IoHeartOutline aria-hidden />
    </ToggleButton.IconStart>
  );
}

export function ToggleButtonMotionControllerInsideDemo() {
  return (
    <ToggleButton
      variant="outline"
      motion={{ events, root: { pressIn: false } }}
    >
      <HeartIcon />
      <ToggleButton.Text>Hover the icon</ToggleButton.Text>
    </ToggleButton>
  );
}
