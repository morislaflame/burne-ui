import { Button } from "@/components/core/Button";
import { Header } from "@/components/core/Header";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "header:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function HeaderMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" onClick={() => controller.play("header:nudge")}>Nudge</Button>
      <Header motionController={controller} motion={{ events }}>Title</Header>
    </div>
  );
}
