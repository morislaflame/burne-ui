import { Button } from "@/components/core/Button";
import { TextArea } from "@/components/core/TextArea";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "area:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function TextAreaMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "area:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("shell");
            controller.set("shell", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <TextArea
        label="Note"
        placeholder="Write a note…"
        rows={2}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
