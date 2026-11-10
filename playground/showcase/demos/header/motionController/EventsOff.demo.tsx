import { Button } from "@/components/core/Button";
import { Header } from "@/components/core/Header";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "header:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "header:nudge": false });

export function HeaderMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("header:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("header:nudge")}>Off</Button>
      </div>
      <Header motionController={liveController} motion={{ events: live }}>Title</Header>
      <Header motionController={offController} motion={{ events: off }}>Title</Header>
    </div>
  );
}
