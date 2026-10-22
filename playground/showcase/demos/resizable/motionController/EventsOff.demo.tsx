import { Button } from "@/components/core/Button";
import { Resizable } from "@/components/core/Resizable";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "split:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "split:nudge": false });

export function ResizableMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("split:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("split:nudge")}>Off</Button>
      </div>
      <Resizable motionController={liveController} motion={{ events: live }}><Resizable.Panel>A</Resizable.Panel><Resizable.Handle /><Resizable.Panel>B</Resizable.Panel></Resizable>
      <Resizable motionController={offController} motion={{ events: off }}><Resizable.Panel>A</Resizable.Panel><Resizable.Handle /><Resizable.Panel>B</Resizable.Panel></Resizable>
    </div>
  );
}
