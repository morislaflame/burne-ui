import { Button } from "@/components/core/Button";
import { TextArea } from "@/components/core/TextArea";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "area:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.resizeHandle) {
      tl.fromRest(ctx.targets.resizeHandle, { y: -8, duration: 0.18 }, 0);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.resizeHandle) {
      tl.to(ctx.targets.resizeHandle, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function TextAreaMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "area:kick")}>
        Kick
      </Button>
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
