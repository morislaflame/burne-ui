import { TextArea } from "@/components/core/TextArea";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "area:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function HintPulse() {
  const controller = useMotionController();
  return (
    <TextArea.Hint onPointerEnter={() => controller.playSlot("hint", "area:nudge")}>
      Hover the hint
    </TextArea.Hint>
  );
}

export function TextAreaMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <TextArea motion={{ events }}>
        <TextArea.Label>Note</TextArea.Label>
        <TextArea.Control placeholder="Write a note…" rows={2} />
        <HintPulse />
      </TextArea>
    </div>
  );
}
