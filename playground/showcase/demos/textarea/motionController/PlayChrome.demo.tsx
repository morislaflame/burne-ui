import { Button } from "@/components/core/Button";
import { TextArea } from "@/components/core/TextArea";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function TextAreaMotionControllerPlayChromeDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("label", "hoverIn")}>
          playSlot(label)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("hint", "hoverIn")}>
          playSlot(hint)
        </Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("hoverOut")}>
          Reset
        </Button>
      </div>
      <TextArea
        motionController={controller}
        motion={{
          label: {
            hoverIn: { y: -4, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
          hint: {
            hoverIn: { y: -6, duration: 0.22, replay: "rest" },
            hoverOut: { y: 0, duration: 0.16 },
          },
        }}
      >
        <TextArea.Label>Note</TextArea.Label>
        <TextArea.Control placeholder="Write a note…" rows={2} />
        <TextArea.Hint>Root chrome scope — not the Control host.</TextArea.Hint>
      </TextArea>
    </div>
  );
}
