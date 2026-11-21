import { Button } from "@/components/core/Button";
import { HoverCard } from "@/components/core/HoverCard";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { HoverCardPersonBody } from "../profile";

const live = createMotionEvents({
  "card:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "card:nudge": false });

export function HoverCardMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col items-center gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" type="button" onClick={() => liveController.playSlot("title", "card:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" type="button" onClick={() => offController.playSlot("title", "card:nudge")}>
          Off nudge
        </Button>
      </div>
      <HoverCard
        defaultOpen
        trigger={<Button variant="outline">Live</Button>}
        title="Live"
        description="Mathematician"
        classNames={{ content: "w-64" }}
        motionController={liveController}
        motion={{ events: live }}
      >
        <HoverCardPersonBody />
      </HoverCard>
      <HoverCard
        defaultOpen
        trigger={<Button variant="outline">Off</Button>}
        title="Off"
        description="Mathematician"
        classNames={{ content: "w-64" }}
        motionController={offController}
        motion={{ events: off }}
      >
        <HoverCardPersonBody />
      </HoverCard>
    </div>
  );
}
