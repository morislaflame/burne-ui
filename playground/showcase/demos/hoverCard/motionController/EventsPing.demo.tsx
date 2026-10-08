import { Button } from "@/components/core/Button";
import { HoverCard } from "@/components/core/HoverCard";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { HoverCardPersonBody, HoverCardPersonTrigger } from "../profile";

const events = createMotionEvents({
  "card:ping": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function HoverCardMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col items-center gap-2xlarge">
      <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("title", "card:ping")}>
        Ping
      </Button>
      <HoverCard
        defaultOpen
        trigger={<HoverCardPersonTrigger />}
        title="Ada Lovelace"
        description="Mathematician"
        classNames={{ content: "w-64" }}
        motionController={controller}
        motion={{ events }}
      >
        <HoverCardPersonBody />
      </HoverCard>
    </div>
  );
}
