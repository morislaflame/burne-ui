import { Button } from "@/components/core/Button";
import { ColorPicker } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "picker:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ColorPickerMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[28rem] w-full max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("contentPanel", "picker:nudge")}>
        Nudge
      </Button>
      <ColorPicker open defaultValue="#3b82f6" motionController={controller} motion={{ events }}>
        <ColorPicker.Trigger />
        <ColorPicker.Content />
      </ColorPicker>
    </div>
  );
}
