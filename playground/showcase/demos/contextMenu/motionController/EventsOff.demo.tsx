import { Button } from "@/components/core/Button";
import { ContextMenu } from "@/components/core/ContextMenu";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "menu:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "menu:nudge": false });

const surface =
  "min-h-control-mid items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("content", "menu:nudge")}>
          Live
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("content", "menu:nudge")}>
          Off
        </Button>
      </div>
      <div className="flex flex-wrap gap-xlarge">
        <ContextMenu open>
          <ContextMenu.Trigger className={surface}>Live</ContextMenu.Trigger>
          <ContextMenu.Content motionController={liveController} motion={{ events: live }}>
            <ContextMenu.Item>Alpha</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
        <ContextMenu open>
          <ContextMenu.Trigger className={surface}>Off</ContextMenu.Trigger>
          <ContextMenu.Content motionController={offController} motion={{ events: off }}>
            <ContextMenu.Item>Alpha</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu>
      </div>
    </div>
  );
}
