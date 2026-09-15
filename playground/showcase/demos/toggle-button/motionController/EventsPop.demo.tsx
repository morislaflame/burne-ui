import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { IoHeartOutline } from "react-icons/io5";

const events = createMotionEvents({
  "like:pop": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { scale: 1.06, duration: 0.18 }, 0);
    if (ctx.targets.iconStart) {
      tl.fromRest(ctx.targets.iconStart, { rotation: 24, scale: 1.16, duration: 0.32, ease: "back.out(1.7)" }, 0);
    }
    if (ctx.targets.text) {
      tl.fromRest(ctx.targets.text, { y: -6, duration: 0.22 }, 0.04);
    }
    return tl;
  },
});

export function ToggleButtonMotionEventsPopDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("like:pop")}>
        Pop
      </Button>
      <ToggleButton
        variant="outline"
        icon={<IoHeartOutline aria-hidden />}
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
      >
        Like
      </ToggleButton>
    </div>
  );
}
