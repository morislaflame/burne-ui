import { Button } from "@/components/core/Button";
import { TextArea } from "@/components/core/TextArea";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function TextAreaMotionControllerPlayVsSlotDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "hoverIn")}>
          playSlot(shell)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("resizeHandle", "hoverIn")}>
          playSlot(handle)
        </Button>
        <Button size="small" variant="outline" onClick={() => void controller.playAll("hoverIn")}>
          playAll()
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <TextArea
        label="Note"
        placeholder="Write a note…"
        rows={2}
        motionController={controller}
        motion={{
          shell: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          resizeHandle: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      />
    </div>
  );
}
