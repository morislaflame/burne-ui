import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "popover:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "popover:nudge": false });

export function PopoverMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("content", "popover:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("content", "popover:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex flex-wrap gap-xlarge">
      <Popover open>
        <Popover.Trigger asChild>
          <Button size="small" variant="outline" type="button">
            Open
          </Button>
        </Popover.Trigger>
        <Popover.Content motionController={liveController} motion={{ events: live }}>
          <Popover.Header>
            <Popover.Title>Title</Popover.Title>
            <Popover.Description>Description</Popover.Description>
          </Popover.Header>
          <Popover.Body>Handle lives on Content — play() skips.</Popover.Body>
        </Popover.Content>
      </Popover>
      <Popover open>
        <Popover.Trigger asChild>
          <Button size="small" variant="outline" type="button">
            Open
          </Button>
        </Popover.Trigger>
        <Popover.Content motionController={offController} motion={{ events: off }}>
          <Popover.Header>
            <Popover.Title>Title</Popover.Title>
            <Popover.Description>Description</Popover.Description>
          </Popover.Header>
          <Popover.Body>Handle lives on Content — play() skips.</Popover.Body>
        </Popover.Content>
      </Popover>
      </div>
    </div>
  );
}
