import { Button } from "@/components/core/Button";
import { ColorPicker } from "@/components/core/ColorPicker";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ColorPickerMotionControllerPlayAreaDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[28rem] w-full max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("area", "hoverIn")}>
          playSlot(area)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("area", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("area", { y: 0 })}>
          Snap
        </Button>
      </div>
      <ColorPicker
        open
        defaultValue="#3b82f6"
        motionController={controller}
        motion={{
          area: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <ColorPicker.Trigger />
        <ColorPicker.Content />
      </ColorPicker>
    </div>
  );
}
