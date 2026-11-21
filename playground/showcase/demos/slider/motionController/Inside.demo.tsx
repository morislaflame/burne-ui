import { Slider } from "@/components/core/Slider";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "slider:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function ValuePulse() {
  const controller = useMotionController();
  return (
    <Slider.Value onPointerEnter={() => controller.playSlot("value", "slider:nudge")} />
  );
}

export function SliderMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <Slider defaultValue={55} showValue motion={{ events }}>
        <Slider.Header>
          <Slider.Label>Hover the value</Slider.Label>
          <ValuePulse />
        </Slider.Header>
        <Slider.Track defaultValue={55} />
      </Slider>
    </div>
  );
}
