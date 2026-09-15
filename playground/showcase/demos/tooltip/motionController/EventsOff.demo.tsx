import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "tooltip:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "tooltip:nudge": false });

export function TooltipMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("content", "tooltip:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("content", "tooltip:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex flex-wrap gap-xlarge">
      <Tooltip open delayShowMs={0}>
        <Tooltip.Trigger>
          <Button size="small" variant="outline" type="button">
            Trigger
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content motionController={liveController} motion={{ events: live }}>
          <Tooltip.Title>Title</Tooltip.Title>
          <Tooltip.Description>Handle lives on Content — play() skips.</Tooltip.Description>
        </Tooltip.Content>
      </Tooltip>
      <Tooltip open delayShowMs={0}>
        <Tooltip.Trigger>
          <Button size="small" variant="outline" type="button">
            Trigger
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content motionController={offController} motion={{ events: off }}>
          <Tooltip.Title>Title</Tooltip.Title>
          <Tooltip.Description>Handle lives on Content — play() skips.</Tooltip.Description>
        </Tooltip.Content>
      </Tooltip>
      </div>
    </div>
  );
}
