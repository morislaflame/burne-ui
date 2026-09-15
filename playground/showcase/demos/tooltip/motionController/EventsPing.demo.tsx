import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "tooltip:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function TooltipMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("content", "tooltip:nudge")}>
          Nudge
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
