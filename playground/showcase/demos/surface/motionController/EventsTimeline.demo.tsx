import { Button } from "@/components/core/Button";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "panel:stack": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -12, duration: 0.18, ease: "power2.out" }, 0);
    tl.to(ctx.el, { scale: 1.04, duration: 0.16, ease: "back.out(1.8)" }, 0.1);
    tl.to(ctx.el, { y: 0, scale: 1, duration: 0.24, ease: "power2.inOut" }, 0.32);
    return tl;
  },
});

export function SurfaceMotionEventsTimelineDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("panel:stack")}>
        Stack
      </Button>
      <Surface
        variant="secondary"
        padding="mid"
        radius="mid"
        className="max-w-xs"
        motionController={controller}
        motion={{ events }}
      >
        <Text as="p" variant="small">
          One event, three tweens on a timeline — lift, scale, settle.
        </Text>
      </Surface>
    </div>
  );
}
