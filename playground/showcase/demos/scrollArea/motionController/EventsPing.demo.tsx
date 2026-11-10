import { Button } from "@/components/core/Button";
import { ScrollArea } from "@/components/core/ScrollArea";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { ScrollAreaCityList } from "../cities";

const events = createMotionEvents({
  "scroll:ping": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ScrollAreaMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("thumb", "scroll:ping")}>
        Ping
      </Button>
      <ScrollArea
        aria-label="Cities"
        visibility="always"
        className="h-48 w-64"
        motionController={controller}
        motion={{ events }}
      >
        <ScrollAreaCityList />
      </ScrollArea>
    </div>
  );
}
