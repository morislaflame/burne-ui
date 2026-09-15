import { Button } from "@/components/core/Button";
import { ColorPicker } from "@/components/core/ColorPicker";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ColorPickerMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[28rem] w-full max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("contentPanel", "hoverIn")}>
          playSlot(contentPanel)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("contentPanel", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("contentPanel", { y: 0 })}>
          Snap
        </Button>
      </div>
      <ColorPicker
        open
        defaultValue="#3b82f6"
        motionController={controller}
        motion={{
          contentPanel: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        <ColorPicker.Trigger />
        <ColorPicker.Content />
      </ColorPicker>
    </div>
  );
}
