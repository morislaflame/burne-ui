import { Kbd } from "@/components/core/Kbd";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "kbd:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function TextPulse() {
  const controller = useMotionController();
  return (
    <Kbd.Text size="base" onPointerEnter={() => controller.playSlot("text", "kbd:nudge")}>
      ⌘
    </Kbd.Text>
  );
}

export function KbdMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <Kbd hoverLift={false} motion={{ events }}>
        <TextPulse />
      </Kbd>
    </div>
  );
}
