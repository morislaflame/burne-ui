import { Button } from "@/components/core/Button";
import { Sidebar } from "@/components/core/Sidebar";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "sidebar:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "sidebar:nudge": false });

export function SidebarMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("sidebar:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("sidebar:nudge")}>Off</Button>
      </div>
      <Sidebar aria-label="Sections" motionController={liveController} motion={{ events: live }}>Nav</Sidebar>
      <Sidebar aria-label="Sections" motionController={offController} motion={{ events: off }}>Nav</Sidebar>
    </div>
  );
}
