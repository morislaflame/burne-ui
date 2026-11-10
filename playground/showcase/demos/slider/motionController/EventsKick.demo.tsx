import { Button } from "@/components/core/Button";
import { Slider } from "@/components/core/Slider";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "slider:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.thumb) {
      tl.fromRest(ctx.targets.thumb, { y: -8, duration: 0.18 }, 0);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.thumb) {
      tl.to(ctx.targets.thumb, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function SliderMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "slider:kick")}>
        Kick
      </Button>
      <Slider
        label="Volume"
        showValue
        defaultValue={55}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
