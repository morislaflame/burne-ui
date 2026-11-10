import { ProgressBar } from "@/components/core/ProgressBar";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "upload:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function ValuePulse() {
  const controller = useMotionController();
  return (
    <ProgressBar.Value onPointerEnter={() => controller.playSlot("value", "upload:nudge")} />
  );
}

export function ProgressBarMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <ProgressBar value={62} showValue motion={{ events }}>
        <ProgressBar.Header>
          <ProgressBar.Label>Hover the value</ProgressBar.Label>
          <ValuePulse />
        </ProgressBar.Header>
        <ProgressBar.Track value={62} />
      </ProgressBar>
    </div>
  );
}
