import { ColorSlider } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "slider:nudge": { y: -4, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

function RootPulse() {
  const controller = useMotionController();
  return (
    <Text as="span" variant="small" className="text-muted" onPointerEnter={() => controller.playSlot("root", "slider:nudge")}>
      Hover label
    </Text>
  );
}

export function ColorSliderMotionControllerInsideDemo() {
  return (
    <ColorSlider className="w-full max-w-sm" channel="hue" motion={{ events }}>
      <RootPulse />
      <ColorSlider.Track channel="hue" defaultValue={180} />
    </ColorSlider>
  );
}
