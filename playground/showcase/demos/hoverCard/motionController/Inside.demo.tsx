import { Button } from "@/components/core/Button";
import { HoverCard } from "@/components/core/HoverCard";
import { createMotionEvents, useMotionController, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { HoverCardPersonTrigger } from "../profile";

const events = createMotionEvents({
  "card:ping": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function PingTitle() {
  const controller = useMotionController();
  return (
    <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("title", "card:ping")}>
      Ping title
    </Button>
  );
}

export function HoverCardMotionInsideDemo() {
  const controller = useMotionControllerHandle();

  return (
    <HoverCard
      defaultOpen
      trigger={<HoverCardPersonTrigger />}
      title="Ada Lovelace"
      description="The button reads the card controller."
      classNames={{ content: "w-64" }}
      motionController={controller}
      motion={{ events }}
    >
      <PingTitle />
    </HoverCard>
  );
}
