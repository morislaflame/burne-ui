import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function PopoverMotionControllerDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("content", "hoverIn")}>
          playSlot(content)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("content", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("content", { y: 0 })}>
          Snap
        </Button>
      </div>
      <Popover open>
        <Popover.Trigger asChild>
          <Button size="small" variant="outline" type="button">
            Open
          </Button>
        </Popover.Trigger>
        <Popover.Content motionController={controller} motion={{
          content: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}>
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
