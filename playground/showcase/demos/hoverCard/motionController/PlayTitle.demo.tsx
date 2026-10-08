import { Button } from "@/components/core/Button";
import { HoverCard } from "@/components/core/HoverCard";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { HoverCardPersonBody, HoverCardPersonTrigger } from "../profile";

export function HoverCardMotionPlayTitleDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col items-center gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("title", "hoverIn")}>
          Lift
        </Button>
        <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("title", "hoverOut")}>
          Rest
        </Button>
        <Button size="small" variant="ghost" type="button" onClick={() => controller.set("title", { y: 0 })}>
          Snap
        </Button>
      </div>
      <HoverCard
        defaultOpen
        trigger={<HoverCardPersonTrigger />}
        title="Ada Lovelace"
        description="Mathematician"
        classNames={{ content: "w-64" }}
        motionController={controller}
        motion={{
          title: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}
      >
        <HoverCardPersonBody />
      </HoverCard>
    </div>
  );
}
