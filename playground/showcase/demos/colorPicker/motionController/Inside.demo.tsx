import { ColorPicker } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "picker:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function HexPulse() {
  const controller = useMotionController();
  return (
    <ColorPicker.HexInput onPointerEnter={() => controller.playSlot("hexInput", "picker:nudge")} />
  );
}

export function ColorPickerMotionControllerInsideDemo() {
  return (
    <div className="flex min-h-[28rem] w-full max-w-sm flex-col">
      <ColorPicker open defaultValue="#3b82f6" motion={{ events }}>
        <ColorPicker.Trigger />
        <ColorPicker.Content>
          <ColorPicker.Area />
          <HexPulse />
        </ColorPicker.Content>
      </ColorPicker>
    </div>
  );
}
