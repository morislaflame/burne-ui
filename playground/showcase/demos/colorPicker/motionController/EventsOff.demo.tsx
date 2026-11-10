import { Button } from "@/components/core/Button";
import { ColorPicker } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "picker:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "picker:nudge": false });

export function ColorPickerMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex min-h-[28rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("contentPanel", "picker:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("contentPanel", "picker:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex flex-wrap gap-xlarge">
        <ColorPicker open defaultValue="#22c55e" motionController={liveController} motion={{ events: live }}>
          <ColorPicker.Trigger />
          <ColorPicker.Content />
        </ColorPicker>
        <ColorPicker open defaultValue="#ef4444" motionController={offController} motion={{ events: off }}>
          <ColorPicker.Trigger />
          <ColorPicker.Content />
        </ColorPicker>
      </div>
    </div>
  );
}
