import { Button } from "@/components/core/Button";
import { ContextMenu } from "@/components/core/ContextMenu";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "menu:up": { y: -6, duration: 0.28, replay: "rest" },
  "menu:rest": { y: 0, duration: 0.2 },
});

const surface =
  "min-h-control-mid items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuMotionControllerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("content", "menu:up")}>
          playSlot(content)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("content", "menu:rest")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("content", { y: 0 })}>
          Snap
        </Button>
      </div>
      <ContextMenu open>
        <ContextMenu.Trigger className={surface}>Menu</ContextMenu.Trigger>
        <ContextMenu.Content motionController={controller} motion={{ events }}>
          <ContextMenu.Item>Alpha</ContextMenu.Item>
          <ContextMenu.Item>Beta</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </div>
  );
}
