import { Button } from "@/components/core/Button";
import { ColorPicker } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "picker:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function ColorPickerMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[28rem] w-full max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("contentPanel", "picker:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("contentPanel");
            controller.set("contentPanel", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <ColorPicker open defaultValue="#3b82f6" motionController={controller} motion={{ events }}>
        <ColorPicker.Trigger />
        <ColorPicker.Content />
      </ColorPicker>
    </div>
  );
}
