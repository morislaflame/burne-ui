import { Button } from "@/components/core/Button";
import { ScrollArea } from "@/components/core/ScrollArea";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { ScrollAreaCityList } from "../cities";

const live = createMotionEvents({
  "scroll:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "scroll:nudge": false });

export function ScrollAreaMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("thumb", "scroll:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("thumb", "scroll:nudge")}>
          Off nudge
        </Button>
      </div>
      <ScrollArea aria-label="Live" visibility="always" className="h-40 w-64" motionController={liveController} motion={{ events: live }}>
        <ScrollAreaCityList />
      </ScrollArea>
      <ScrollArea aria-label="Off" visibility="always" className="h-40 w-64" motionController={offController} motion={{ events: off }}>
        <ScrollAreaCityList />
      </ScrollArea>
    </div>
  );
}
