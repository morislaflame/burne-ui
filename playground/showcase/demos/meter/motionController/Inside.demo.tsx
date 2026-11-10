import { Meter } from "@/components/core/Meter";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "quota:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function ValuePulse() {
  const controller = useMotionController();
  return (
    <Meter.Value onPointerEnter={() => controller.playSlot("value", "quota:nudge")} />
  );
}

export function MeterMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <Meter value={62} showValue motion={{ events }}>
        <Meter.Header>
          <Meter.Label>Hover the value</Meter.Label>
          <ValuePulse />
        </Meter.Header>
        <Meter.Track value={62} />
      </Meter>
    </div>
  );
}
