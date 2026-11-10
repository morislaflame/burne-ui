import { Button } from "@/components/core/Button";
import { Resizable } from "@/components/core/Resizable";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "split:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ResizableMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" onClick={() => controller.play("split:nudge")}>Nudge</Button>
      <Resizable motionController={controller} motion={{ events }}><Resizable.Panel>A</Resizable.Panel><Resizable.Handle /><Resizable.Panel>B</Resizable.Panel></Resizable>
    </div>
  );
}
