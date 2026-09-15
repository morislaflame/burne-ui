import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function TooltipMotionControllerDemo() {
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
      <Tooltip open delayShowMs={0}>
        <Tooltip.Trigger>
          <Button size="small" variant="outline" type="button">
            Trigger
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content motionController={controller} motion={{
          content: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}>
          <Tooltip.Title>Title</Tooltip.Title>
          <Tooltip.Description>Handle lives on Content — play() skips.</Tooltip.Description>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
