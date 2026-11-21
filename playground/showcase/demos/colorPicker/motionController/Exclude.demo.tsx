import { Button } from "@/components/core/Button";
import { ColorPicker } from "@/components/core/ColorPicker";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function ColorPickerMotionControllerExcludeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[28rem] w-full max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          onClick={() => void controller.playAll("hoverIn", { exclude: ["hexInput"] })}
        >
          Exclude hexInput
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <ColorPicker
        open
        defaultValue="#3b82f6"
        motionController={controller}
        motion={{
          contentPanel: {
            hoverIn: { y: -2, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          hexInput: {
            hoverIn: { y: -10, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          presets: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <ColorPicker.Trigger />
        <ColorPicker.Content presets={["#ef4444", "#3b82f6"]} />
      </ColorPicker>
    </div>
  );
}
