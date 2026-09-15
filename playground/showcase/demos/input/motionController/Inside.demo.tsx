import { Input } from "@/components/core/Input";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "input:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function PrefixPulse() {
  const controller = useMotionController();
  return (
    <span onPointerEnter={() => controller.playSlot("prefix", "input:nudge")}>@</span>
  );
}

export function InputMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <Input
        label="Hover the prefix"
        prefix={<PrefixPulse />}
        placeholder="name"
        motion={{ events }}
      />
    </div>
  );
}
