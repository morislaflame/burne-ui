import { TimeField } from "@/components/core/TimeField";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "time:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function PrefixPulse() {
  const controller = useMotionController();
  return (
    <span onPointerEnter={() => controller.playSlot("prefix", "time:nudge")}>@</span>
  );
}

export function TimeFieldMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <TimeField
        label="Hover the prefix"
        defaultValue="09:30"
        prefix={<PrefixPulse />}
        motion={{ events }}
      />
    </div>
  );
}
