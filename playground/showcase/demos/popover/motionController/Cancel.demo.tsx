import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "popover:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function PopoverMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("content", "popover:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("content");
            controller.set("content", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <Popover open>
        <Popover.Trigger asChild>
          <Button size="small" variant="outline" type="button">
            Open
          </Button>
        </Popover.Trigger>
        <Popover.Content motionController={controller} motion={{ events }}>
          <Popover.Header>
            <Popover.Title>Title</Popover.Title>
            <Popover.Description>Description</Popover.Description>
          </Popover.Header>
          <Popover.Body>Handle lives on Content — play() skips.</Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  );
}
