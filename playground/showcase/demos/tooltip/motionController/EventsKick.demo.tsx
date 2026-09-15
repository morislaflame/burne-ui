import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "tooltip:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.title) {
      tl.fromRest(ctx.targets.title, { y: -8, duration: 0.18 }, 0);
    }
    if (ctx.targets.description) {
      tl.fromRest(ctx.targets.description, { y: -10, duration: 0.18 }, 0.04);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.title) {
      tl.to(ctx.targets.title, { y: 0, duration: 0.22 }, 0.22);
    }
    if (ctx.targets.description) {
      tl.to(ctx.targets.description, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function TooltipMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("content", "tooltip:kick")}>
          Kick
        </Button>
      </div>
      <Tooltip open delayShowMs={0}>
        <Tooltip.Trigger>
          <Button size="small" variant="outline" type="button">
            Trigger
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content motionController={controller} motion={{ events }}>
          <Tooltip.Title>Title</Tooltip.Title>
          <Tooltip.Description>Handle lives on Content — play() skips.</Tooltip.Description>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
